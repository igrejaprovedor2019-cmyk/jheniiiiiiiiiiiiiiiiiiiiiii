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

let chavePix = "NÃO DEFINIDA";

const precos = {
  "1 DIA": 17.99,
  "3 DIAS": 27.99,
  "7 DIAS": 40.00,
  "30 DIAS": 85.00
};

client.on("ready", () => {
  console.log("✅ BOT ONLINE");
});

client.on("messageCreate", async (msg) => {
  if (!msg.guild || msg.author.bot) return;

  // SALVAR PIX
  if (msg.content.startsWith("!chave")) {
    const chave = msg.content.split(" ").slice(1).join(" ");
    if (!chave) return msg.reply("❌ Coloque a chave PIX");

    chavePix = chave;
    return msg.reply("✅ Chave PIX salva!");
  }

  // CRIAR SERVIDOR COMPLETO
  if (msg.content === "!painel") {

    await msg.reply("🚀 Criando servidor COMPLETO...");

    const guild = msg.guild;

    // ================= CARGOS =================
    await guild.roles.create({ name: "👑 DONO", color: "#000000" });
    await guild.roles.create({ name: "👑 SUB DONO", color: "#000000" });
    await guild.roles.create({ name: "GERENTE", color: "#ff0000" });

    // ================= CATEGORIAS =================
    const inicio = await guild.channels.create({ name: "Início / Recepção", type: ChannelType.GuildCategory });
    const comunidade = await guild.channels.create({ name: "【 COMUNIDADE 】", type: ChannelType.GuildCategory });
    const geral = await guild.channels.create({ name: "🗨️ gαrαl", type: ChannelType.GuildCategory });
    const android = await guild.channels.create({ name: "📱 FFH4X ANDROID", type: ChannelType.GuildCategory });
    const ios = await guild.channels.create({ name: "🍎 FFH4X IOS", type: ChannelType.GuildCategory });
    const suporte = await guild.channels.create({ name: "🎟️ ѕupoʀte", type: ChannelType.GuildCategory });
    const calls = await guild.channels.create({ name: "🔊 CALLS", type: ChannelType.GuildCategory });
    const downloads = await guild.channels.create({ name: "LINK DOS XITS 👇", type: ChannelType.GuildCategory });
    const callVip = await guild.channels.create({ name: "↳ CALL ATENDIMENTO", type: ChannelType.GuildCategory });
    const tickets = await guild.channels.create({ name: "🎫 TICKETS", type: ChannelType.GuildCategory });

    // ================= CANAIS =================
    const boas = await guild.channels.create({ name: "👾 boas-vindaꜱ", parent: inicio.id });
    await guild.channels.create({ name: "📢 ‼️ αvιѕoѕ!", parent: inicio.id });
    await guild.channels.create({ name: "📜 termon", parent: inicio.id });

    await guild.channels.create({ name: "🛒・coмo・αdquιrιr", parent: comunidade.id });
    await guild.channels.create({ name: "😈・ѕejα-dα-noѕѕα-equιpe", parent: comunidade.id });
    await guild.channels.create({ name: "🔐・verificação", parent: comunidade.id });

    await guild.channels.create({ name: "🗨️・gerαl", parent: geral.id });

    const apk = await guild.channels.create({ name: "🏅・αpk-mod-αndroιd", parent: geral.id });

    const contas = await guild.channels.create({ name: "🏅・contαѕ-ghoѕt-ff", parent: android.id });
    const holo = await guild.channels.create({ name: "🏅 hologrαmα-αndroιd", parent: android.id });
    const drip = await guild.channels.create({ name: "🏅・drιp-clιente", parent: android.id });

    const rage = await guild.channels.create({ name: "🏅・ιphone-rαge", parent: ios.id });
    const safe = await guild.channels.create({ name: "🏅・ιphone-ѕαfe", parent: ios.id });
    const bypass = await guild.channels.create({ name: "🏅・ʙypαѕѕ-full", parent: ios.id });
    const wifi = await guild.channels.create({ name: "🏅・hѕ-wιfι", parent: ios.id });

    await guild.channels.create({ name: "🎟️・𝓼𝓾𝓹𝓸𝓻𝓽𝓮", parent: suporte.id });
    await guild.channels.create({ name: "ATENDIMENTO 1", type: 2, parent: suporte.id });
    await guild.channels.create({ name: "ATENDIMENTO 2", type: 2, parent: suporte.id });
    await guild.channels.create({ name: "ATENDIMENTO 3", type: 2, parent: suporte.id });

    await guild.channels.create({ name: "🔊 Geral 1", type: 2, parent: calls.id });
    await guild.channels.create({ name: "🔊 Geral 2", type: 2, parent: calls.id });
    await guild.channels.create({ name: "🔊 Suporte 1", type: 2, parent: calls.id });
    await guild.channels.create({ name: "🔊 Suporte 2", type: 2, parent: calls.id });

    await guild.channels.create({ name: "🔐 ↳ dowload-android", parent: downloads.id });
    await guild.channels.create({ name: "🔐 ↳ dowload-ios", parent: downloads.id });
    await guild.channels.create({ name: "🔐 ↳ dowload-wifi", parent: downloads.id });
    await guild.channels.create({ name: "🔐 ↳ dowload-drip", parent: downloads.id });

    await guild.channels.create({ name: "🔊 CALL ATENDIMENTO VIP", type: 2, parent: callVip.id });

    // ================= PAINEL =================
    async function painel(canal, nome) {
      const embed = new EmbedBuilder()
        .setColor("#a020f0")
        .setTitle(`🔥😈 ${nome} 😈🔥`)
        .setDescription("Clique em comprar")
        .setImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC7vNX0Nd8YF3uAA1R8nUyKV1H-6Lym9U9DQ&s");

      const btn = new ButtonBuilder()
        .setCustomId("buy_" + nome)
        .setLabel("Comprar")
        .setStyle(ButtonStyle.Success);

      await canal.send({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(btn)]
      });
    }

    await painel(apk, "ANDROID");
    await painel(contas, "CONTAS");
    await painel(holo, "HOLOGRAMA");
    await painel(drip, "DRIP");
    await painel(rage, "RAGE");
    await painel(safe, "SAFE");
    await painel(bypass, "BYPASS");
    await painel(wifi, "WIFI");

    msg.reply("✅ SERVIDOR COMPLETO CRIADO!");
  }
});

// ================= INTERAÇÕES =================
client.on("interactionCreate", async (interaction) => {

  if (interaction.isButton() && interaction.customId.startsWith("buy_")) {

    const nome = interaction.customId.split("_")[1];

    const menu = new StringSelectMenuBuilder()
      .setCustomId("plano_" + nome)
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

    const qr = await QRCode.toDataURL(`PIX ${valor} ${chavePix}`);

    const embed = new EmbedBuilder()
      .setTitle("💸 PAGAMENTO")
      .setDescription(`Plano: ${plano}\nValor: R$ ${valor}\nPIX: ${chavePix}`)
      .setImage(qr);

    await canal.send({ embeds: [embed] });

    return interaction.reply({ content: "🎫 Ticket criado!", ephemeral: true });
  }

});

client.login(TOKEN);
