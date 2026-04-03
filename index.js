const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Events,
  StringSelectMenuBuilder
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.TOKEN;
const PREFIX = '!';

let chavePix = 'NÃO DEFINIDA';

// =====================
// 🔥 ONLINE
// =====================
client.once(Events.ClientReady, () => {
  console.log(`✅ Online como ${client.user.tag}`);
});

// =====================
// 💬 COMANDOS
// =====================
client.on(Events.MessageCreate, async message => {
  if (!message.guild || message.author.bot) return;

  // SALVAR CHAVE PIX
  if (message.content.startsWith('!chave')) {
    const chave = message.content.split(' ').slice(1).join(' ');
    if (!chave) return message.reply('❌ Coloque a chave PIX');

    chavePix = chave;
    return message.reply('✅ Chave PIX salva!');
  }

  // CRIAR SERVIDOR
  if (message.content === `${PREFIX}painel`) {

    await message.reply('🚀 Criando servidor completo...');

    const guild = message.guild;

    // =====================
    // 🎭 CARGOS
    // =====================
    const dono = await guild.roles.create({ name: '👑 DONO' });
    const sub = await guild.roles.create({ name: '👑 SUB DONO' });
    const gerente = await guild.roles.create({ name: 'GERENTE' });

    const verificado = await guild.roles.create({ name: '✔️ VERIFICADO', color: 'Green' });

    const cargos = {
      android: await guild.roles.create({ name: 'CLIENTE ANDROID' }),
      ios: await guild.roles.create({ name: 'CLIENTE IOS' }),
      wifi: await guild.roles.create({ name: 'CLIENTE WIFI' }),
      drip: await guild.roles.create({ name: 'CLIENTE DRIP' })
    };

    // =====================
    // 🔒 BLOQUEAR
    // =====================
    await guild.roles.everyone.setPermissions([]);

    // =====================
    // 📌 INÍCIO
    // =====================
    const inicio = await guild.channels.create({ name: 'Início / Recepção', type: ChannelType.GuildCategory });

    await guild.channels.create({ name: '👾 boas-vindas', type: 0, parent: inicio.id });
    await guild.channels.create({ name: '📢 ‼️ avisos!', type: 0, parent: inicio.id });
    await guild.channels.create({ name: '📜 termon', type: 0, parent: inicio.id });

    // =====================
    // 🌐 COMUNIDADE
    // =====================
    const comunidade = await guild.channels.create({ name: '【 COMUNIDADE 】', type: ChannelType.GuildCategory });

    await guild.channels.create({ name: '🛒・como-adquirir', type: 0, parent: comunidade.id });
    await guild.channels.create({ name: '😈・seja-da-nossa-equipe', type: 0, parent: comunidade.id });

    // =====================
    // 🔐 VERIFICAÇÃO
    // =====================
    const verificacao = await guild.channels.create({
      name: '🔐・verificação',
      type: ChannelType.GuildText,
      parent: comunidade.id,
      permissionOverwrites: [
        { id: guild.roles.everyone, allow: [PermissionsBitField.Flags.ViewChannel] }
      ]
    });

    const embedVer = new EmbedBuilder()
      .setColor('#a020f0')
      .setTitle('✅ Verificação')
      .setDescription('Clique para liberar o servidor')
      .setImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC7vNX0Nd8YF3uAA1R8nUyKV1H-6Lym9U9DQ&s');

    const btnVer = new ButtonBuilder()
      .setCustomId('verificar')
      .setLabel('Verificar')
      .setStyle(ButtonStyle.Success);

    await verificacao.send({
      embeds: [embedVer],
      components: [new ActionRowBuilder().addComponents(btnVer)]
    });

    // =====================
    // 💬 GERAL
    // =====================
    const geral = await guild.channels.create({ name: '🗨️ geral', type: ChannelType.GuildCategory });

    await guild.channels.create({
      name: '🗨️・geral',
      type: 0,
      parent: geral.id,
      permissionOverwrites: [
        { id: guild.roles.everyone, deny: [PermissionsBitField.Flags.ViewChannel] },
        { id: verificado.id, allow: [PermissionsBitField.Flags.ViewChannel] }
      ]
    });

    const canalAndroid = await guild.channels.create({ name: '🏅・apk-mod-android', type: 0, parent: geral.id });

    // =====================
    // 📱 ANDROID
    // =====================
    const catAndroid = await guild.channels.create({ name: '📱 FFH4X ANDROID', type: ChannelType.GuildCategory });

    const ch1 = await guild.channels.create({ name: '🏅・contas-ghost-ff', type: 0, parent: catAndroid.id });
    const ch2 = await guild.channels.create({ name: '🏅・holograma-android', type: 0, parent: catAndroid.id });
    const ch3 = await guild.channels.create({ name: '🏅・drip-cliente', type: 0, parent: catAndroid.id });

    // =====================
    // 🍎 IOS
    // =====================
    const catIOS = await guild.channels.create({ name: '🍎 FFH4X IOS', type: ChannelType.GuildCategory });

    await guild.channels.create({ name: '🏅・iphone-rage', type: 0, parent: catIOS.id });
    await guild.channels.create({ name: '🏅・iphone-safe', type: 0, parent: catIOS.id });
    await guild.channels.create({ name: '🏅・bypass-full', type: 0, parent: catIOS.id });
    await guild.channels.create({ name: '🏅・hs-wifi', type: 0, parent: catIOS.id });

    // =====================
    // 🎟️ SUPORTE
    // =====================
    const suporte = await guild.channels.create({ name: '🎟️ suporte', type: ChannelType.GuildCategory });

    await guild.channels.create({ name: '🎟️・suporte', type: 0, parent: suporte.id });
    await guild.channels.create({ name: 'ATENDIMENTO 1', type: 2, parent: suporte.id });
    await guild.channels.create({ name: 'ATENDIMENTO 2', type: 2, parent: suporte.id });
    await guild.channels.create({ name: 'ATENDIMENTO 3', type: 2, parent: suporte.id });

    // =====================
    // 🔊 CALLS
    // =====================
    const calls = await guild.channels.create({ name: '🔊 CALLS', type: ChannelType.GuildCategory });

    await guild.channels.create({ name: 'Geral 1', type: 2, parent: calls.id });
    await guild.channels.create({ name: 'Geral 2', type: 2, parent: calls.id });
    await guild.channels.create({ name: 'Suporte 1', type: 2, parent: calls.id });
    await guild.channels.create({ name: 'Suporte 2', type: 2, parent: calls.id });

    // =====================
    // 📥 DOWNLOADS
    // =====================
    const downloads = await guild.channels.create({ name: 'LINK DOS XITS 👇', type: ChannelType.GuildCategory });

    async function painelVenda(canal, nome) {
      const embed = new EmbedBuilder()
        .setColor('#a020f0')
        .setTitle(`🔥😈 ${nome} 😈🔥`)
        .setDescription('Clique em comprar abaixo')
        .setImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC7vNX0Nd8YF3uAA1R8nUyKV1H-6Lym9U9DQ&s');

      const btn = new ButtonBuilder()
        .setCustomId(`comprar_${nome}`)
        .setLabel('Comprar')
        .setStyle(ButtonStyle.Success);

      await canal.send({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(btn)]
      });
    }

    const d1 = await guild.channels.create({ name: '🔐・download-android', type: 0, parent: downloads.id });
    const d2 = await guild.channels.create({ name: '🔐・download-ios', type: 0, parent: downloads.id });
    const d3 = await guild.channels.create({ name: '🔐・download-wifi', type: 0, parent: downloads.id });
    const d4 = await guild.channels.create({ name: '🔐・download-drip', type: 0, parent: downloads.id });

    await painelVenda(d1, 'FFH4X ANDROID');
    await painelVenda(d2, 'FFH4X IOS');
    await painelVenda(d3, 'FFH4X WIFI');
    await painelVenda(d4, 'FFH4X DRIP');

    await message.reply('✅ Servidor completo criado!');
  }
});

