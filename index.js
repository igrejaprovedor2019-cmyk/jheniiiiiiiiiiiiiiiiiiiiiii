const {
  Client,
  GatewayIntentBits,
  ChannelType,
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

// ================= PIX GERADOR =================
function gerarPayloadPix(chave, valor, nome = "FFH4X STORE", cidade = "MANAUS") {
  const format = (id, value) => `${id}${value.length.toString().padStart(2, '0')}${value}`;

  let payload =
    format("00", "01") +
    format("26", format("00", "BR.GOV.BCB.PIX") + format("01", chave)) +
    format("52", "0000") +
    format("53", "986") +
    format("54", valor.toFixed(2)) +
    format("58", "BR") +
    format("59", nome) +
    format("60", cidade) +
    format("62", format("05", "***"));

  const crc16 = (str) => {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
      }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  };

  payload += "6304" + crc16(payload);
  return payload;
}

// ================= PREÇOS =================
const precos = {
  "1 DIA": 17.99,
  "3 DIAS": 27.99,
  "7 DIAS": 40.00,
  "30 DIAS": 85.00
};

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

    await message.reply('🚀 Criando servidor completo...');

    // CARGOS
    await guild.roles.create({ name: '👑 DONO', color: '#000000' });
    await guild.roles.create({ name: '👑 SUB DONO', color: '#000000' });
    await guild.roles.create({ name: 'GERENTE', color: '#ff0000' });

    // CATEGORIAS
    const geral = await guild.channels.create({ name: '🗨️ gαrαl', type: ChannelType.GuildCategory });
    const android = await guild.channels.create({ name: '📱 FFH4X ANDROID', type: ChannelType.GuildCategory });
    const ios = await guild.channels.create({ name: '🍎 FFH4X IOS', type: ChannelType.GuildCategory });
    const downloads = await guild.channels.create({ name: 'LINK DOS XITS 👇', type: ChannelType.GuildCategory });

    // CANAIS
    const apk = await guild.channels.create({ name: '🏅・αpk-mod-αndroιd', parent: geral.id });
    const drip = await guild.channels.create({ name: '🏅・drιp-clιente', parent: android.id });

    const rage = await guild.channels.create({ name: '🏅・ιphone-rαge', parent: ios.id });
    const safe = await guild.channels.create({ name: '🏅・ιphone-ѕαfe', parent: ios.id });
    const bypass = await guild.channels.create({ name: '🏅・ʙypαѕѕ-full', parent: ios.id });
    const wifi = await guild.channels.create({ name: '🏅・hѕ-wιfι', parent: ios.id });

    await guild.channels.create({ name: '🔐・dowload-android', parent: downloads.id });
    await guild.channels.create({ name: '🔐・dowload-ios', parent: downloads.id });
    await guild.channels.create({ name: '🔐・dowload-wifi', parent: downloads.id });
    await guild.channels.create({ name: '🔐・dowload-drip', parent: downloads.id });

    // ================= PAINEL =================
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

    message.reply('✅ Servidor profissional criado!');
  }
});

// ================= INTERAÇÕES =================
client.on(Events.InteractionCreate, async interaction => {

  if (interaction.isButton() && interaction.customId.startsWith('comprar_')) {

    const id = interaction.customId.split('_')[1];

    const menu = new StringSelectMenuBuilder()
      .setCustomId(`plano_${id}`)
      .setPlaceholder('Escolha seu plano')
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

  if (interaction.isStringSelectMenu()) {

    const id = interaction.customId.split('_')[1];
    const plano = interaction.values[0];
    const valor = precos[plano];

    const canal = interaction.guild.channels.cache.get(id);

    const payload = gerarPayloadPix(chavePix, valor);
    const qr = await QRCode.toDataURL(payload);

    const embed = new EmbedBuilder()
      .setColor('#a020f0')
      .setTitle('🛒 Carrinho de Compras')
      .setDescription(`
Produto: ${plano}

💸 Valor: R$ ${valor.toFixed(2)}

📋 PIX Copia e Cola:
\`\`\`
${payload}
\`\`\`
`)
      .setImage(qr);

    const btn = new ButtonBuilder()
      .setCustomId('confirmar')
      .setLabel('Confirmar Pagamento')
      .setStyle(ButtonStyle.Primary);

    await canal.send({
      content: `${interaction.user}`,
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(btn)]
    });

    return interaction.reply({ content: '✅ Pedido criado!', ephemeral: true });
  }

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
