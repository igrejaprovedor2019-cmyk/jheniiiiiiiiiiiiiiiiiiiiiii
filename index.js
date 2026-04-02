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
    console.log(`✅ Bot online: ${client.user.tag}`);
});

// COMANDO !painel
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content === "!painel") {

        const embed = new EmbedBuilder()
            .setTitle("🛒 COMBO BLOX FRUITS")
            .setDescription(`
📈 Level Max +
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

        message.channel.send({ embeds: [embed], components: [row] });
    }
});

// BOTÕES
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    const guild = interaction.guild;

    if (interaction.customId === "comprar") {

        await interaction.deferReply({ ephemeral: true });

        try {
            ticketCount++;

            // NOME SEGURO (sem bug)
            const nome = interaction.user.username
                .replace(/[^a-zA-Z0-9]/g, "")
                .toLowerCase();

            // PERMISSÕES BASE
            let perms = [
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
                }
            ];

            // ADICIONA DONO SÓ SE EXISTIR
            if (process.env.DONO_ID) {
                perms.push({
                    id: process.env.DONO_ID.trim(),
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages
                    ]
                });
            }

            const channel = await guild.channels.create({
                name: `ticket-${nome}-${ticketCount}`,
                type: ChannelType.GuildText,
                permissionOverwrites: perms
            });

            await channel.send({
                content: `🎫 ${interaction.user}

💰 Valor: R$19,90
🔑 PIX: ${process.env.PIX}

📌 Envie o comprovante aqui.`
            });

            await interaction.editReply({
                content: `✅ Ticket criado: ${channel}`
            });

        } catch (err) {
            console.log("ERRO REAL:", err);

            await interaction.editReply({
                content: "❌ Erro real detectado. Veja o console do Railway."
            });
        }
    }
});

client.login(process.env.TOKEN);
