const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  StringSelectMenuBuilder,
  ChannelType,
  PermissionsBitField
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// BOT ONLINE
client.once('clientReady', () => {
  console.log(`🔥 Bot online como ${client.user.tag}`);
});

// COMANDO
client.on('messageCreate', async (message) => {

  if (message.author.bot) return;

  if (message.content === '!pika') {

    const embed = new EmbedBuilder()
      .setTitle('🔥😈 Adquira seu Painel BYPASS IOS FULL 😈🔥')
      .setDescription(`
🔥😈 **Adquira Já seu Painel BYPASS IOS FULL** 😈🔥  

🔥 **FFH4X BYPASS IOS FULL!**  

Se você quer qualidade e resultado, esse painel é pra você.  

💎 Experiência diferenciada e máxima eficiência  

🔥 **O que tem:**  
• Aimbot Full  
• ESPs Full  
• Configurável  
• Head / Neck / Chest  

💥 **Diferenciais**  
• Funciona em todos Android 🚀  
• Suporte + Tutorial  

🎮 **Ideal para:**  
• Rank  
• CS  
• Jogar AP  

📥 **Você recebe:**  
• Key no ticket  
• Acesso a downloads  

🚨 Pode haver risco de blacklist  

📦 Entrega rápida  
📲 Suporte antes da compra  

😈🔥 **Garanta o seu agora!**
      `)
      .setImage('https://media.discordapp.net/attachments/1482528899903782932/1484254280088027216/file_000000008530720eb8922a615208f883.png')
      .setColor(0x00ff88);

    const botao = new ButtonBuilder()
      .setCustomId('abrir_ticket')
      .setLabel('Comprar Agora')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(botao);

    message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
});

// INTERAÇÕES
client.on('interactionCreate', async (interaction) => {

  // BOTÃO COMPRAR
  if (interaction.isButton() && interaction.customId === 'abrir_ticket') {

    const select = new StringSelectMenuBuilder()
      .setCustomId('produto')
      .setPlaceholder('Escolha seu plano')
      .addOptions([
        { label: '1 dia', description: 'R$17,90', value: '17.90' },
        { label: '7 dias', description: 'R$25,90', value: '25.90' },
        { label: '10 dias', description: 'R$35,90', value: '35.90' },
        { label: '30 dias', description: 'R$55,90', value: '55.90' }
      ]);

    return interaction.reply({
      content: '📦 Escolha seu plano:',
      components: [new ActionRowBuilder().addComponents(select)],
      ephemeral: true
    });
  }

  // CRIAR TICKET
  if (interaction.isStringSelectMenu()) {

    const valor = interaction.values[0];

    const canal = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel]
        }
      ]
    });

    const confirmar = new ButtonBuilder()
      .setCustomId('confirmar_pagamento')
      .setLabel('Confirmar Pagamento')
      .setStyle(ButtonStyle.Success);

    const fechar = new ButtonBuilder()
      .setCustomId('fechar_ticket')
      .setLabel('Fechar Ticket')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(confirmar, fechar);

    const embedPix = new EmbedBuilder()
      .setTitle('💰 Pagamento via PIX')
      .setDescription(`
💵 Valor: R$${valor}

📲 Chave PIX:
21983873874

📌 Após pagar, aguarde confirmação do dono
      `)
      .setColor(0x00ff88);

    await canal.send({
      content: `🎟️ Ticket de ${interaction.user}`,
      embeds: [embedPix],
      components: [row]
    });

    return interaction.reply({
      content: `✅ Ticket criado: ${canal}`,
      ephemeral: true
    });
  }

  // CONFIRMAR PAGAMENTO
  if (interaction.isButton() && interaction.customId === 'confirmar_pagamento') {

    const dono = process.env.DONO_ID;

    if (interaction.user.id != dono) {
      return interaction.reply({
        content: '❌ Apenas o dono pode confirmar!',
        ephemeral: true
      });
    }

    await interaction.channel.send(`
✅ Pagamento confirmado!

📦 Sua key será enviada aqui assim que o dono estiver online.
⏳ Aguarde...
    `);

    await interaction.reply({
      content: '✔️ Confirmado!',
      ephemeral: true
    });
  }

  // FECHAR TICKET
  if (interaction.isButton() && interaction.customId === 'fechar_ticket') {

    const dono = process.env.DONO_ID;

    if (interaction.user.id != dono) {
      return interaction.reply({
        content: '❌ Apenas o dono pode fechar!',
        ephemeral: true
      });
    }

    await interaction.reply({
      content: '🗑️ Fechando ticket...',
      ephemeral: true
    });

    setTimeout(() => {
      interaction.channel.delete().catch(() => {});
    }, 2000);
  }

});

client.login(process.env.TOKEN);
