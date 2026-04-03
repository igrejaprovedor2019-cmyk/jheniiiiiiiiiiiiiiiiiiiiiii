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

let chavePix = 'NÃO DEFINIDA';

client.once(Events.ClientReady, () => {
  console.log(`✅ Online como ${client.user.tag}`);
});

// =====================
// COMANDOS
// =====================
client.on(Events.MessageCreate, async message => {
  if (!message.guild || message.author.bot) return;

  // SALVAR PIX
  if (message.content.startsWith('!chave')) {
    const chave = message.content.split(' ').slice(1).join(' ');
    if (!chave) return message.reply('❌ Coloque a chave PIX');

    chavePix = chave;
    return message.reply('✅ Chave PIX salva!');
  }

  // CRIAR SERVIDOR
  if (message.content === '!painel') {

    const guild = message.guild;

    await message.reply('🚀 Criando servidor completo...');

    // =====================
    // 🎭 CARGOS
    // =====================
    await guild.roles.create({ name: '👑 DONO', color: '#000000' });
    await guild.roles.create({ name: '👑 SUB DONO', color: '#000000' });
    await guild.roles.create({ name: 'GERENTE', color: '#ff0000' });

    await guild.roles.create({ name: 'CLIENTE ANDROID', color: '#00b0f4' });
    await guild.roles.create({ name: 'CLIENTE IOS', color: '#ff00ff' });
    await guild.roles.create({ name: 'CLIENTE WIFI', color: '#ffff00' });
    await guild.roles.create({ name: 'CLIENTE DRIP', color: '#ff8800' });

    // =====================
    // INÍCIO
    // =====================
    const inicio = await guild.channels.create({ name: 'Início / Recepção', type: ChannelType.GuildCategory });

    await guild.channels.create({ name: '👾 boas-vindaꜱ', parent: inicio.id });
    await guild.channels.create({ name: '📢 ‼️ αvιѕoѕ!', parent: inicio.id });
    await guild.channels.create({ name: '📜 termon', parent: inicio.id });

    // =====================
    // COMUNIDADE
    // =====================
    const comunidade = await guild.channels.create({ name: '【 COMUNIDADE 】', type: ChannelType.GuildCategory });

    await guild.channels.create({ name: '🛒・coмo・αdquιrιr', parent: comunidade.id });
    await guild.channels.create({ name: '😈・ѕejα-dα-noѕѕα-equιpe', parent: comunidade.id });

    // =====================
    // GERAL
    // =====================
    const geral = await guild.channels.create({ name: '🗨️ gαrαl', type: ChannelType.GuildCategory });

    await guild.channels.create({ name: '🗨️・gerαl', parent: geral.id });
    const apk = await guild.channels.create({ name: '🏅・αpk-mod-αndroιd', parent: geral.id });

    // =====================
    // ANDROID
    // =====================
    const android = await guild.channels.create({ name: '📱 FFH4X ANDROID', type: ChannelType.GuildCategory });

    const contas = await guild.channels.create({ name: '🏅・contαѕ-ghoѕt-ff', parent: android.id });
    const holo = await guild.channels.create({ name: '🏅 hologrαmα-αndroιd', parent: android.id });
    const drip = await guild.channels.create({ name: '🏅・drιp-clιente', parent: android.id });

    // =====================
    // IOS
    // =====================
    const ios = await guild.channels.create({ name: '🍎 FFH4X IOS', type: ChannelType.GuildCategory });

    const rage = await guild.channels.create({ name: '🏅・ιphone-rαge', parent: ios.id });
    const safe = await guild.channels.create({ name: '🏅・ιphone-ѕαfe', parent: ios.id });
    const bypass = await guild.channels.create({ name: '🏅・ʙypαѕѕ-full', parent: ios.id });
    const wifi = await guild.channels.create({ name: '🏅・hѕ-wιfι', parent: ios.id });

    // =====================
    // SUPORTE
    // =====================
    const suporte = await guild.channels.create({ name: '🎟️・ѕupoʀte', type: ChannelType.GuildCategory });

    await guild.channels.create({ name: '🎟️・𝓼𝓾𝓹𝓸𝓻𝓽𝓮', parent: suporte.id });
    await guild.channels.create({ name: 'ATENDIMENTO 1', type: 2, parent: suporte.id });
    await guild.channels.create({ name: 'ATENDIMENTO 2', type: 2, parent: suporte.id });
    await guild.channels.create({ name: 'ATENDIMENTO 3', type: 2, parent: suporte.id });

    // =====================
    // CALLS
    // =====================
    const calls = await guild.channels.create({ name: '🔊 CALLS', type: ChannelType.GuildCategory });

    await guild.channels.create({ name: 'Geral 1', type: 2, parent: calls.id });
    await guild.channels.create({ name: 'Geral 2', type: 2, parent: calls.id });
    await guild.channels.create({ name: 'Suporte 1', type: 2, parent: calls.id });
    await guild.channels.create({ name: 'Suporte 2', type: 2, parent: calls.id });

    // =====================
    // DOWNLOADS
    // =====================
    const downloads = await guild.channels.create({ name: 'LINK DOS XITS 👇', type: ChannelType.GuildCategory });

    await guild.channels.create({ name: '🔐・dowload-android', parent: downloads.id });
    await guild.channels.create({ name: '🔐・dowload-ios', parent: downloads.id });
    await guild.channels.create({ name: '🔐・dowload-wifi', parent: downloads.id });
    await guild.channels.create({ name: '🔐・dowload-drip', parent: downloads.id });

    // =====================
    // CALL VIP
    // =====================
    const vip = await guild.channels.create({ name: '↳ CALL ATENDIMENTO', type: ChannelType.GuildCategory });
    await guild.channels.create({ name: 'CALL ATENDIMENTO VIP', type: 2, parent: vip.id });

    // =====================
    // PAINEL DE VENDA
    // =====================
    async function painel(canal, nome) {
      const embed = new EmbedBuilder()
        .setColor('#a020f0')
        .setTitle(`🔥😈 Adquira Já seu Painel ${nome} 😈🔥`)
        .setDescription(`🔥 ${nome}!

Se você quer qualidade e resultado, esse painel é pra você.

💎 Experiência diferenciada e máxima eficiência

🔥 O que tem:
• Aimbot Full
• ESPs Full
• Configurável
• Head / Neck / Chest

💥 Diferenciais
• Funciona em todos dispositivos 🚀
• Suporte + Tutorial

🎮 Ideal para:
• Rank
• CS
• Jogar AP

📥 Você recebe:
• Key no privado
• Acesso a downloads

🚨 Pode haver risco de blacklist

📦 Entrega rápida
📲 Suporte antes da compra

😈🔥 Garanta o seu agora!`)
        .setImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC7vNX0Nd8YF3uAA1R8nUyKV1H-6Lym9U9DQ&s');

      const btn = new ButtonBuilder()
        .setCustomId(`comprar_${canal.id}`)
        .setLabel('Comprar')
        .setStyle(ButtonStyle.Success);

      await canal.send({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(btn)]
      });
    }

    await painel(apk, 'FFH4X ANDROID');
    await painel(drip, 'FFH4X DRIP');
    await painel(rage, 'IPHONE RAGE');
    await painel(safe, 'IPHONE SAFE');
    await painel(bypass, 'BYPASS FULL');
    await painel(wifi, 'HS WIFI');

    message.reply('✅ Servidor criado com sucesso!');
  }
});

// =====================
// INTERAÇÕES
// =====================
client.on(Events.InteractionCreate, async interaction => {

  if (interaction.isButton()) {

    if (interaction.customId.startsWith('comprar_')) {
      const id = interaction.customId.split('_')[1];

      const menu = new StringSelectMenuBuilder()
        .setCustomId(`plano_${id}`)
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

      if (!ok) return interaction.reply({ content: '❌ Sem permissão!', ephemeral: true });

      return interaction.reply('✅ Pagamento confirmado!');
    }
  }

  if (interaction.isStringSelectMenu()) {
    const id = interaction.customId.split('_')[1];
    const plano = interaction.values[0];
    const canal = interaction.guild.channels.cache.get(id);

    const embed = new EmbedBuilder()
      .setTitle('🛒 Carrinho de Compras')
      .setDescription(`Plano: ${plano}

PIX:
${chavePix}`);

    const btn = new ButtonBuilder()
      .setCustomId('confirmar')
      .setLabel('Confirmar')
      .setStyle(ButtonStyle.Primary);

    await canal.send({
      content: `${interaction.user}`,
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(btn)]
    });

    return interaction.reply({ content: '✅ Pedido enviado!', ephemeral: true });
  }

});

client.login(TOKEN);
