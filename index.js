import discord
from discord.ext import commands
import os
import asyncio

# Configurações via Variáveis de Ambiente (Railway)
TOKEN = os.getenv('DISCORD_TOKEN')
ID_CATEGORIA_TICKETS = int(os.getenv('ID_CATEGORIA'))
DONO_ID = int(os.getenv('ID_DONO'))

class TicketControl(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)

    @discord.ui.button(label="Confirmar Pagamento", style=discord.ButtonStyle.success, emoji="✅", custom_id="confirm_pay")
    async def confirm(self, interaction: discord.Interaction, button: discord.ui.Button):
        # Verifica se o ID de quem clicou é IGUAL ao ID do Dono configurado
        if interaction.user.id != DONO_ID:
            await interaction.response.send_message("❌ Apenas o dono pode confirmar este pagamento!", ephemeral=True)
            return

        await interaction.response.send_message(f"✅ **PAGAMENTO CONFIRMADO POR {interaction.user.mention}!**\nO produto será entregue em breve.")
        
        # Desabilita o botão após confirmado para evitar cliques duplos
        button.disabled = True
        await interaction.message.edit(view=self)

    @discord.ui.button(label="Fechar Ticket", style=discord.ButtonStyle.secondary, emoji="🔒", custom_id="close_ticket")
    async def close(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_message("🚨 Este ticket será deletado em 5 segundos...")
        await asyncio.sleep(5)
        await interaction.channel.delete()

class BuyButton(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)

    @discord.ui.button(label="Comprar", style=discord.ButtonStyle.danger, emoji="🛒", custom_id="buy_button")
    async def buy(self, interaction: discord.Interaction, button: discord.ui.Button):
        guild = interaction.guild
        category = guild.get_channel(ID_CATEGORIA_TICKETS)
        
        # Cria o canal privado do ticket
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
                f"{interaction.user.mention} criou o ticket.\n\n"
                "**Valor:** R$ 19,90\n"
                "**Chave PIX:** `86975097500` \n\n"
                "**Aguarde a confirmação do dono.**"
            ),
            color=discord.Color.red()
        )
        
        await ticket_channel.send(embed=embed_ticket, view=TicketControl())

class Bot(commands.Bot):
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        super().__init__(command_prefix="!", intents=intents)

    async def setup_hook(self):
        self.add_view(BuyButton())
        self.add_view(TicketControl())

bot = Bot()

@bot.command()
async def postar(ctx):
    # Apenas o dono pode usar o comando de postar a tabela
    if ctx.author.id != DONO_ID:
        return

    embed = discord.Embed(title="COMBO PREMIUM", color=discord.Color.red())
    embed.add_field(name="⚡ Entrega Automática!", value="🚀 LEVEL MAX +\n🥊 CDK\n⚔️ TTK\n✨ E MUITO MAIS", inline=False)
    
    info_items = "❗ Uma dessas\n🐉 Dragon\n🦊 Kitsune\n🐯 Tiger\n❄️ Yeti\n💨 Gás\n🍩 Dough"
    embed.add_field(name="", value=info_items, inline=False)
    embed.add_field(name="Valor à vista", value="R$ 19,90", inline=False)
    
    embed.set_image(url="https://cdn.dfg.com.br/itemimages/944475148-contas-blox-fruits-kitsune-dark-blade-yoru-e-brindes-NI33.webp")
    
    await ctx.send(embed=embed, view=BuyButton())

bot.run(TOKEN)
