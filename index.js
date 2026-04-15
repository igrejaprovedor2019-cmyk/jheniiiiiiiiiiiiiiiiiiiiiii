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

// 🔴 COLOCA SEU TOKEN AQUI PRA TESTAR
const TOKEN = "SEU_TOKEN_AQUI";

// ================= EMBED ROXO =================
const roxo = "#8000FF";
function embed(t, d) {
  return new EmbedBuilder().setColor(roxo).setTitle(t).setDescription(d);
}

// ================= BOAS VINDAS =================
client.on("guildMemberAdd", async (member) => {
  const canal = member.guild.channels.cache.find(c => c.name === "boas-vindas");

  const cargo = member.guild.roles.cache.find(r => r.name === "👨‍👨‍👦‍👦membros");
  if (cargo) member.roles.add(cargo).catch(() => {});

  if (canal) {
    canal.send({
      content: `${member}`,
      embeds: [
        embed("Bem-vindo!", `${member} entrou no servidor, seja bem vindo(a)!`)
          .setImage("https://assetsio.gnwcdn.com/roblox-blox-fruits-codes-list.jpg")
      ]
    });
  }
});

// ================= COMANDOS =================
client.on("messageCreate", async (msg) => {
  if (!msg.guild) return;

  // ===== CRIAR SERVIDOR =====
  if (msg.content === "!criar") {

    if (!msg.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return msg.reply("Sem permissão.");

    const g = msg.guild;

    // ===== CARGOS =====
    const cargos = {};
    cargos.dono = await g.roles.create({ name: "𓆩♛𓆪dono", color: "#000000" });
    cargos.sub = await g.roles.create({ name: "🜲sub dono", color: "#aaaaaa" });
    cargos.staff = await g.roles.create({ name: "[⚒️Staff⚒️]", color: "#ff0000" });
    cargos.suporte = await g.roles.create({ name: "🛡️suporte", color: "#00008b" });
    cargos.crew = await g.roles.create({ name: "🏴‍☠️crew", color: "#00ffff" });
    cargos.membro = await g.roles.create({ name: "👨‍👨‍👦‍👦membros", color: "#0099ff" });

    // ===== INFORMAÇÕES =====
    const info = await g.channels.create({ name: "📌 INFORMAÇÕES", type: ChannelType.GuildCategory });

    await g.channels.create({ name: "boas-vindas", type: ChannelType.GuildText, parent: info.id });
    await g.channels.create({ name: "regras", type: ChannelType.GuildText, parent: info.id });
    await g.channels.create({ name: "parceria", type: ChannelType.GuildText, parent: info.id });
    await g.channels.create({ name: "chat", type: ChannelType.GuildText, parent: info.id });

    // ===== BLOX FRUITS =====
    const blox = await g.channels.create({ name: "🍍 BLOX FRUITS", type: ChannelType.GuildCategory });

    const textos = [
      "trade-frutas","trial-raça","leviathan","ilha-do-vulcao",
      "evento-marinho","ilha-da-kitsune","servidor-privado","crews"
    ];

    for (let t of textos) {
      await g.channels.create({ name: t, type: ChannelType.GuildText, parent: blox.id });
    }

    // ===== CALLS =====
    const calls = await g.channels.create({ name: "🎤 CALLS", type: ChannelType.GuildCategory });

    const voz = [
      "call-1","call-2","call-trial-raça","call-leviathan",
      "call-ilha-vulcao","call-kitsune","call-evento-marinho"
    ];

    for (let v of voz) {
      await g.channels.create({ name: v, type: ChannelType.GuildVoice, parent: calls.id });
    }

    // ===== SUPORTE =====
    const suporteCat = await g.channels.create({ name: "🎫 SUPORTE", type: ChannelType.GuildCategory });

    const suporteCanal = await g.channels.create({
      name: "suporte",
      type: ChannelType.GuildText,
      parent: suporteCat.id
    });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("abrir_ticket")
        .setLabel("Abrir Suporte")
        .setStyle(ButtonStyle.Primary)
    );

    await suporteCanal.send({
      embeds: [
        embed(
          "Central de Atendimento | Gbz bloxer",
`Precisa de ajuda?

Abra um ticket e aguarde nossa equipe.

Suporte privado e organizado.

Agradecemos sua paciência 🚀`
        )
      ],
      components: [row]
    });

    msg.reply("✅ Servidor criado completo!");
  }

  // ===== LOCK =====
  if (msg.content === "+lock") {
    msg.channel.permissionOverwrites.edit(msg.guild.roles.everyone, { SendMessages: false });
    msg.reply("🔒 Canal bloqueado");
  }

  // ===== UNLOCK =====
  if (msg.content === "+unlock") {
    msg.channel.permissionOverwrites.edit(msg.guild.roles.everyone, { SendMessages: true });
    msg.reply("🔓 Canal desbloqueado");
  }
});

// ================= TICKET =================
client.on("interactionCreate", async (i) => {
  if (!i.isButton()) return;

  // ===== ABRIR =====
  if (i.customId === "abrir_ticket") {

    const canal = await i.guild.channels.create({
      name: `ticket-${i.user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        { id: i.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
        { id: i.user.id, allow: [PermissionsBitField.Flags.ViewChannel] }
      ]
    });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("assumir").setLabel("Assumir").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("fechar").setLabel("Fechar").setStyle(ButtonStyle.Danger)
    );

    await canal.send({
      embeds: [
        embed(
          "SUPORTE Gbz bloxer",
`Olá ${i.user}

Descreva seu problema.

⏳ Aguarde atendimento.

⚠️ Não marque staff.`
        )
      ],
      components: [row]
    });

    i.reply({ content: `Ticket criado: ${canal}`, ephemeral: true });
  }

  // ===== FECHAR =====
  if (i.customId === "fechar") {
    if (!i.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
      return i.reply({ content: "Sem permissão", ephemeral: true });

    i.channel.delete();
  }

  // ===== ASSUMIR =====
  if (i.customId === "assumir") {
    i.reply("✅ Ticket assumido");
  }
});

// ================= LOGIN =================
client.login(TOKEN);
