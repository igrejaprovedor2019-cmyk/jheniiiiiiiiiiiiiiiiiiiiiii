const {
    Client,
    GatewayIntentBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    PermissionsBitField,
    ChannelType
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

let ticketCount = 0;

client.once("ready", () => {
    console.log(`🚀 Bot online como ${client.user.tag}`);
});

// COMANDO !painel
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content === "!painel") {

        const embed = new EmbedBuilder()
            .setTitle("🛒 COMBO BLOX FRUITS PREMIUM")
            .setDescription(`
✨ **Entrega automática e segura**

━━━━━━━━━━━━━━

📦 **Inclui:**
📈 Level Max +
🗡️ CDK
⚔️ TTK
🔥 E muito mais...

━━━━━━━━━━━━━━

🍈 **Você recebe UMA dessas frutas:**

🐉 Dragon  
🦊 Kitsune  
🐯 Tiger  
❄️ Yeti  
☁️ Gas  
🍩 Dough  

━━━━━━━━━━━━━━

💰 **Preço:** \`R$19,90\`  
⚡ **Entrega imediata após pagamento**
            `)
            .setImage("https://cdn.dfg.com.br/itemimages/944475148-contas-blox-fruits-kitsune-dark-blade-yoru-e-brindes-NI33.webp")
            .setFooter({ text: "Sistema automático • Compra segura" })
            .setColor("#ff0000");

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("comprar")
                .setLabel("🛒 Comprar Agora")
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId("info")
                .setLabel("ℹ️ Informações")
                .setStyle(ButtonStyle.Secondary)
        );

        await message.channel.send({
            embeds: [embed],
            components: [buttons]
        });
    }
});

// INTERAÇÕES
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    const guild = interaction.guild;

    // BOTÃO COMPRAR
    if (interaction.customId === "comprar") {

        // Evitar ticket duplicado
        const existing = guild.channels.cache.find(c => 
            c.name.includes(interaction.user.username)
        );

        if (existing) {
            return interaction.reply({
                content: `❌ Você já possui um ticket aberto: ${existing}`,
                ephemeral: true
            });
        }

        ticketCount++;

        const channel = await guild.channels.create({
            name: `ticket-${String(ticketCount).padStart(3, "0")}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages
                    ]
                },
                {
                    id: process.env.DONO_ID,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages
                    ]
                }
            ]
        });

        const fecharBtn = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("fechar")
                .setLabel("🔒 Fechar Ticket")
                .setStyle(ButtonStyle.Secondary)
        );

        await channel.send({
            content: `🎫 Olá ${interaction.user},

🛒 **Seu pedido foi iniciado!**

💰 Valor: \`R$19,90\`  
🔑 PIX: \`${process.env.PIX}\`

📌 Envie o comprovante aqui para finalizar.`,
            components: [fecharBtn]
        });

        console.log(`Ticket criado por ${interaction.user.tag}`);

        await interaction.reply({
            content: `✅ Ticket criado: ${channel}`,
            ephemeral: true
        });
    }

    // BOTÃO FECHAR
    if (interaction.customId === "fechar") {

        await interaction.reply({
            content: "🔒 Fechando ticket em 5 segundos...",
            ephemeral: true
        });

        setTimeout(() => {
            interaction.channel.delete();
        }, 5000);
    }

    // BOTÃO INFO
    if (interaction.customId === "info") {
        await interaction.reply({
            content: "ℹ️ Após comprar, você receberá acesso rapidamente. Envie o comprovante no ticket.",
            ephemeral: true
        });
    }
});

client.login(process.env.TOKEN);
