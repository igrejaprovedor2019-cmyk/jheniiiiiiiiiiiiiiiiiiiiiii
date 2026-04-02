const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Variáveis da Railway
const TOKEN = process.env.DISCORD_TOKEN;
const ID_CATEGORIA = process.env.ID_CATEGORIA;
const ID_DONO = process.env.ID_DONO;

client.once('ready', () => {
    console.log(`✅ Bot online como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.content === '!painel') {
        if (message.author.id !== ID_DONO) return;

        const embed = new EmbedBuilder()
            .setTitle('COMBO PREMIUM')
            .setColor(0xFF0000) // Vermelho
            .addFields(
                { name: '⚡ Entrega Automática!', value: '🚀 LEVEL MAX +\n🥊 CDK\n⚔️ TTK\n✨ E MUITO MAIS', inline: false },
                { name: '\u200B', value: '❗ Uma dessas\n🐉 Dragon\n🦊 Kitsune\n🐯 Tiger\n❄️ Yeti\n💨 Gás\n🍩 Dough', inline: false },
                { name: 'Valor à vista', value: 'R$ 19,90', inline: false }
            )
            .setImage('https://cdn.dfg.com.br/itemimages/944475148-contas-blox-fruits-kitsune-dark-blade-yoru-e-brindes-NI33.webp');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('buy_button')
                .setLabel('Comprar')
                .setEmoji('🛒')
                .setStyle(ButtonStyle.Danger)
        );

        await message.channel.send({ embeds: [embed], components: [row] });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'buy_button') {
        const guild = interaction.guild;
        const category = guild.channels.cache.get(ID_CATEGORIA);

        const ticketChannel = await guild.channels.create({
            name: `🛒-${interaction.user.username}`,
            parent: category,
            permissionOverwrites: [
                { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
                { id: client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
            ]
        });

        await interaction.reply({ content: `Ticket aberto: ${ticketChannel}`, ephemeral: true });

        const embedTicket = new EmbedBuilder()
            .setTitle('🎫 NOVO PEDIDO')
            .setDescription(`**Cliente:** ${interaction.user}\n**Valor:** R$ 19,90\n**Chave PIX:** \`86975097500\`\n\n**Aguarde a confirmação do dono.**`)
            .setColor(0xFF0000);

        const rowTicket = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('confirm_pay').setLabel('Confirmar Pagamento').setEmoji('✅').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('close_ticket').setLabel('Fechar Ticket').setEmoji('🔒').setStyle(ButtonStyle.Secondary)
        );

        await ticketChannel.send({ embeds: [embedTicket], components: [rowTicket] });
    }

    if (interaction.customId === 'confirm_pay') {
        if (interaction.user.id !== ID_DONO) {
            return interaction.reply({ content: '❌ Apenas o dono pode confirmar!', ephemeral: true });
        }
        await interaction.reply({ content: `✅ **PAGAMENTO CONFIRMADO POR ${interaction.user}!**` });
    }

    if (interaction.customId === 'close_ticket') {
        await interaction.reply('🚨 Deletando em 5s...');
        setTimeout(() => interaction.channel.delete(), 5000);
    }
});

client.login(TOKEN);
