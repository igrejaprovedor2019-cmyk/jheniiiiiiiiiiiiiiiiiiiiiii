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
    console.log("Bot online");
});

// PAINEL
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content === "!painel") {

        const embed = new EmbedBuilder()
            .setTitle("COMBO BLOX FRUITS")
            .setDescription("R$19,90")
            .setColor("Red");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("comprar")
                .setLabel("COMPRAR")
                .setStyle(ButtonStyle.Danger)
        );

        await message.channel.send({
            embeds: [embed],
            components: [row]
        });
    }
});

// BOTÃO
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "comprar") {

        const guild = interaction.guild;

        // responde imediatamente (OBRIGATÓRIO)
        await interaction.deferReply({ ephemeral: true });

        // cria canal
        const canal = await guild.channels.create({
            name: `ticket-${interaction.user.id}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: process.env.DONO_ID,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                }
            ]
        });

        // mensagem dentro do ticket
        await canal.send({
            content: `${interaction.user} criou o ticket

Valor: R$19,90
Chave PIX:

${process.env.PIX}`
        });

        await interaction.editReply({
            content: `Ticket: ${canal}`
        });
    }
});

client.login(process.env.TOKEN);
