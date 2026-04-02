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

const fs = require("fs");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

let ticketCount = 0;

client.once("ready", () => {
    console.log(`🚀 Loja online como ${client.user.tag}`);
});

// COMANDO !painel
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content === "!painel") {

        const embed = new EmbedBuilder()
            .setTitle("🛒 COMBO BLOX FRUITS PREMIUM")
            .setDescription(`
✨ Entrega automática e segura

━━━━━━━━━━━━━━

📦 Inclui:
📈 Level Max +
🗡️ CDK
⚔️ TTK
🔥 E muito mais...

━━━━━━━━━━━━━━

🍈 Você recebe UMA dessas frutas:

🐉 Dragon  
🦊 Kitsune  
🐯 Tiger  
❄️ Yeti  
☁️ Gas  
🍩 Dough  

━━━━━━━━━━━━━━

💰 Preço: R$19,90
⚡ Entrega imediata
            `)
            .setImage("https://cdn.dfg.com.br/itemimages/944475148-contas-blox-fruits-kitsune-dark-blade-yoru-e-brindes-NI33.webp")
            .setFooter({ text: "Compra segura • Sistema automático" })
            .setColor("#ff0000");

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("comprar")
                .setLabel("🛒 Comprar")
                .setStyle(ButtonStyle.Danger)
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

    // ================== COMPRAR ==================
    if (interaction.customId === "comprar") {

        await interaction.deferReply({ ephemeral: true });

        try {
            const existing = guild.channels.cache.find(c =>
                c.name.includes(interaction.user.username)
            );

            if (existing) {
                return interaction.editReply({
                    content: `❌ Você já tem um ticket aberto: ${existing}`
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

            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("pago")
                    .setLabel("✅ Já Paguei")
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId("fechar")
                    .setLabel("🔒 Fechar Ticket")
                    .setStyle(ButtonStyle.Secondary)
            );

            await channel.send({
                content: `🎫 ${interaction.user}

💰 Valor: R$19,90
🔑 PIX: ${process.env.PIX}

📌 Envie o comprovante ou clique em "Já Paguei".`,
                components: [buttons]
            });

            await interaction.editReply({
                content: `✅ Ticket criado: ${channel}`
            });

        } catch (err) {
            console.log(err);

            await interaction.editReply({
                content: "❌ Erro ao criar ticket. Verifique permissões do bot!"
            });
        }
    }

    // ================== PAGO ==================
    if (interaction.customId === "pago") {

        await interaction.deferReply({ ephemeral: true });

        try {
            const member = await guild.members.fetch(interaction.user.id);

            await member.roles.add(process.env.CARGO_CLIENTE_ID);

            await interaction.editReply({
                content: "✅ Pagamento confirmado! Cargo entregue."
            });

        } catch (err) {
            console.log(err);

            await interaction.editReply({
                content: "❌ Erro ao entregar cargo!"
            });
        }
    }

    // ================== FECHAR ==================
    if (interaction.customId === "fechar") {

        await interaction.deferReply({ ephemeral: true });

        try {
            const messages = await interaction.channel.messages.fetch({ limit: 100 });

            let transcript = "";

            messages.reverse().forEach(msg => {
                transcript += `${msg.author.tag}: ${msg.content}\n`;
            });

            fs.writeFileSync(`transcript-${interaction.channel.name}.txt`, transcript);

            await interaction.editReply({
                content: "📁 Transcript salvo! Fechando em 5s..."
            });

            setTimeout(() => {
                interaction.channel.delete();
            }, 5000);

        } catch (err) {
            console.log(err);

            await interaction.editReply({
                content: "❌ Erro ao fechar ticket!"
            });
        }
    }
});

client.login(process.env.TOKEN);
