"""Generate icon set + Open Graph image for SI Data Imigrasi Sulbar."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
SRC = Path(__file__).resolve().parent.parent / "Lambang Imigrasi Sulawesi Barat.png"

NAVY = (10, 30, 90, 255)
GOLD = (255, 196, 0, 255)
WHITE = (255, 255, 255, 255)

PUBLIC.mkdir(exist_ok=True, parents=True)

# ---------- 1. Normalize logo (trim transparent padding, square) ----------
src = Image.open(SRC).convert("RGBA")
bbox = src.getbbox()
if bbox:
    src = src.crop(bbox)

side = max(src.size)
square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
offset = ((side - src.width) // 2, (side - src.height) // 2)
square.paste(src, offset)

# ---------- 2. Favicon sizes ----------
for size in (16, 32, 64, 128, 256, 192, 512):
    ico = square.resize((size, size), Image.LANCZOS)
    ico.save(PUBLIC / f"favicon-{size}x{size}.png")
    print(f"favicon-{size}x{size}.png written")

# App icon (for apple-touch-icon / PWA)
app_icon = square.resize((180, 180), Image.LANCZOS)
app_icon.save(PUBLIC / "apple-touch-icon.png")
print("apple-touch-icon.png written")

# ---------- 3. Open Graph image (1200x630) ----------
W, H = 1200, 630
canvas = Image.new("RGB", (W, H), NAVY)
draw = ImageDraw.Draw(canvas)

# Subtle gold wave at the bottom (echoes the logo)
for i in range(H):
    y = int(H * 0.82 + 26 * (i / H))
    draw.line([(0, y + 26), (W, y)], fill=GOLD, width=0)
draw.polygon(
    [(0, H), (0, H - 60), (W // 2, H - 110), (W, H - 40), (W, H)],
    fill=(16, 42, 110, 255),
)
draw.line([(0, H - 60), (W // 2, H - 110), (W, H - 40)], fill=GOLD, width=4)

# Logo — sized to fit neatly on the left
logo = square.resize((380, 380), Image.LANCZOS)
canvas.paste(logo, (70, 125), logo)

# Text block on the right — use Pillow's built-in default font (no TTF dep)
f_title = ImageFont.load_default(size=64)
f_sub = ImageFont.load_default(size=34)
f_org = ImageFont.load_default(size=30)
tx = 510
ty = 170
draw.rectangle([510, 140, 526, 250], fill=GOLD)
draw.text((tx, ty), "SI Data", font=f_title, fill=WHITE)
ty2 = ty + 90
draw.text((tx, ty2), "Imigrasi Sulbar", font=f_title, fill=WHITE)
draw.text((510, 360), "Portal informasi dan data keimigrasian", font=f_sub, fill=(220, 228, 245, 255))
draw.text((510, 405), "terintegrasi di wilayah Sulawesi Barat", font=f_sub, fill=(220, 228, 245, 255))
draw.text((510, 470), "Kanwil Ditjen Imigrasi Sulawesi Barat", font=f_org, fill=GOLD)

canvas.save(PUBLIC / "og-image.png")
print("og-image.png written (1200x630)")

# Twitter card also 1200x630 — reuse the same file
print("done.")
