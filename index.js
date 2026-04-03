const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder
} = require('discord.js');

const QRCode = require('qrcode');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.TOKEN;

// ================= CONFIG =================
let chavePix = "NÃO DEFINIDA";

const precos = {
  "1 DIA": 17.99,
  "3 DIAS": 27.99,
  "7 DIAS": 40.00,
  "30 DIAS": 85.00
};

// ================= ONLINE =================
client.on("ready", () => {
  console.log("✅ BOT ONLINE");
});

// ================= COMANDOS =================
client.on("messageCreate", async (msg) => {
  if (!msg.guild || msg.author.bot) return;

  // SALVAR PIX
  if (msg.content.startsWith("!chave")) {
    const chave = msg.content.split(" ").slice(1).join(" ");
    if (!chave) return msg.reply("❌ Coloque a chave PIX");

    chavePix = chave;
    return msg.reply("✅ Chave PIX salva!");
  }

  // CRIAR SERVIDOR
  if (msg.content === "!painel") {

    await msg.reply("🚀 Criando servidor...");

    const guild = msg.guild;

    // ================= CARGOS =================
    await guild.roles.create({ name: "👑 DONO", color: "#000000" });
    await guild.roles.create({ name: "👑 SUB DONO", color: "#000000" });
    await guild.roles.create({ name: "GERENTE", color: "#ff0000" });

    // ================= CATEGORIAS =================
    const catTickets = await guild.channels.create({
      name: "🎫 TICKETS",
      type: ChannelType.GuildCategory
    });

    const catGeral = await guild.channels.create({
      name: "🗨️ GERAL",
      type: ChannelType.GuildCategory
    });

    const catAndroid = await guild.channels.create({
      name: "📱 ANDROID",
      type: ChannelType.GuildCategory
    });

    const catIOS = await guild.channels.create({
      name: "🍎 IOS",
      type: ChannelType.GuildCategory
    });

    // ================= CANAIS =================
    async function criar(nome, categoria) {
      return await guild.channels.create({
        name: nome,
        parent: categoria.id
      });
    }

    const apk = await criar("🏅android", catGeral);
    const drip = await criar("🏅drip", catAndroid);

    const rage = await criar("🏅rage", catIOS);
    const safe = await criar("🏅safe", catIOS);
    const bypass = await criar("🏅bypass", catIOS);
    const wifi = await criar("🏅wifi", catIOS);

    // ================= PAINEL =================
    async function painel(canal, nome) {

      const embed = new EmbedBuilder()
        .setColor("#a020f0")
        .setTitle(`🔥 ${nome}`)
        .setDescription("Clique em comprar")
        .setImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC7vNX0Nd8YF3uAA1R8nUyKV1H-6Lym9U9DQ&s");

      const botao = new ButtonBuilder()
        .setCustomId("buy_" + nome)
        .setLabel("Comprar")
        .setStyle(ButtonStyle.Success);

      await canal.send({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(botao)]
      });
    }

    await painel(apk, "ANDROID");
    await painel(drip, "DRIP");
    await painel(rage, "RAGE");
    await painel(safe, "SAFE");
    await painel(bypass, "BYPASS");
    await painel(wifi, "WIFI");

    msg.reply("✅ Servidor pronto!");
  }
});

// ================= INTERAÇÕES =================
client.on("interactionCreate", async (interaction) => {

  // BOTÃO COMPRAR
  if (interaction.isButton() && interaction.customId.startsWith("buy_")) {

    const nome = interaction.customId.split("_")[1];

    const menu = new StringSelectMenuBuilder()
      .setCustomId("plano_" + nome)
      .setPlaceholder("Escolha o plano")
      .addOptions([
        { label: "1 DIA - 17,99", value: "1 DIA" },
        { label: "3 DIAS - 27,99", value: "3 DIAS" },
        { label: "7 DIAS - 40", value: "7 DIAS" },
        { label: "30 DIAS - 85", value: "30 DIAS" }
      ]);

    return interaction.reply({
      content: "Escolha o plano:",
      components: [new ActionRowBuilder().addComponents(menu)],
      ephemeral: true
    });
  }

  // CRIAR TICKET
  if (interaction.isStringSelectMenu()) {

    const plano = interaction.values[0];
    const valor = precos[plano];

    const guild = interaction.guild;

    const categoria = guild.channels.cache.find(c => c.name === "🎫 TICKETS");

    const canal = await guild.channels.create({
      name: "ticket-" + interaction.user.username,
      parent: categoria.id,
      permissionOverwrites: [
        { id: guild.roles.everyone, deny: [PermissionsBitField.Flags.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel] }
      ]
    });

    const pix = `PAGUE R$${valor} PARA ${chavePix}`;
    const qr = await QRCode.toDataURL(pix);

    const embed = new EmbedBuilder()
      .setColor("#a020f0")
      .setTitle("💸 PAGAMENTO")
      .setDescription(`Plano: ${plano}\nValor: R$ ${valor}\n\nPIX:\n${chavePix}`)
      .setImage(qr);

    const btn = new ButtonBuilder()
      .setCustomId("confirmar")
      .setLabel("Confirmar")
      .setStyle(ButtonStyle.Primary);

    await canal.send({
      content: `${interaction.user}`,
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(btn)]
    });

    return interaction.reply({ content: "🎫 Ticket criado!", ephemeral: true });
  }

  // CONFIRMAR
  if (interaction.isButton() && interaction.customId === "confirmar") {

    const permitido = ["👑 DONO", "👑 SUB DONO", "GERENTE"];

    const ok = interaction.member.roles.cache.some(r => permitido.includes(r.name));

    if (!ok) {
      return interaction.reply({ content: "❌ Sem permissão", ephemeral: true });
    }

    return interaction.reply("✅ Pagamento confirmado!");
  }

});

client.login(TOKEN);