// =====================
// 🔘 INTERAÇÕES
// =====================
client.on(Events.InteractionCreate, async interaction => {

  if (interaction.isButton()) {

    if (interaction.customId === 'verificar') {
      const cargo = interaction.guild.roles.cache.find(r => r.name === '✔️ VERIFICADO');
      await interaction.member.roles.add(cargo);
      return interaction.reply({ content: '✅ Verificado!', ephemeral: true });
    }

    if (interaction.customId.startsWith('comprar_')) {
      const produto = interaction.customId.replace('comprar_', '');

      const menu = new StringSelectMenuBuilder()
        .setCustomId(`plano_${produto}`)
        .setPlaceholder('Selecione o plano')
        .addOptions([
          { label: '1 DIA - 17,99', value: '1 DIA' },
          { label: '3 DIAS - 27,99', value: '3 DIAS' },
          { label: '7 DIAS - 40', value: '7 DIAS' },
          { label: '30 DIAS - 85', value: '30 DIAS' }
        ]);

      return interaction.reply({
        content: 'Escolha o plano:',
        components: [new ActionRowBuilder().addComponents(menu)],
        ephemeral: true
      });
    }

    if (interaction.customId === 'confirmar') {

      const permitido = ['👑 DONO', '👑 SUB DONO', 'GERENTE'];

      const ok = interaction.member.roles.cache.some(r => permitido.includes(r.name));

      if (!ok) {
        return interaction.reply({ content: '❌ Sem permissão!', ephemeral: true });
      }

      return interaction.reply('✅ Pagamento confirmado!');
    }
  }

  if (interaction.isStringSelectMenu()) {

    const produto = interaction.customId.replace('plano_', '');
    const plano = interaction.values[0];

    const canal = await interaction.guild.channels.create({
      name: `🛒-${interaction.user.username}`,
      type: ChannelType.GuildText
    });

    const embed = new EmbedBuilder()
      .setTitle('🛒 Carrinho')
      .setDescription(`
Produto: ${produto}
Plano: ${plano}

💸 Pague via PIX:
${chavePix}
      `);

    const btn = new ButtonBuilder()
      .setCustomId('confirmar')
      .setLabel('Confirmar')
      .setStyle(ButtonStyle.Primary);

    await canal.send({
      content: `${interaction.user}`,
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(btn)]
    });

    await interaction.reply({ content: '🎫 Ticket criado!', ephemeral: true });
  }

});

client.login(TOKEN);
