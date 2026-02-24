import asyncio
import re
import requests
import platform
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.models.all_models import Team, Player
from app.db.session import DATABASE_URL

# Fix for Windows Asyncio Loop
if platform.system() == 'Windows':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

engine = create_async_engine(DATABASE_URL)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

TEAM_URLS = {
    "CSK": "https://www.iplt20.com/teams/chennai-super-kings/squad",
    "MI": "https://www.iplt20.com/teams/mumbai-indians/squad",
    "RCB": "https://www.iplt20.com/teams/royal-challengers-bengaluru/squad",
    "KKR": "https://www.iplt20.com/teams/kolkata-knight-riders/squad",
    "SRH": "https://www.iplt20.com/teams/sunrisers-hyderabad/squad",
    "DC": "https://www.iplt20.com/teams/delhi-capitals/squad",
    "PBKS": "https://www.iplt20.com/teams/punjab-kings/squad",
    "RR": "https://www.iplt20.com/teams/rajasthan-royals/squad",
    "LSG": "https://www.iplt20.com/teams/lucknow-super-giants/squad",
    "GT": "https://www.iplt20.com/teams/gujarat-titans/squad"
}

def normalize_name(name):
    if not isinstance(name, str):
        return ""
    return re.sub(r'[^a-zA-Z0-9]', '', name).lower()

def scrape_player_images():
    image_map = {} 
    try:
        print("Scraping Squad Pages for latest headshots...")
        for code, url in TEAM_URLS.items():
            try:
                print(f"Scraping {code}...")
                resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
                if resp.status_code == 200:
                    # Capture slugs and IDs
                    matches = re.findall(r'href="https://www.iplt20.com/players/([^/]+)/(\d+)"', resp.text)
                    for slug, pid in matches:
                        norm_name = normalize_name(slug.replace('-', ' '))
                        image_url = f"https://documents.iplt20.com/ipl/IPLHeadshot2024/{pid}.png"
                        image_map[norm_name] = image_url
            except Exception as e:
                print(f"Skip {code}: {e}")
    except Exception as e:
        print(f"Scrape Error: {e}")
    return image_map

async def update_assets():
    image_map = scrape_player_images()
    print(f"Scraped {len(image_map)} player headshot URLs.")

    async with async_session() as session:
        # 1. Update Team Logos to High-Res "Roundbig"
        print("Updating Team Logos...")
        result = await session.execute(select(Team))
        teams = result.scalars().all()
        for t in teams:
            # Pattern: https://documents.iplt20.com/ipl/[CODE]/Logos/Roundbig/[CODE]roundbig.png
            # Note: Some codes match folder names, some don't perfectly (e.g. MUM, CHH based on seed_data_v2)
            # But documents.iplt20.com usually follows the short code if available.
            # Let's try to map them correctly based on known folders.
            folder_map = {
                "CSK": "CSK",
                "MI": "MI",
                "RCB": "RCB",
                "KKR": "KKR",
                "SRH": "SRH",
                "DC": "DC",
                "PBKS": "PBKS",
                "RR": "RR",
                "LSG": "LSG",
                "GT": "GT"
            }
            folder = folder_map.get(t.code, t.code)
            new_logo = f"https://documents.iplt20.com/ipl/{folder}/Logos/Roundbig/{folder}roundbig.png"
            print(f"Setting {t.code} logo to: {new_logo}")
            t.logo_url = new_logo

        # 2. Update Player Images
        print("Updating Player Images...")
        result = await session.execute(select(Player))
        players = result.scalars().all()
        updated_players = 0
        for p in players:
            norm = normalize_name(p.name)
            img = image_map.get(norm)
            
            # Fuzzy match if not exact
            if not img:
                for k, v in image_map.items():
                    if k in norm or norm in k:
                        img = v
                        break
            
            if img:
                p.image_url = img
                updated_players += 1
            else:
                # Keep existing or fallback to placeholder
                if "placeholder" in p.image_url:
                    p.image_url = "https://www.iplt20.com/assets/images/IPL/placeholder.png"

        await session.commit()
        print(f"Successfully updated {len(teams)} teams and {updated_players} player images.")

if __name__ == "__main__":
    asyncio.run(update_assets())
