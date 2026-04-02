const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, Partials } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel]
});

// Configurações vindas da Railway
const TOKEN = process.env.DISCORD_TOKEN;
const ID_CATEGORIA = process.env.ID_CATEGORIA;
const ID_DONO = process.env.ID_DONO;

client.once('ready', () => {
    console.log(`✅ BOT ONLINE: ${client.user.tag}`);
    console.log(`📌 ID do Dono configurado: ${ID_DONO}`);
});

client.on('messageCreate', async (message) => {
    // Se não for o dono ou for bot, ignora
    if (message.author.bot) return;

    if (message.content === '!painel') {
        if (message.author.id !== ID_DONO) {
            return console.log(`⚠️ Usuário ${message.author.tag} tentou usar o comando, mas não é o dono.`);
        }

        const embed = new EmbedBuilder()
            .setTitle('🔥 COMBO PREMIUM - BLOX FRUITS')
            .setColor(0xFF0000)
            .addFields(
                { name: '⚡ Entrega Automática!', value: '
http://googleusercontent.com/immersive_entry_chip/0

2.  **Intents (O erro mais comum)**:
    * Vá no [Discord Developer Portal](https://discord.com/developers/applications).
    * Clique no seu Bot -> **Bot**.
    * Ative: **Presence Intent**, **Server Members Intent** e **Message Content Intent**.
    * **SALVE AS ALTERAÇÕES**. Sem isso, o bot ignora o comando `!painel`.

3.  **IDs na Railway**:
    * Certifique-se de que o `ID_DONO` é apenas o número (ex: `123456789012345`).
    * Certifique-se de que o `ID_CATEGORIA` é o ID de uma categoria que **existe** no servidor onde o bot está.

Se o bot estiver online na Railway mas não responder ao comando, o problema é 100% a **Message Content Intent** desativada no painel do Discord. Confira isso!
