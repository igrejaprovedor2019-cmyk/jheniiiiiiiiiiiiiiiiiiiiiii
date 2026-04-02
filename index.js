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
    console.log(`✅ Bot online: ${client.user.tag}`);
});

// ================= COMANDO !painel =================
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content === "!painel") {

        const embed = new EmbedBuilder()
            .setTitle("🛒 COMBO BLOX FRUITS")
            .setDescription(`
📈 LEVEL MAX +
🗡️ CDK
⚔️ TTK

🍈 Frutas:
🐉 Dragon
🦊 Kitsune
🐯 Tiger
❄️ Yeti
☁️ Gas
🍩 Dough

💰 R$19,90
            `)
            .setImage("https://cdn.dfg.com.br/itemimages/944475148-contas-blox-fruits-kitsune-dark-blade-yoru-e-brindes-NI33.webp")
            .setColor("Red");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("comprar")
                .setLabel("🛒 Comprar")
                .setStyle(ButtonStyle.Danger)
        );

        await message.channel.send({
            embeds: [embed],
            components: [row]
        });
    }
});

// ================= BOTÕES =================
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    const { guild, user, customId, channel } = interaction;

    // ================= COMPRAR =================
    if (customId === "comprar") {

        await interaction.deferReply({ ephemeral: true });

        try {
            // nome seguro
            const nome = user.username
                .replace(/[^a-zA-Z0-9]/g, "")
                .toLowerCase();

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

            const rowTicket = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("confirmar")
                    .setLabel("✅ Confirmar Pagamento")
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId("fechar")
                    .setLabel("🔒 Fechar Ticket")
                    .setStyle(ButtonStyle.Secondary)
            );

            await ticket.send({
                content: `${user} criou o ticket

Valor: R$19,90
Chave PIX:

${process.env.PIX}`,
                components: [rowTicket]
            });

            await interaction.editReply({
                content: `✅ Ticket criado: ${ticket}`
            });

        } catch (err) {
            console.log("ERRO REAL:", err);
        }
    }

    // ================= CONFIRMAR =================
    if (customId === "confirmar") {

        if (user.id !== process.env.DONO_ID) {
            return interaction.reply({
                content: "❌ Apenas o dono pode confirmar.",
                ephemeral: true
            });
        }

        await channel.send("✅ Pagamento confirmado!");
        await interaction.reply({
            content: "Confirmado.",
            ephemeral: true
        });
    }

    // ================= FECHAR =================
    if (customId === "fechar") {

        if (user.id !== process.env.DONO_ID) {
            return interaction.reply({
                content: "❌ Apenas o dono pode fechar.",
                ephemeral: true
            });
        }

        await interaction.reply({
            content: "🔒 Fechando...",
            ephemeral: true
        });

        setTimeout(() => {
            channel.delete().catch(() => {});
        }, 3000);
    }
});

client.login(process.env.TOKEN);
