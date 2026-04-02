const {
    Client,
    GatewayIntentBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    PermissionsBitField
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`Logado como ${client.user.tag}`);
});

// COMANDO !painel
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content === "!painel") {

        const embed = new EmbedBuilder()
            .setTitle("COMBO PREMIUM")
            .setDescription(`
⚡ Entrega Automática!

📈 LEVEL MAX +
🗡️ CDK
⚔️ TTK
🔥 E MUITO MAIS

💰 Valor à vista
R$ 19,90
            `)
            .setImage("https://cdn.dfg.com.br/itemimages/944475148-contas-blox-fruits-kitsune-dark-blade-yoru-e-brindes-NI33.webp")
            .setColor("Red");

        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("comprar")
                .setLabel("Comprar")
                .setStyle(ButtonStyle.Danger)
        );

        message.channel.send({
            embeds: [embed],
            components: [button]
        });
    }
});

// BOTÃO COMPRAR
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "comprar") {

        const guild = interaction.guild;

        const channel = await guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: 0,
            permissionOverwrites: [
                {
                    id: guild.id,
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

        await channel.send({
            content: `@${interaction.user.username} criou o ticket\n💰 Valor: R$19,90\n🔑 Chave PIX: ${process.env.PIX}`
        });

        await interaction.reply({
            content: `✅ Ticket criado: ${channel}`,
            ephemeral: true
        });
    }
});

client.login(process.env.TOKEN);
