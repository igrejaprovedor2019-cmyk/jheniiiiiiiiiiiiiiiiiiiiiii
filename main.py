import discord
from discord.ext import commands
import os
import asyncio

# Pega as variáveis da Railway
TOKEN = os.getenv('DISCORD_TOKEN')
ID_CATEGORIA_TICKETS = int(os.getenv('ID_CATEGORIA'))
DONO_ID = int(os.getenv('ID_DONO'))

class TicketControl(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)

    @discord.ui.button(label="Confirmar Pagamento", style=discord.ButtonStyle.success, emoji="✅", custom_id="confirm_pay")
    async def confirm(self, interaction: discord.Interaction, button: discord.ui.Button):
        if interaction.user.id != DONO_ID:
            await interaction.response.send_message("❌ Apenas o dono pode confirmar!", ephemeral=True)
            return
        await interaction.response.send_message(f"✅ **PAGAMENTO CONFIRMADO POR {interaction.user.mention}!**")
        button.disabled = True
        await interaction.message.edit(view=self)

    @discord.ui.button(label="Fechar Ticket", style=discord.ButtonStyle.secondary, emoji="🔒", custom_id="close_ticket")
    async def close(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_message("🚨 Deletando em 5s...")
        await asyncio.sleep(5)
        await interaction.channel.delete()

class BuyButton(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)

    @discord.ui.button(label="Comprar", style=discord.ButtonStyle.danger, emoji="🛒", custom_id="buy_button")
    async def buy(self, interaction: discord.Interaction, button: discord.ui.Button):
        guild = interaction.guild
        category = guild.get_channel(ID_CATEGORIA_TICKETS)
        
        ticket_channel = await guild.create_text_channel(
            name=f"🛒-{interaction.user.name}",
            category=category,
            overwrites={
                guild.default_role: discord.PermissionOverwrite(view_channel=False),
                interaction.user: discord.PermissionOverwrite(view_channel=True, send_messages=True),
                guild.me: discord.PermissionOverwrite(view_channel=True, send_messages=True)
            }
        )
        await interaction.response.send_message(f"Ticket: {ticket_channel.mention}", ephemeral=True)
        
        embed = discord.Embed(
            title="🎫 NOVO PEDIDO",
            description=f"**Usuário:** {interaction.user.mention}\n**Valor:** R$ 19,90\n**Chave PIX:** `86975097500`",
            color=discord.Color.red()
        )
        await ticket_channel.send(embed=embed, view=TicketControl())

class Bot(commands.Bot):
    def __init__(self):
        intents = discord.Intents.all() 
        super().__init__(command_prefix="!", intents=intents)

    async def setup_hook(self):
        self.add_view(BuyButton())
        self.add_view(TicketControl())

    async def on_ready(self):
        print(f'✅ Bot online como {self.user}')

bot = Bot()

@bot.command()
async def painel(ctx):
    if ctx.author.id != DONO_ID:
        return
    
    embed = discord.Embed(title="COMBO PREMIUM", color=discord.Color.red())
    embed.add_field(name="⚡ Entrega Automática!", value="🚀 LEVEL MAX +\n🥊 CDK\n⚔️ TTK\n✨ E MUITO MAIS", inline=False)
    embed.add_field(name="Itens Possíveis", value="🐉 Dragon, 🦊 Kitsune, 🐯 Tiger, ❄️ Yeti, 💨 Gás, 🍩 Dough", inline=False)
    embed.add_field(name="Valor à vista", value="R$ 19,90", inline=False)
    embed.set_image(url="https://cdn.dfg.com.br/itemimages/944475148-contas-blox-fruits-kitsune-dark-blade-yoru-e-brindes-NI33.webp")
    
    await ctx.send(embed=embed, view=BuyButton())

bot.run(TOKEN)
