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
// ONLINE
// =====================
client.once(Events.ClientReady, () => {
  console.log(`✅ Online como ${client.user.tag}`);
});

// =====================
// COMANDOS
// =====================
client.on(Events.MessageCreate, async message => {
  if (!message.guild || message.author.bot) return;

  // CHAVE PIX
  if (message.content.startsWith('!chave')) {
    const chave = message.content.split(' ').slice(1).join(' ');
    if (!chave) return message.reply('❌ Coloque a chave PIX');
    chavePix = chave;
    return message.reply('✅ Chave PIX salva!');
  }

  // CRIAR SERVIDOR
  if (message.content === `${PREFIX}painel`) {

    await message.reply('🚀 Criando servidor...');

    const guild = message.guild;

    // =====================
    // CARGOS
    // =====================
    const verificado = await guild.roles.create({ name: '✔️ VERIFICADO' });

    await guild.roles.create({ name: '👑 DONO' });
    await guild.roles.create({ name: '👑 SUB DONO' });
    await guild.roles.create({ name: 'GERENTE' });

    // BLOQUEAR TUDO
    await guild.roles.everyone.setPermissions([]);

    // =====================
    // VERIFICAÇÃO
    // =====================
    const verificacao = await guild.channels.create({
      name: '🔐・verificação',
      type: ChannelType.GuildText,
      permissionOverwrites: [
        { id: guild.roles.everyone, allow: [PermissionsBitField.Flags.ViewChannel] }
      ]
    });

    const embedVer = new EmbedBuilder()
      .setColor('#a020f0')
      .setTitle('✅ Verificação')
      .setDescription('Clique no botão para liberar o servidor');

    const btnVer = new ButtonBuilder()
      .setCustomId('verificar')
      .setLabel('Verificar')
      .setStyle(ButtonStyle.Success);

    await verificacao.send({
      embeds: [embedVer],
      components: [new ActionRowBuilder().addComponents(btnVer)]
    });

    // =====================
    // GERAL
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

    const canaisVenda = [];

    // =====================
    // CRIAR CANAIS VENDA
    // =====================
    async function criarCanal(nome, categoria) {
      const canal = await guild.channels.create({
        name: nome,
        type: 0,
        parent: categoria.id,
        permissionOverwrites: [
          { id: guild.roles.everyone, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: verificado.id, allow: [PermissionsBitField.Flags.ViewChannel] }
        ]
      });
      canaisVenda.push(canal);
      return canal;
    }

    const android = await guild.channels.create({ name: '📱 ANDROID', type: ChannelType.GuildCategory });
    const ios = await guild.channels.create({ name: '🍎 IOS', type: ChannelType.GuildCategory });

    const apk = await criarCanal('apk-mod-android', android);
    const drip = await criarCanal('drip-cliente', android);

    const rage = await criarCanal('iphone-rage', ios);
    const safe = await criarCanal('iphone-safe', ios);
    const bypass = await criarCanal('bypass-full', ios);
    const wifi = await criarCanal('wifi', ios);

    // =====================
    // PAINEL
    // =====================
    async function painel(canal, nome) {

      const embed = new EmbedBuilder()
        .setColor('#a020f0')
        .setTitle(`🔥😈 Adquira Já seu Painel ${nome} 😈🔥`)
        .setDescription(`
🔥 ${nome}!

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

😈🔥 Garanta o seu agora!
`)
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

    message.reply('✅ Servidor pronto!');
  }
});

// =====================
// INTERAÇÕES
// =====================
client.on(Events.InteractionCreate, async interaction => {

  // VERIFICAÇÃO
  if (interaction.isButton() && interaction.customId === 'verificar') {
    const cargo = interaction.guild.roles.cache.find(r => r.name === '✔️ VERIFICADO');
    await interaction.member.roles.add(cargo);

    return interaction.reply({ content: '✅ Acesso liberado!', ephemeral: true });
  }

  // COMPRAR
  if (interaction.isButton() && interaction.customId.startsWith('comprar_')) {

    const canalID = interaction.customId.split('_')[1];

    const menu = new StringSelectMenuBuilder()
      .setCustomId(`plano_${canalID}`)
      .setPlaceholder('Escolha o plano')
      .addOptions([
        { label: '1 DIA - 17,99', value: '1 DIA' },
        { label: '3 DIAS - 27,99', value: '3 DIAS' },
        { label: '7 DIAS - 40', value: '7 DIAS' },
        { label: '30 DIAS - 85', value: '30 DIAS' }
      ]);

    return interaction.reply({
      content: 'Selecione seu plano:',
      components: [new ActionRowBuilder().addComponents(menu)],
      ephemeral: true
    });
  }

  // CRIAR TICKET
  if (interaction.isStringSelectMenu()) {

    const canalID = interaction.customId.split('_')[1];
    const plano = interaction.values[0];

    const canal = interaction.guild.channels.cache.get(canalID);

    const embed = new EmbedBuilder()
      .setTitle('🛒 Carrinho de Compras')
      .setDescription(`
🛒 Produto selecionado
Plano: ${plano}

💸 Valor:
R$ XX

📋 Chave PIX:
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

    return interaction.reply({ content: '✅ Pedido enviado!', ephemeral: true });
  }

  // CONFIRMAR
  if (interaction.isButton() && interaction.customId === 'confirmar') {

    const permitido = ['👑 DONO', '👑 SUB DONO', 'GERENTE'];

    const ok = interaction.member.roles.cache.some(r => permitido.includes(r.name));

    if (!ok) {
      return interaction.reply({ content: '❌ Sem permissão!', ephemeral: true });
    }

    return interaction.reply('✅ Pagamento confirmado!');
  }

});

client.login(TOKEN);
