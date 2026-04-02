const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, Partials } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

const TOKEN = process.env.DISCORD_TOKEN;
const ID_CATEGORIA = process.env.ID_CATEGORIA;
const ID_DONO = process.env.ID_DONO;

client.once('ready', () => {
    console.log(`✅ BOT ONLINE: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content === '!painel') {
        if (message.author.id !== ID_DONO) return;

        const embed = new EmbedBuilder()
            .setTitle('🔥 COMBO PREMIUM - BLOX FRUITS')
            .setColor(0xFF0000)
            .addFields(
                { name: '⚡ STATUS', value: 'Entrega Automática!', inline: false },
                { name: '⭐ ITENS INCLUSOS', value: '🚀 LEVEL MAX +\n🥊 CDK\n⚔️ TTK\n✨ E MUITO MAIS', inline: false },
                { name: '🎁 POSSÍVEIS FRUTAS', value: 'Dragon, Kitsune, Tiger, Yeti, Gás ou Dough', inline: false },
                { name: '💰 VALOR', value: '**R$ 19,90**', inline: false }
            )
            .setImage('https://cdn.dfg.com.br/itemimages/944475148-contas-blox-fruits-kitsune-dark-blade-yoru-e-brindes-NI33.webp');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('buy_button')
                .setLabel('COMPRAR AGORA')
                .setEmoji('🛒')
                .setStyle(ButtonStyle.Danger)
        );

        await message.channel.send({ embeds: [embed], components: [row] });
        await message.delete().catch(() => {});
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'buy_button') {
        const guild = interaction.guild;
        try {
            const ticketChannel = await guild.channels.create({
                name: `🛒-${interaction.user.username}`,
                type: 0,
                parent: ID_CATEGORIA,
                permissionOverwrites: [
                    { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                    { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
                    { id: client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
                ]
            });

            await interaction.reply({ content: `✅ Ticket aberto: ${ticketChannel}`, ephemeral: true });

            const embedTicket = new EmbedBuilder()
                .setTitle('🎫 PAGAMENTO')
                .setDescription(`Olá ${interaction.user}!\n\n**Valor:** R$ 19,90\n**Chave PIX:** \`86975097500\`\n\nEnvie o comprovante e aguarde o dono.`)
                .setColor(0x00FF00);

            const rowTicket = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('confirm_pay').setLabel('Confirmar').setStyle(ButtonStyle.Success).setEmoji('✅'),
                new ButtonBuilder().setCustomId('close_ticket').setLabel('Fechar').setStyle(ButtonStyle.Secondary).setEmoji('🔒')
            );

            await ticketChannel.send({ content: `<@${ID_DONO}>`, embeds: [embedTicket], components: [rowTicket] });
        } catch (e) {
            console.log(e);
        }
    }

    if (interaction.customId === 'confirm_pay') {
        if (interaction.user.id !== ID_DONO) return interaction.reply({ content: '❌ Apenas o dono!', ephemeral: true });
        await interaction.reply(`✅ **PAGAMENTO CONFIRMADO POR ${interaction.user}!**`);
    }

    if (interaction.customId === 'close_ticket') {
        await interaction.reply('🔒 Fechando...');
        setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
    }
});

client.login(TOKEN);
