const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = "SEU_TOKEN_AQUI";

// ======================
// 🟣 EMBED PADRÃO ROXO
// ======================
function embedRoxo(titulo, desc) {
  return new EmbedBuilder()
    .setColor("#8000FF")
    .setTitle(titulo)
    .setDescription(desc);
}

// ======================
// 👤 AO ENTRAR
// ======================
client.on("guildMemberAdd", async (member) => {
  const canal = member.guild.channels.cache.find(c => c.name === "boas-vindas");

  // dar cargo membro
  const cargo = member.guild.roles.cache.find(r => r.name === "👨‍👨‍👦‍👦membros");
  if (cargo) member.roles.add(cargo);

  if (canal) {
    canal.send({
      content: `${member}`,
      embeds: [
        embedRoxo("Bem-vindo!", `${member} entrou no servidor, seja bem vindo(a)!`)
          .setImage("https://assetsio.gnwcdn.com/roblox-blox-fruits-codes-list.jpg?width=690&quality=85&format=jpg&dpr=3&auto=webp")
      ]
    });
  }
});

// ======================
// ⚙️ CRIAR SERVIDOR
// ======================
client.on("messageCreate", async (msg) => {
  if (msg.content === "!criar") {
    if (!msg.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return msg.reply("Sem permissão.");

    const guild = msg.guild;

    // ======================
    // 🎭 CARGOS
    // ======================
    const dono = await guild.roles.create({ name: "𓆩♛𓆪dono", color: "#000000" });
    const sub = await guild.roles.create({ name: "🜲sub dono", color: "#aaaaaa" });
    const staff = await guild.roles.create({ name: "[⚒️Staff⚒️]", color: "#ff0000" });
    const suporte = await guild.roles.create({ name: "🛡️suporte", color: "#00008b" });
    const crew = await guild.roles.create({ name: "🏴‍☠️crew", color: "#00ffff" });
    const membro = await guild.roles.create({ name: "👨‍👨‍👦‍👦membros", color: "#0099ff" });

    // ======================
    // 📁 INFORMAÇÕES
    // ======================
    const info = await guild.channels.create({ name: "📌 INFORMAÇÕES", type: ChannelType.GuildCategory });

    await guild.channels.create({ name: "boas-vindas", type: ChannelType.GuildText, parent: info.id });
    await guild.channels.create({ name: "regras", type: ChannelType.GuildText, parent: info.id });
    await guild.channels.create({ name: "parceria", type: ChannelType.GuildText, parent: info.id });
    await guild.channels.create({ name: "chat", type: ChannelType.GuildText, parent: info.id });

    // ======================
    // 🍍 BLOX FRUITS
    // ======================
    const blox = await guild.channels.create({ name: "🍍 BLOX FRUITS", type: ChannelType.GuildCategory });

    const canais = [
      "trade-frutas",
      "trial-raça",
      "leviathan",
      "ilha-do-vulcao",
      "evento-marinho",
      "ilha-da-kitsune",
      "servidor-privado",
      "crews"
    ];

    for (let c of canais) {
      await guild.channels.create({ name: c, type: ChannelType.GuildText, parent: blox.id });
    }

    // ======================
    // 🎤 CALLS
    // ======================
    const calls = await guild.channels.create({ name: "🎤 CALLS", type: ChannelType.GuildCategory });

    const callsList = [
      "call-1",
      "call-2",
      "call-trial-raça",
      "call-leviathan",
      "call-ilha-vulcao",
      "call-kitsune",
      "call-evento-marinho"
    ];

    for (let c of callsList) {
      await guild.channels.create({ name: c, type: ChannelType.GuildVoice, parent: calls.id });
    }

    // ======================
    // 🎫 SUPORTE
    // ======================
    const suporteCat = await guild.channels.create({ name: "🎫 SUPORTE", type: ChannelType.GuildCategory });

    const suporteCanal = await guild.channels.create({
      name: "suporte",
      type: ChannelType.GuildText,
      parent: suporteCat.id
    });

    const botao = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("abrir_ticket")
        .setLabel("Abrir Suporte")
        .setStyle(ButtonStyle.Primary)
    );

    await suporteCanal.send({
      embeds: [
        embedRoxo(
          "Central de Atendimento | Gbz bloxer",
          `Precisa de ajuda?\n\nAbra um ticket e aguarde um membro da nossa equipe assumir seu atendimento.\n\nTodo suporte é privado.\n\nAgradecemos sua paciência 🚀`
        )
      ],
      components: [botao]
    });

    msg.reply("Servidor criado com sucesso 🚀");
  }

  // ======================
  // 🔒 LOCK / UNLOCK
  // ======================
  if (msg.content === "+lock") {
    msg.channel.permissionOverwrites.edit(msg.guild.roles.everyone, {
      SendMessages: false
    });
    msg.reply("🔒 Canal bloqueado");
  }

  if (msg.content === "+unlock") {
    msg.channel.permissionOverwrites.edit(msg.guild.roles.everyone, {
      SendMessages: true
    });
    msg.reply("🔓 Canal desbloqueado");
  }
});

// ======================
// 🎫 SISTEMA DE TICKET
// ======================
client.on("interactionCreate", async (i) => {
  if (!i.isButton()) return;

  if (i.customId === "abrir_ticket") {
    const canal = await i.guild.channels.create({
      name: `ticket-${i.user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: i.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: i.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel]
        }
      ]
    });

    const botoes = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("fechar")
        .setLabel("Fechar")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("assumir")
        .setLabel("Assumir")
        .setStyle(ButtonStyle.Success)
    );

    canal.send({
      embeds: [
        embedRoxo(
          "SUPORTE Gbz bloxer",
          `Olá ${i.user}, descreva seu problema.\n\n⚠️ Não marque staff.`
        )
      ],
      components: [botoes]
    });

    i.reply({ content: `Ticket criado: ${canal}`, ephemeral: true });
  }

  if (i.customId === "fechar") {
    if (!i.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
      return i.reply({ content: "Sem permissão", ephemeral: true });

    i.channel.delete();
  }

  if (i.customId === "assumir") {
    i.reply("Ticket assumido ✅");
  }
});

client.login(TOKEN);
