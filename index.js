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

const QRCode = require('qrcode');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.TOKEN;

let chavePix = 'NÃO DEFINIDA';

// ================= PREÇOS =================
const precos = {
  "1 DIA": 17.99,
  "3 DIAS": 27.99,
  "7 DIAS": 40.00,
  "30 DIAS": 85.00
};

// ================= PIX =================
function gerarPix(chave, valor) {
  return `00020126360014BR.GOV.BCB.PIX0114${chave}52040000530398654${valor.toFixed(2)}5802BR5920FFH4X STORE6007MANAUS62070503***6304`;
}

// ================= READY =================
client.once(Events.ClientReady, () => {
  console.log(`✅ Online como ${client.user.tag}`);
});

// ================= COMANDOS =================
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

    await message.reply('🚀 Criando servidor profissional...');

    // ================= CARGOS =================
    const dono = await guild.roles.create({ name: '👑 DONO', color: '#000000' });
    const sub = await guild.roles.create({ name: '👑 SUB DONO', color: '#000000' });
    const gerente = await guild.roles.create({ name: 'GERENTE', color: '#ff0000' });

    // ================= CATEGORIAS =================
    const ticketsCat = await guild.channels.create({
      name: '🎫 TICKETS',
      type: ChannelType.GuildCategory
    });

    const geral = await guild.channels.create({ name: '🗨️ gαrαl', type: ChannelType.GuildCategory });
    const android = await guild.channels.create({ name: '📱 FFH4X ANDROID', type: ChannelType.GuildCategory });
    const ios = await guild.channels.create({ name: '🍎 FFH4X IOS', type: ChannelType.GuildCategory });

    // ================= FUNÇÃO CRIAR CANAL =================
    async function criar(nome, categoria) {
      return await guild.channels.create({
        name: nome,
        parent: categoria.id
      });
    }

    // ================= CANAIS =================
    const apk = await criar('🏅・αpk-mod-αndroιd', geral);
    const drip = await criar('🏅・drιp-clιente', android);

    const rage = await criar('🏅・ιphone-rαge', ios);
    const safe = await criar('🏅・ιphone-ѕαfe', ios);
    const bypass = await criar('🏅・ʙypαѕѕ-full', ios);
    const wifi = await criar('🏅・hѕ-wιfι', ios);

    // ================= PAINEL =================
    async function painel(canal, nome) {

      const embed = new EmbedBuilder()
        .setColor('#a020f0')
        .setTitle(`🔥😈 Adquira Já seu Painel ${nome} 😈🔥`)
        .setDescription(`🔥 ${nome}!

💎 Experiência diferenciada
🔥 Aimbot + ESP + Config

📦 Entrega rápida
📲 Suporte incluso

😈🔥 Garanta agora!`)
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

    await painel(apk, 'ANDROID');
    await painel(drip, 'DRIP');
    await painel(rage, 'RAGE');
    await painel(safe, 'SAFE');
    await painel(bypass, 'BYPASS');
    await painel(wifi, 'WIFI');

    message.reply('✅ Servidor criado com sucesso!');
  }
});

// ================= INTERAÇÕES =================
client.on(Events.InteractionCreate, async interaction => {

  // BOTÃO COMPRAR
  if (interaction.isButton() && interaction.customId.startsWith('comprar_')) {

    const nome = interaction.customId.split('_')[1];

    const menu = new StringSelectMenuBuilder()
      .setCustomId(`plano_${nome}`)
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

    const plano = interaction.values[0];
    const valor = precos[plano];

    const guild = interaction.guild;

    const categoria = guild.channels.cache.find(c => c.name === '🎫 TICKETS');

    const ticket = await guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      parent: categoria.id,
      permissionOverwrites: [
        { id: guild.roles.everyone, deny: [PermissionsBitField.Flags.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel] }
      ]
    });

    const payload = gerarPix(chavePix, valor);
    const qr = await QRCode.toDataURL(payload);

    const embed = new EmbedBuilder()
      .setColor('#a020f0')
      .setTitle('🛒 Pagamento')
      .setDescription(`
Plano: ${plano}
Valor: R$ ${valor.toFixed(2)}

PIX:
\`\`\`
${payload}
\`\`\`
`)
      .setImage(qr);

    const btn = new ButtonBuilder()
      .setCustomId('confirmar')
      .setLabel('Confirmar Pagamento')
      .setStyle(ButtonStyle.Primary);

    await ticket.send({
      content: `${interaction.user}`,
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(btn)]
    });

    return interaction.reply({ content: '🎫 Ticket criado!', ephemeral: true });
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
