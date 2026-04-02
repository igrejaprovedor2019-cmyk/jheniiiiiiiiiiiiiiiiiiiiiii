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

client.once("clientReady", () => {
    console.log(`🚀 Bot online como ${client.user.tag}`);
});

// ================= PAINEL =================
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content === "!painel") {

        const embed = new EmbedBuilder()
            .setTitle("🛒 COMBO BLOX FRUITS")
            .setDescription(`
📈 LEVEL MAX +
🗡️ CDK
⚔️ TTK
🔥 E MUITO MAIS

━━━━━━━━━━━━━━

🍈 Uma dessas:

🐉 Dragon  
🦊 Kitsune  
🐯 Tiger  
❄️ Yeti  
☁️ Gas  
🍩 Dough  

━━━━━━━━━━━━━━

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

// ================= BOTÕES =================
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    const guild = interaction.guild;

    // ================= COMPRAR =================
    if (interaction.customId === "comprar") {

        await interaction.deferReply({ ephemeral: true });

        try {
            const existing = guild.channels.cache.find(c =>
                c.topic === interaction.user.id
            );

            if (existing) {
                return interaction.editReply({
                    content: `❌ Você já possui um ticket: ${existing}`
                });
            }

            ticketCount++;

            const channel = await guild.channels.create({
                name: `ticket-${String(ticketCount).padStart(3, "0")}`,
                type: ChannelType.GuildText,
                topic: interaction.user.id,
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

            // BOTÕES DO TICKET (SÓ DONO USA)
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

            // 🔥 MENSAGEM EXATA QUE VOCÊ PEDIU
            await channel.send({
                content: `${interaction.user} criou o ticket

Valor: R$19,90  
Chave PIX:

${process.env.PIX}`,
                components: [row]
            });

            await interaction.editReply({
                content: `✅ Ticket criado: ${channel}`
            });

        } catch (err) {
            console.log("ERRO REAL:", err);

            await interaction.editReply({
                content: "❌ Erro ao criar ticket."
            });
        }
    }

    // ================= CONFIRMAR PAGAMENTO (SÓ DONO) =================
    if (interaction.customId === "confirmar") {

        if (interaction.user.id !== process.env.DONO_ID) {
            return interaction.reply({
                content: "❌ Apenas o dono pode confirmar pagamento.",
                ephemeral: true
            });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            const userId = interaction.channel.topic;

            const member = await guild.members.fetch(userId);

            if (process.env.CARGO_CLIENTE_ID) {
                await member.roles.add(process.env.CARGO_CLIENTE_ID);
            }

            await interaction.channel.send(`✅ Pagamento confirmado para ${member}`);

            await interaction.editReply({
                content: "Pagamento confirmado!"
            });

        } catch (err) {
            console.log(err);

            await interaction.editReply({
                content: "Erro ao confirmar pagamento."
            });
        }
    }

    // ================= FECHAR (SÓ DONO) =================
    if (interaction.customId === "fechar") {

        if (interaction.user.id !== process.env.DONO_ID) {
            return interaction.reply({
                content: "❌ Apenas o dono pode fechar.",
                ephemeral: true
            });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            const messages = await interaction.channel.messages.fetch({ limit: 100 });

            let transcript = "";

            messages.reverse().forEach(msg => {
                transcript += `${msg.author.tag}: ${msg.content}\n`;
            });

            fs.writeFileSync(`transcript-${interaction.channel.name}.txt`, transcript);

            await interaction.editReply({
                content: "📁 Ticket fechado em 5s..."
            });

            setTimeout(() => {
                interaction.channel.delete();
            }, 5000);

        } catch (err) {
            console.log(err);

            await interaction.editReply({
                content: "Erro ao fechar ticket."
            });
        }
    }
});

client.login(process.env.TOKEN);
