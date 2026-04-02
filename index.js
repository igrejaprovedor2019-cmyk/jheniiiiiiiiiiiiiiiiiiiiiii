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

// Inicialização com Intents para ler mensagens e comandos
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Evento quando o bot liga
client.once("ready", () => {
    console.log(`✅ Bot online: ${client.user.tag}`);
    console.log(`👑 ID do Dono: ${process.env.DONO_ID}`);
});

// COMANDO DO PAINEL
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content === "!painel") {
        // Verifica se quem enviou é o dono configurado na Railway
        if (message.author.id !== process.env.DONO_ID) return;

        const embed = new EmbedBuilder()
            .setTitle("🛒 COMBO BLOX FRUITS")
            .setDescription(`
📈 **LEVEL MAX +**
🗡️ **CDK**
⚔️ **TTK**

🍈 **Frutas Disponíveis:**
🐉 Dragon, 🦊 Kitsune, 🐯 Tiger, ❄️ Yeti, ☁️ Gas, 🍩 Dough

💰 **Valor:** R$ 19,90
            `)
            .setImage("https://cdn.dfg.com.br/itemimages/944475148-contas-blox-fruits-kitsune-dark-blade-yoru-e-brindes-NI33.webp")
            .setColor("Red");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("comprar")
                .setLabel("🛒 Comprar Agora")
                .setStyle(ButtonStyle.Danger)
        );

        await message.channel.send({ embeds: [embed], components: [row] });
        
        // Apaga a mensagem "!painel" do chat para ficar limpo
        if (message.deletable) await message.delete().catch(() => {});
    }
});

// INTERAÇÃO COM OS BOTÕES
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    const { guild, user, customId, channel } = interaction;

    // BOTÃO COMPRAR
    if (customId === "comprar") {
        await interaction.deferReply({ ephemeral: true });

        try {
            // Cria o canal de ticket no topo do servidor
            const ticketChannel = await guild.channels.create({
                name: `🛒-${user.username}`,
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
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.AttachFiles
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

            await ticketChannel.send({
                content: `👋 Olá ${user}! <@${process.env.DONO_ID}>\n\n**PRODUTO:** Combo Blox Fruits\n**VALOR:** R$ 19,90\n\n**CHAVE PIX:** \`${process.env.PIX}\`\n\nEnvia o comprovante aqui e aguarda a confirmação do dono.`,
                components: [rowTicket]
            });

            await interaction.editReply({ content: `✅ Ticket aberto com sucesso: ${ticketChannel}` });

        } catch (error) {
            console.error("Erro ao abrir ticket:", error);
            await interaction.editReply({ content: "❌ Erro ao criar canal. Verifique as permissões do bot." });
        }
    }

    // BOTÃO CONFIRMAR (APENAS O DONO)
    if (customId === "confirmar") {
        if (user.id !== process.env.DONO_ID) {
            return interaction.reply({ content: "❌ Apenas o dono pode confirmar o pagamento.", ephemeral: true });
        }
        await channel.send("✅ **Pagamento confirmado pelo dono! Aguarde o envio.**");
        await interaction.reply({ content: "Pagamento confirmado.", ephemeral: true });
    }

    // BOTÃO FECHAR (APENAS O DONO)
    if (customId === "fechar") {
        if (user.id !== process.env.DONO_ID) {
            return interaction.reply({ content: "❌ Apenas o dono pode fechar o ticket.", ephemeral: true });
        }
        await interaction.reply({ content: "🔒 Fechando em 5 segundos...", ephemeral: true });
        setTimeout(() => channel.delete().catch(() => {}), 5000);
    }
});

client.login(process.env.TOKEN);
