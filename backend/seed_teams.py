import asyncio
import json
from app.models.all_models import Team
from app.db.session import async_session_maker

async def seed_teams():
    json_path = "ipl_auction_dataset.json"
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    async with async_session_maker() as session:
        async with session.begin():
            for team_data in data['teams']:
                team = Team(
                    name=team_data['name'],
                    code=team_data['code'],
                    logo_url=team_data.get('logo_url'),
                    color=team_data.get('color'),
                    primary_color=team_data.get('primary_color'),
                    secondary_color=team_data.get('secondary_color'),
                    purse_balance=team_data.get('purse_balance', 1200000000) # 120 Cr
                )
                session.add(team)
        print(f"Seeded {len(data['teams'])} teams.")

if __name__ == "__main__":
    asyncio.run(seed_teams())
