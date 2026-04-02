const { 
    Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, 
    ButtonStyle, EmbedBuilder, PermissionsBitField, ChannelType 
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Configurações via Railway (Variables)
const TOKEN = process.env.TOKEN;
const DONO_ID = process.env.DONO_ID;
const PIX = process.env.PIX;
const LOG_VENDAS = process.env.LOG_VENDAS; // ID de um canal para você receber avisos

client.once("ready", () => {
    console.log(`🚀 SISTEMA CLUBE SIRIUS ONLINE: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot || message.content !== "!painel") return;
    if (message.author.id !== DONO_ID) return;

    const embed = new EmbedBuilder()
        .setTitle("🔥 COMBO PREMIUM - BLOX FRUITS")
        .setDescription("```\n🚀 LEVEL MAX\n🥊 CDK & TTK\n🍎 FRUTA MÍTICA GARANTIDA\n```\n**Clique no botão abaixo para garantir o seu agora!**")
        .addFields({ name: "💰 Preço Único", value: "R$ 19,90", inline: true })
        .setImage("https://cdn.dfg.com.br/itemimages/944475148-contas-blox-fruits-kitsune-dark-blade-yoru-e-brindes-NI33.webp")
        .setColor("#ff0000")
        .setFooter({ text: "Clube Sirius - O melhor do Blox Fruits" });

    const btn = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("buy").setLabel("ADQUIRIR COMBO").setEmoji("🛒").setStyle(ButtonStyle.Danger)
    );

    await message.channel.send({ embeds: [embed], components: [btn] });
    await message.delete().catch(() => {}); 
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    // ABRIR TICKET
    if (interaction.customId === "buy") {
        // Verifica se já tem um ticket aberto com esse nome (Anti-Flood)
        const jaExiste = interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.username}`);
        if (jaExiste) return interaction.reply({ content: `❌ Você já tem um ticket aberto: ${jaExiste}`, ephemeral: true });

        await interaction.deferReply({ ephemeral: true });

        const ticket = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles] },
                { id: DONO_ID, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
            ]
        });

        const ticketEmbed = new EmbedBuilder()
            .setTitle("🎫 TICKET DE COMPRA")
            .setThumbnail(interaction.user.displayAvatarURL())
            .setDescription(`Olá **${interaction.user.username}**!\n\nPara completar sua compra, realize o PIX abaixo:\n\n**VALOR:** \`R$ 19,90\`\n**CHAVE PIX:** \`${PIX}\``)
            .setColor("#00ff00")
            .setFooter({ text: "Aguarde o dono confirmar após o envio do comprovante." });

        const ticketBtns = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("done").setLabel("PAGUEI").setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId("close").setLabel("FECHAR").setStyle(ButtonStyle.Secondary)
        );

        await ticket.send({ content: `<@${interaction.user.id}> | <@${DONO_ID}>`, embeds: [ticketEmbed], components: [ticketBtns] });
        await interaction.editReply({ content: `✅ Canal criado: ${ticket}` });

        // Envia Log para o Dono
        if (LOG_VENDAS) {
            const logChan = interaction.guild.channels.cache.get(LOG_VENDAS);
            if (logChan) logChan.send(`🔔 **Novo Ticket:** ${interaction.user.tag} abriu um canal de compra.`);
        }
    }

    // CONFIRMAR (SÓ DONO)
    if (interaction.customId === "done") {
        if (interaction.user.id !== DONO_ID) return interaction.reply({ content: "Aguarde o dono confirmar seu pagamento.", ephemeral: true });
        await interaction.channel.send("✅ **PAGAMENTO CONFIRMADO!** O dono entrará em contato agora.");
        await interaction.reply({ content: "Confirmado.", ephemeral: true });
    }

    // FECHAR (SÓ DONO)
    if (interaction.customId === "close") {
        if (interaction.user.id !== DONO_ID) return interaction.reply({ content: "Apenas o dono pode fechar este canal.", ephemeral: true });
        await interaction.reply("🔒 Fechando em 5 segundos...");
        setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
    }
});

client.login(TOKEN);
