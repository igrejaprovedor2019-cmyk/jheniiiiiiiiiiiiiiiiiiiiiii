import discord
from discord.ext import commands
import os
import asyncio

# Variáveis de ambiente da Railway
TOKEN = os.getenv('
MTQ4ODIzNTAwODIwNzQ4NzA0Ng.GYILUL.HGIp5u55m184anihjtM2KNngCJ55zqP7FkOLDo')
ID_CATEGORIA_TICKETS = int(os.getenv('1489022387948355584'))
DONO_ID = int(os.getenv('1476701960597143683'))

class TicketControl(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)

    @discord.ui.button(label="Confirmar Pagamento", style=discord.ButtonStyle.success, emoji="✅", custom_id="confirm_pay")
    async def confirm(self, interaction: discord.Interaction, button: discord.ui.Button):
        if interaction.user.id != DONO_ID:
            await interaction.response.send_message("❌ Apenas o dono pode confirmar o pagamento!", ephemeral=True)
            return
        
        await interaction.response.send_message(f"✅ **PAGAMENTO CONFIRMADO POR {interaction.user.mention}!**\nO produto será entregue em breve.")
        button.disabled = True
        await interaction.message.edit(view=self)

    @discord.ui.button(label="Fechar Ticket", style=discord.ButtonStyle.secondary, emoji="🔒", custom_id="close_ticket")
    async def close(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_message("🚨 Deletando este ticket em 5 segundos...")
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
        
        await interaction.response.send_message(f"Ticket aberto: {ticket_channel.mention}", ephemeral=True)

        embed_ticket = discord.Embed(
            title="🎫 NOVO PEDIDO - BLOX FRUITS",
            description=(
                f"**Cliente:** {interaction.user.mention}\n"
                "**Valor:** R$ 19,90\n"
                "**Chave PIX:** `86975097500` \n\n"
                "**Aguarde a confirmação do dono.**"
            ),
            color=discord.Color.red()
        )
        await ticket_channel.send(embed=embed_ticket, view=TicketControl())

class Bot(commands.Bot):
    def __init__(self):
        intents = discord.Intents.all()
        super().__init__(command_prefix="!", intents=intents)

    async def setup_hook(self):
        self.add_view(BuyButton())
        self.add_view(TicketControl())

    async def on_ready(self):
        print(f'✅ Bot online: {self.user}')

bot = Bot()

# --- COMANDO ALTERADO PARA !painel ---
@bot.command()
async def painel(ctx):
    if ctx.author.id != DONO_ID:
        return
    
    embed = discord.Embed(title="COMBO PREMIUM", color=discord.Color.red())
    
    # Detalhes do item conforme seu pedido
    embed.add_field(name="⚡ Entrega Automática!", value="🚀 LEVEL MAX +\n🥊 CDK\n⚔️ TTK\n✨ E MUITO MAIS", inline=False)
    
    itens_possiveis = "❗ Uma dessas\n🐉 Dragon\n🦊 Kitsune\n🐯 Tiger\n❄️ Yeti\n💨 Gás\n🍩 Dough"
    embed.add_field(name="", value=itens_possiveis, inline=False)
    
    embed.add_field(name="Valor à vista", value="R$ 19,90", inline=False)
    
    # Link da imagem da Kitsune/Yoru
    embed.set_image(url="https://cdn.dfg.com.br/itemimages/944475148-contas-blox-fruits-kitsune-dark-blade-yoru-e-brindes-NI33.webp")
    
    await ctx.send(embed=embed, view=BuyButton())

bot.run(TOKEN)
