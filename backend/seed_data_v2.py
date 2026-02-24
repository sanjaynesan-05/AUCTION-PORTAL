import asyncio
import pandas as pd
import requests
import re
import sys
import os
import traceback
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select, delete
from app.models.all_models import Team, Player
from app.db.session import Base, DATABASE_URL

# Fix for Windows Asyncio Loop
import platform
if platform.system() == 'Windows':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

engine = create_async_engine(DATABASE_URL, echo=True, connect_args={"statement_cache_size": 0})
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
        print("Scraping Squad Pages...")
        for code, url in TEAM_URLS.items():
            try:
                print(f"Scraping {code}...")
                resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
                if resp.status_code == 200:
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

async def seed_data():
    try:
        # Scrape
        image_map = scrape_player_images()
        print(f"Found {len(image_map)} images.")
        
        # Read Excel
        excel_path = "IPL_2025_FINAL_OUTPUT.xlsx"
        if not os.path.exists(excel_path):
             excel_path = "../IPL_2025_FINAL_OUTPUT.xlsx"
        
        if not os.path.exists(excel_path):
            print(f"Excel file not found at {excel_path}")
            return

        xl = pd.ExcelFile(excel_path)
        sheets = xl.sheet_names
        print(f"Reading sheets: {sheets}")

        async with async_session() as session:
            # Clear existing data for fresh update
            from sqlalchemy import delete
            from app.models.all_models import Bid, AuctionState
            await session.execute(delete(AuctionState))
            await session.execute(delete(Bid))
            await session.execute(delete(Player))
            # Optional: Clear teams if you want to update their logos fully
            # await session.execute(delete(Team)) 
            await session.commit()
            print("Database cleared (AuctionState, Bid, Player) for fresh seeding.")

            # Teams ensure
            teams_info = {
                "CSK": {"name": "Chennai Super Kings", "logo": "https://documents.iplt20.com/ipl/CSK/logos/Logooutline/CSKoutline.png", "color": "#FFCC00", "p": "#FFCC00", "s": "#003366"},
                "MI": {"name": "Mumbai Indians", "logo": "https://documents.iplt20.com/ipl/MI/Logos/Logooutline/MIoutline.png", "color": "#004BA0", "p": "#004BA0", "s": "#FFD700"},
                "RCB": {"name": "Royal Challengers Bengaluru", "shortName": "RCB", "logo": "https://documents.iplt20.com/ipl/RCB/Logos/Logooutline/RCBoutline.png", "color": "#EC1C24", "p": "#EC1C24", "s": "#FFD700"},
                "KKR": {"name": "Kolkata Knight Riders", "logo": "https://documents.iplt20.com/ipl/KKR/Logos/Logooutline/KKRoutline.png", "color": "#3A225D", "p": "#3A225D", "s": "#FFD700"},
                "SRH": {"name": "Sunrisers Hyderabad", "logo": "https://documents.iplt20.com/ipl/SRH/Logos/Logooutline/SRHoutline.png", "color": "#FF822A", "p": "#FF822A", "s": "#000000"},
                "DC": {"name": "Delhi Capitals", "logo": "https://documents.iplt20.com/ipl/DC/Logos/LogoOutline/DCoutline.png", "color": "#004C93", "p": "#004C93", "s": "#DC143C"},
                "PBKS": {"name": "Punjab Kings", "logo": "https://documents.iplt20.com/ipl/PBKS/Logos/Logooutline/PBKSoutline.png", "color": "#ED1B24", "p": "#ED1B24", "s": "#FFD700"},
                "RR": {"name": "Rajasthan Royals", "logo": "https://documents.iplt20.com/ipl/RR/Logos/RR_Logo.png", "color": "#254AA5", "p": "#254AA5", "s": "#FFB6C1"},
                "LSG": {"name": "Lucknow Super Giants", "logo": "https://documents.iplt20.com/ipl/LSG/Logos/Logooutline/LSGoutline.png", "color": "#00A0E3", "p": "#00A0E3", "s": "#FFD700"},
                "GT": {"name": "Gujarat Titans", "logo": "https://documents.iplt20.com/ipl/GT/Logos/Logooutline/GToutline.png", "color": "#1B2631", "p": "#1B2631", "s": "#FFD700"}
            }

            for code, info in teams_info.items():
                stmt = select(Team).where(Team.code == code)
                result = await session.execute(stmt)
                t = result.scalars().first()
                if not t:
                    t = Team(
                        name=info["name"], 
                        code=code, 
                        purse_balance=1200000000, # 120 Cr
                        logo_url=info["logo"],
                        color=info["color"],
                        primary_color=info["p"],
                        secondary_color=info["s"]
                    )
                    session.add(t)
                else:
                    # Update existing team info
                    t.name = info["name"]
                    t.logo_url = info["logo"]
                    t.color = info["color"]
                    t.primary_color = info["p"]
                    t.secondary_color = info["s"]
                    t.purse_balance = 1200000000 # Reset balance on re-seed
                await session.commit()

            print("Teams ready.")

            # Players from all sheets
            total_count = 0
            for sheet in sheets:
                df = pd.read_excel(excel_path, sheet_name=sheet)
                print(f"Processing sheet {sheet}: {len(df)} rows")
                
                for index, row in df.iterrows():
                    try:
                        name = str(row.get('NAME', 'Unknown')).strip()
                        if name.lower() == 'nan' or not name: continue
                        
                        role = str(row.get('ROLE', 'Unknown')).strip().upper()
                        nationality = str(row.get('COUNTRY', 'India')).strip()
                        age = int(row.get('AGE', 25)) if not pd.isna(row.get('AGE')) else 25
                        
                        # Handle different base price column names
                        base_price_val = row.get('BASE PRICE', row.get('BASE PRICE (LAKHS)', 20))
                        try:
                            val = float(base_price_val)
                            if val <= 500: # Lakhs
                                base_price = val * 100000
                            else:
                                base_price = val
                        except:
                            base_price = 2000000
                            
                        # Image Match
                        norm = normalize_name(name)
                        img = image_map.get(norm)
                        if not img:
                            for k, v in image_map.items():
                                if k in norm or norm in k:
                                    img = v
                                    break
                        if not img:
                            img = "https://www.iplt20.com/assets/images/IPL/placeholder.png"
                            
                        # Stats
                        matches = int(row.get('MATCHES', 0)) if not pd.isna(row.get('MATCHES')) else 0
                        runs = int(row.get('RUNS', 0)) if not pd.isna(row.get('RUNS')) else 0
                        wickets = int(row.get('WICKETS', 0)) if not pd.isna(row.get('WICKETS')) else 0
                        avg = float(row.get('AVERAGE', 0)) if not pd.isna(row.get('AVERAGE')) else 0
                        sr = float(row.get('STRIKE RATE', 0)) if not pd.isna(row.get('STRIKE RATE')) else 0
                        econ = float(row.get('ECONOMY RATE', 0)) if not pd.isna(row.get('ECONOMY RATE')) else 0

                        # Stats proxy for points
                        points = (runs / 10) + (wickets * 20)
                        
                        p = Player(
                            name=name,
                            role=role,
                            nationality=nationality,
                            age=age,
                            matches=matches,
                            runs=runs,
                            wickets=wickets,
                            average=avg,
                            strike_rate=sr,
                            economy=econ,
                            base_price=base_price,
                            points=int(points),
                            image_url=img
                        )
                        session.add(p)
                        total_count += 1
                        
                        if total_count % 50 == 0:
                            await session.commit() # Periodic commit
                    except Exception as row_error:
                        print(f"Row Error in {sheet}: {row_error}")
            
            await session.commit()
            print(f"Successfully seeded {total_count} players from all sheets.")
            
    except Exception as e:
        with open("seed_error.log", "w") as f:
            f.write(traceback.format_exc())
        print(f"Global Error: {e}")

if __name__ == "__main__":
    asyncio.run(seed_data())
