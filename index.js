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

client.once("clientReady", () => {
    console.log(`✅ Online: ${client.user.tag}`);
});

// ================= PAINEL =================
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content === "!painel") {

        const embed = new EmbedBuilder()
            .setTitle("🔥 COMBO BLOX FRUITS")
            .setDescription(`
✨ Entrega rápida e segura

━━━━━━━━━━━━━━

📦 Inclui:
📈 Level Max +
🗡️ CDK
⚔️ TTK

🍈 Frutas:
🐉 Dragon • 🦊 Kitsune • 🐯 Tiger  
❄️ Yeti • ☁️ Gas • 🍩 Dough  

━━━━━━━━━━━━━━

💰 **R$19,90**
            `)
            .setImage("https://cdn.dfg.com.br/itemimages/944475148-contas-blox-fruits-kitsune-dark-blade-yoru-e-brindes-NI33.webp")
            .setColor("#ff0000");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("comprar")
                .setLabel("🛒 Comprar")
                .setStyle(ButtonStyle.Danger)
        );

        await message.channel.send({ embeds: [embed], components: [row] });
    }
});

// ================= BOTÕES =================
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    const { guild, user, customId, channel } = interaction;

    // ================= COMPRAR =================
    if (customId === "comprar") {

        // RESPONDE RÁPIDO (evita travar)
        await interaction.reply({
            content: "✅ Abrindo seu ticket...",
            ephemeral: true
        });

        try {
            // nome SEM BUG
            const nome = user.username.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

            const ticket = await guild.channels.create({
                name: `ticket-${nome}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: [PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: user.id,
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

            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("confirmar")
                    .setLabel("✅ Confirmar Pagamento")
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId("fechar")
                    .setLabel("🔒 Fechar")
                    .setStyle(ButtonStyle.Secondary)
            );

            await ticket.send({
                content: `🎫 ${user} criou o ticket

💰 Valor: R$19,90  
🔑 Chave PIX:

\`\`\`
${process.env.PIX}
\`\`\`

📌 Envie o comprovante.`,
                components: [buttons]
            });

        } catch (err) {
            console.log("ERRO:", err);
        }
    }

    // ================= CONFIRMAR =================
    if (customId === "confirmar") {

        if (user.id !== process.env.DONO_ID) {
            return interaction.reply({
                content: "❌ Apenas o dono confirma.",
                ephemeral: true
            });
        }

        await channel.send("✅ Pagamento confirmado!");
        await interaction.reply({ content: "Confirmado.", ephemeral: true });
    }

    // ================= FECHAR =================
    if (customId === "fechar") {

        if (user.id !== process.env.DONO_ID) {
            return interaction.reply({
                content: "❌ Apenas o dono fecha.",
                ephemeral: true
            });
        }

        await interaction.reply({ content: "🔒 Fechando...", ephemeral: true });

        setTimeout(() => {
            channel.delete().catch(() => {});
        }, 3000);
    }
});

client.login(process.env.TOKEN);
