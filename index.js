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
    console.log(`Bot online: ${client.user.tag}`);
});

// PAINEL
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

        message.channel.send({ embeds: [embed], components: [row] });
    }
});

// BOTÕES
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    const guild = interaction.guild;

    // COMPRAR
    if (interaction.customId === "comprar") {

        await interaction.deferReply({ ephemeral: true });

        // cria ticket direto (sem try/catch enchendo o saco)
        const channel = await guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
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

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("confirmar")
                .setLabel("✅ Confirmar Pagamento")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("fechar")
                .setLabel("🔒 Fechar Ticket")
                .setStyle(ButtonStyle.Secondary)
        );

        await channel.send({
            content: `${interaction.user} criou o ticket

Valor: R$19,90
Chave PIX:

${process.env.PIX}`,
            components: [row]
        });

        await interaction.editReply({
            content: `Ticket criado: ${channel}`
        });
    }

    // CONFIRMAR (SÓ DONO)
    if (interaction.customId === "confirmar") {

        if (interaction.user.id !== process.env.DONO_ID) {
            return interaction.reply({
                content: "Apenas o dono pode confirmar.",
                ephemeral: true
            });
        }

        interaction.channel.send("✅ Pagamento confirmado!");
        interaction.reply({ content: "Confirmado.", ephemeral: true });
    }

    // FECHAR (SÓ DONO)
    if (interaction.customId === "fechar") {

        if (interaction.user.id !== process.env.DONO_ID) {
            return interaction.reply({
                content: "Apenas o dono pode fechar.",
                ephemeral: true
            });
        }

        await interaction.reply({
            content: "Fechando em 3s...",
            ephemeral: true
        });

        setTimeout(() => {
            interaction.channel.delete();
        }, 3000);
    }
});

client.login(process.env.TOKEN);
