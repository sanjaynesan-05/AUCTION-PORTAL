"""
Seed script for IPL Auction — 193 players across 11 sets.
Deletes all existing players and re-seeds with set-based data.
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import delete
from app.db.session import async_session_maker
from app.models.all_models import Player, AuctionState, Bid

PLACEHOLDER_IMG = "https://www.iplt20.com/assets/images/IPL/placeholder.png"

# ────────────────────────────────────────────────
#  ALL 193 PLAYERS — organized by auction set
# ────────────────────────────────────────────────

PLAYERS = [
    # ── SET 1: MARQUEE PLAYERS ──
    {"name": "Jasprit Bumrah",      "role": "Fast Bowler",    "nationality": "India",       "age": 30, "points": 95, "set_number": 1, "set_name": "Marquee Players"},
    {"name": "Ruturaj Gaikwad",     "role": "Batsman",        "nationality": "India",       "age": 27, "points": 88, "set_number": 1, "set_name": "Marquee Players"},
    {"name": "Travis Head",         "role": "Batsman",        "nationality": "Australia",   "age": 30, "points": 87, "set_number": 1, "set_name": "Marquee Players"},
    {"name": "KL Rahul",            "role": "Wicketkeeper",   "nationality": "India",       "age": 32, "points": 86, "set_number": 1, "set_name": "Marquee Players"},
    {"name": "Ravindra Jadeja",     "role": "All-Rounder",    "nationality": "India",       "age": 35, "points": 90, "set_number": 1, "set_name": "Marquee Players"},
    {"name": "Shreyas Iyer",        "role": "Batsman",        "nationality": "India",       "age": 29, "points": 85, "set_number": 1, "set_name": "Marquee Players"},
    {"name": "Jos Buttler",         "role": "Wicketkeeper",   "nationality": "England",     "age": 33, "points": 89, "set_number": 1, "set_name": "Marquee Players"},
    {"name": "Shubman Gill",        "role": "Batsman",        "nationality": "India",       "age": 24, "points": 88, "set_number": 1, "set_name": "Marquee Players"},
    {"name": "Sanju Samson",        "role": "Wicketkeeper",   "nationality": "India",       "age": 29, "points": 84, "set_number": 1, "set_name": "Marquee Players"},
    {"name": "Mitchell Starc",      "role": "Fast Bowler",    "nationality": "Australia",   "age": 34, "points": 91, "set_number": 1, "set_name": "Marquee Players"},
    {"name": "Suryakumar Yadav",    "role": "Batsman",        "nationality": "India",       "age": 33, "points": 90, "set_number": 1, "set_name": "Marquee Players"},
    {"name": "Rishabh Pant",        "role": "Wicketkeeper",   "nationality": "India",       "age": 27, "points": 92, "set_number": 1, "set_name": "Marquee Players"},
    {"name": "Kagiso Rabada",       "role": "Fast Bowler",    "nationality": "South Africa","age": 29, "points": 89, "set_number": 1, "set_name": "Marquee Players"},
    {"name": "Shivam Dube",         "role": "All-Rounder",    "nationality": "India",       "age": 30, "points": 80, "set_number": 1, "set_name": "Marquee Players"},
    {"name": "Hardik Pandya",       "role": "All-Rounder",    "nationality": "India",       "age": 30, "points": 88, "set_number": 1, "set_name": "Marquee Players"},
    {"name": "Pat Cummins",         "role": "Fast Bowler",    "nationality": "Australia",   "age": 31, "points": 90, "set_number": 1, "set_name": "Marquee Players"},

    # ── SET 2: CAPPED BATTERS ──
    {"name": "David Miller",        "role": "Batsman",        "nationality": "South Africa","age": 35, "points": 78, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Devon Conway",        "role": "Batsman",        "nationality": "New Zealand", "age": 33, "points": 76, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Aiden Markram",       "role": "Batsman",        "nationality": "South Africa","age": 30, "points": 75, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Rahul Tripathi",      "role": "Batsman",        "nationality": "India",       "age": 33, "points": 70, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Harry Brook",         "role": "Batsman",        "nationality": "England",     "age": 25, "points": 80, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Faf du Plessis",      "role": "Batsman",        "nationality": "South Africa","age": 40, "points": 77, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Dewald Brevis",       "role": "Batsman",        "nationality": "South Africa","age": 21, "points": 72, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Tilak Varma",         "role": "Batsman",        "nationality": "India",       "age": 21, "points": 78, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Mayank Agarwal",      "role": "Batsman",        "nationality": "India",       "age": 33, "points": 68, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Prithvi Shaw",        "role": "Batsman",        "nationality": "India",       "age": 24, "points": 65, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Dawid Malan",         "role": "Batsman",        "nationality": "England",     "age": 37, "points": 70, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Shimron Hetmyer",     "role": "Batsman",        "nationality": "West Indies", "age": 27, "points": 73, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Manish Pandey",       "role": "Batsman",        "nationality": "India",       "age": 34, "points": 62, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Yashasvi Jaiswal",    "role": "Batsman",        "nationality": "India",       "age": 22, "points": 85, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Devdutt Padikkal",    "role": "Batsman",        "nationality": "India",       "age": 24, "points": 68, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Rinku Singh",         "role": "Batsman",        "nationality": "India",       "age": 27, "points": 78, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Rajat Patidar",       "role": "Batsman",        "nationality": "India",       "age": 31, "points": 72, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Sai Sudharsan",       "role": "Batsman",        "nationality": "India",       "age": 23, "points": 74, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Mitchell Marsh",      "role": "Batsman",        "nationality": "Australia",   "age": 32, "points": 76, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Abhishek Sharma",     "role": "Batsman",        "nationality": "India",       "age": 24, "points": 74, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Tristan Stubbs",      "role": "Batsman",        "nationality": "South Africa","age": 24, "points": 70, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Tim David",           "role": "Batsman",        "nationality": "Australia",   "age": 28, "points": 73, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Riyan Parag",         "role": "Batsman",        "nationality": "India",       "age": 22, "points": 72, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Sherfane Rutherford", "role": "Batsman",        "nationality": "West Indies", "age": 26, "points": 65, "set_number": 2, "set_name": "Capped Batters"},
    {"name": "Jacob Bethell",       "role": "Batsman",        "nationality": "England",     "age": 21, "points": 70, "set_number": 2, "set_name": "Capped Batters"},

    # ── SET 3: CAPPED WICKETKEEPERS ──
    {"name": "Ishan Kishan",        "role": "Wicketkeeper",   "nationality": "India",       "age": 26, "points": 78, "set_number": 3, "set_name": "Capped Wicketkeepers"},
    {"name": "Heinrich Klaasen",    "role": "Wicketkeeper",   "nationality": "South Africa","age": 33, "points": 85, "set_number": 3, "set_name": "Capped Wicketkeepers"},
    {"name": "Nicholas Pooran",     "role": "Wicketkeeper",   "nationality": "West Indies", "age": 28, "points": 80, "set_number": 3, "set_name": "Capped Wicketkeepers"},
    {"name": "Jitesh Sharma",       "role": "Wicketkeeper",   "nationality": "India",       "age": 30, "points": 65, "set_number": 3, "set_name": "Capped Wicketkeepers"},
    {"name": "Finn Allen",          "role": "Wicketkeeper",   "nationality": "New Zealand", "age": 25, "points": 72, "set_number": 3, "set_name": "Capped Wicketkeepers"},
    {"name": "Dhruv Jurel",         "role": "Wicketkeeper",   "nationality": "India",       "age": 24, "points": 70, "set_number": 3, "set_name": "Capped Wicketkeepers"},
    {"name": "Quinton de Kock",     "role": "Wicketkeeper",   "nationality": "South Africa","age": 31, "points": 82, "set_number": 3, "set_name": "Capped Wicketkeepers"},
    {"name": "Ryan Rickelton",      "role": "Wicketkeeper",   "nationality": "South Africa","age": 28, "points": 68, "set_number": 3, "set_name": "Capped Wicketkeepers"},
    {"name": "Josh Inglis",         "role": "Wicketkeeper",   "nationality": "Australia",   "age": 29, "points": 70, "set_number": 3, "set_name": "Capped Wicketkeepers"},

    # ── SET 4: CAPPED ALL-ROUNDERS ──
    {"name": "Marco Jansen",        "role": "All-Rounder",    "nationality": "South Africa","age": 24, "points": 80, "set_number": 4, "set_name": "Capped All-Rounders"},
    {"name": "Vijay Shankar",       "role": "All-Rounder",    "nationality": "India",       "age": 33, "points": 62, "set_number": 4, "set_name": "Capped All-Rounders"},
    {"name": "Axar Patel",          "role": "All-Rounder",    "nationality": "India",       "age": 30, "points": 78, "set_number": 4, "set_name": "Capped All-Rounders"},
    {"name": "Washington Sundar",   "role": "All-Rounder",    "nationality": "India",       "age": 25, "points": 75, "set_number": 4, "set_name": "Capped All-Rounders"},
    {"name": "Krunal Pandya",       "role": "All-Rounder",    "nationality": "India",       "age": 33, "points": 68, "set_number": 4, "set_name": "Capped All-Rounders"},
    {"name": "Nitish Kumar Reddy",  "role": "All-Rounder",    "nationality": "India",       "age": 21, "points": 72, "set_number": 4, "set_name": "Capped All-Rounders"},
    {"name": "Sam Curran",          "role": "All-Rounder",    "nationality": "England",     "age": 26, "points": 82, "set_number": 4, "set_name": "Capped All-Rounders"},
    {"name": "Sunil Narine",        "role": "All-Rounder",    "nationality": "West Indies", "age": 36, "points": 85, "set_number": 4, "set_name": "Capped All-Rounders"},
    {"name": "Romario Shepherd",    "role": "All-Rounder",    "nationality": "West Indies", "age": 30, "points": 65, "set_number": 4, "set_name": "Capped All-Rounders"},
    {"name": "Glenn Maxwell",       "role": "All-Rounder",    "nationality": "Australia",   "age": 36, "points": 82, "set_number": 4, "set_name": "Capped All-Rounders"},
    {"name": "Mitchell Santner",    "role": "All-Rounder",    "nationality": "New Zealand", "age": 32, "points": 70, "set_number": 4, "set_name": "Capped All-Rounders"},
    {"name": "Liam Livingstone",    "role": "All-Rounder",    "nationality": "England",     "age": 31, "points": 78, "set_number": 4, "set_name": "Capped All-Rounders"},
    {"name": "Will Jacks",          "role": "All-Rounder",    "nationality": "England",     "age": 26, "points": 75, "set_number": 4, "set_name": "Capped All-Rounders"},
    {"name": "Marcus Stoinis",      "role": "All-Rounder",    "nationality": "Australia",   "age": 35, "points": 74, "set_number": 4, "set_name": "Capped All-Rounders"},
    {"name": "Venkatesh Iyer",      "role": "All-Rounder",    "nationality": "India",       "age": 29, "points": 70, "set_number": 4, "set_name": "Capped All-Rounders"},
    {"name": "Shardul Thakur",      "role": "All-Rounder",    "nationality": "India",       "age": 33, "points": 72, "set_number": 4, "set_name": "Capped All-Rounders"},
    {"name": "Deepak Chahar",       "role": "All-Rounder",    "nationality": "India",       "age": 32, "points": 70, "set_number": 4, "set_name": "Capped All-Rounders"},
    {"name": "Harshit Rana",        "role": "All-Rounder",    "nationality": "India",       "age": 22, "points": 68, "set_number": 4, "set_name": "Capped All-Rounders"},
    {"name": "Cameron Green",       "role": "All-Rounder",    "nationality": "Australia",   "age": 25, "points": 78, "set_number": 4, "set_name": "Capped All-Rounders"},

    # ── SET 5: CAPPED FAST BOWLERS ──
    {"name": "Lockie Ferguson",     "role": "Fast Bowler",    "nationality": "New Zealand", "age": 33, "points": 80, "set_number": 5, "set_name": "Capped Fast Bowlers"},
    {"name": "Mohammed Siraj",      "role": "Fast Bowler",    "nationality": "India",       "age": 30, "points": 78, "set_number": 5, "set_name": "Capped Fast Bowlers"},
    {"name": "Nathan Ellis",        "role": "Fast Bowler",    "nationality": "Australia",   "age": 30, "points": 70, "set_number": 5, "set_name": "Capped Fast Bowlers"},
    {"name": "Umran Malik",         "role": "Fast Bowler",    "nationality": "India",       "age": 25, "points": 68, "set_number": 5, "set_name": "Capped Fast Bowlers"},
    {"name": "Jofra Archer",        "role": "Fast Bowler",    "nationality": "England",     "age": 29, "points": 82, "set_number": 5, "set_name": "Capped Fast Bowlers"},
    {"name": "Avesh Khan",          "role": "Fast Bowler",    "nationality": "India",       "age": 28, "points": 68, "set_number": 5, "set_name": "Capped Fast Bowlers"},
    {"name": "Josh Hazlewood",      "role": "Fast Bowler",    "nationality": "Australia",   "age": 33, "points": 80, "set_number": 5, "set_name": "Capped Fast Bowlers"},
    {"name": "Mohammed Shami",      "role": "Fast Bowler",    "nationality": "India",       "age": 34, "points": 82, "set_number": 5, "set_name": "Capped Fast Bowlers"},
    {"name": "Alzarri Joseph",      "role": "Fast Bowler",    "nationality": "West Indies", "age": 27, "points": 72, "set_number": 5, "set_name": "Capped Fast Bowlers"},
    {"name": "Trent Boult",         "role": "Fast Bowler",    "nationality": "New Zealand", "age": 35, "points": 80, "set_number": 5, "set_name": "Capped Fast Bowlers"},
    {"name": "Arshdeep Singh",      "role": "Fast Bowler",    "nationality": "India",       "age": 25, "points": 78, "set_number": 5, "set_name": "Capped Fast Bowlers"},
    {"name": "Matheesha Pathirana", "role": "Fast Bowler",    "nationality": "Sri Lanka",   "age": 21, "points": 78, "set_number": 5, "set_name": "Capped Fast Bowlers"},
    {"name": "Bhuvneshwar Kumar",   "role": "Fast Bowler",    "nationality": "India",       "age": 34, "points": 72, "set_number": 5, "set_name": "Capped Fast Bowlers"},
    {"name": "Prasidh Krishna",     "role": "Fast Bowler",    "nationality": "India",       "age": 28, "points": 72, "set_number": 5, "set_name": "Capped Fast Bowlers"},
    {"name": "Anrich Nortje",       "role": "Fast Bowler",    "nationality": "South Africa","age": 30, "points": 78, "set_number": 5, "set_name": "Capped Fast Bowlers"},
    {"name": "Khaleel Ahmed",       "role": "Fast Bowler",    "nationality": "India",       "age": 26, "points": 65, "set_number": 5, "set_name": "Capped Fast Bowlers"},
    {"name": "Matt Henry",          "role": "Fast Bowler",    "nationality": "New Zealand", "age": 32, "points": 70, "set_number": 5, "set_name": "Capped Fast Bowlers"},
    {"name": "Natarajan",           "role": "Fast Bowler",    "nationality": "India",       "age": 33, "points": 65, "set_number": 5, "set_name": "Capped Fast Bowlers"},
    {"name": "Sandeep Sharma",      "role": "Fast Bowler",    "nationality": "India",       "age": 31, "points": 60, "set_number": 5, "set_name": "Capped Fast Bowlers"},
    {"name": "Mukesh Kumar",        "role": "Fast Bowler",    "nationality": "India",       "age": 30, "points": 65, "set_number": 5, "set_name": "Capped Fast Bowlers"},
    {"name": "Mark Wood",           "role": "Fast Bowler",    "nationality": "England",     "age": 34, "points": 78, "set_number": 5, "set_name": "Capped Fast Bowlers"},
    {"name": "Akash Deep",          "role": "Fast Bowler",    "nationality": "India",       "age": 27, "points": 65, "set_number": 5, "set_name": "Capped Fast Bowlers"},

    # ── SET 6: CAPPED SPIN BOWLERS ──
    {"name": "Wanindu Hasaranga",   "role": "Spin Bowler",    "nationality": "Sri Lanka",   "age": 27, "points": 82, "set_number": 6, "set_name": "Capped Spin Bowlers"},
    {"name": "Rashid Khan",         "role": "Spin Bowler",    "nationality": "Afghanistan", "age": 26, "points": 90, "set_number": 6, "set_name": "Capped Spin Bowlers"},
    {"name": "Kuldeep Yadav",       "role": "Spin Bowler",    "nationality": "India",       "age": 29, "points": 82, "set_number": 6, "set_name": "Capped Spin Bowlers"},
    {"name": "Rahul Tewatia",       "role": "Spin Bowler",    "nationality": "India",       "age": 31, "points": 68, "set_number": 6, "set_name": "Capped Spin Bowlers"},
    {"name": "Ravi Bishnoi",        "role": "Spin Bowler",    "nationality": "India",       "age": 24, "points": 75, "set_number": 6, "set_name": "Capped Spin Bowlers"},
    {"name": "Keshav Maharaj",      "role": "Spin Bowler",    "nationality": "South Africa","age": 34, "points": 72, "set_number": 6, "set_name": "Capped Spin Bowlers"},
    {"name": "Noor Ahmad",          "role": "Spin Bowler",    "nationality": "Afghanistan", "age": 19, "points": 70, "set_number": 6, "set_name": "Capped Spin Bowlers"},
    {"name": "Rahul Chahar",        "role": "Spin Bowler",    "nationality": "India",       "age": 25, "points": 68, "set_number": 6, "set_name": "Capped Spin Bowlers"},
    {"name": "Varun Chakravarthy",  "role": "Spin Bowler",    "nationality": "India",       "age": 33, "points": 75, "set_number": 6, "set_name": "Capped Spin Bowlers"},
    {"name": "Yuzvendra Chahal",    "role": "Spin Bowler",    "nationality": "India",       "age": 34, "points": 78, "set_number": 6, "set_name": "Capped Spin Bowlers"},
    {"name": "Maheesh Theekshana",  "role": "Spin Bowler",    "nationality": "Sri Lanka",   "age": 24, "points": 72, "set_number": 6, "set_name": "Capped Spin Bowlers"},
    {"name": "Sikandar Raza",       "role": "Spin Bowler",    "nationality": "Zimbabwe",    "age": 38, "points": 65, "set_number": 6, "set_name": "Capped Spin Bowlers"},

    # ── SET 7: UNCAPPED BATTERS ──
    {"name": "Abhinav Manohar",     "role": "Batsman",        "nationality": "India",       "age": 30, "points": 55, "set_number": 7, "set_name": "Uncapped Batters"},
    {"name": "Priyansh Arya",       "role": "Batsman",        "nationality": "India",       "age": 24, "points": 50, "set_number": 7, "set_name": "Uncapped Batters"},
    {"name": "Ayush Badoni",        "role": "Batsman",        "nationality": "India",       "age": 24, "points": 58, "set_number": 7, "set_name": "Uncapped Batters"},
    {"name": "Vaibhav Suryavanshi", "role": "Batsman",        "nationality": "India",       "age": 14, "points": 55, "set_number": 7, "set_name": "Uncapped Batters"},
    {"name": "Naman Dhir",          "role": "Batsman",        "nationality": "India",       "age": 22, "points": 48, "set_number": 7, "set_name": "Uncapped Batters"},
    {"name": "Robin Minz",          "role": "Batsman",        "nationality": "India",       "age": 23, "points": 45, "set_number": 7, "set_name": "Uncapped Batters"},
    {"name": "Prabhsimran Singh",   "role": "Batsman",        "nationality": "India",       "age": 23, "points": 50, "set_number": 7, "set_name": "Uncapped Batters"},
    {"name": "Nehal Wadhera",       "role": "Batsman",        "nationality": "India",       "age": 24, "points": 52, "set_number": 7, "set_name": "Uncapped Batters"},
    {"name": "Sameer Rizvi",        "role": "Batsman",        "nationality": "India",       "age": 21, "points": 48, "set_number": 7, "set_name": "Uncapped Batters"},
    {"name": "Riyan Raghuvanshi",   "role": "Batsman",        "nationality": "India",       "age": 18, "points": 45, "set_number": 7, "set_name": "Uncapped Batters"},
    {"name": "Ashutosh Sharma",     "role": "Batsman",        "nationality": "India",       "age": 21, "points": 48, "set_number": 7, "set_name": "Uncapped Batters"},
    {"name": "Shashank Singh",      "role": "Batsman",        "nationality": "India",       "age": 32, "points": 50, "set_number": 7, "set_name": "Uncapped Batters"},
    {"name": "Aniket Verma",        "role": "Batsman",        "nationality": "India",       "age": 22, "points": 42, "set_number": 7, "set_name": "Uncapped Batters"},
    {"name": "Kartik Sharma",       "role": "Batsman",        "nationality": "India",       "age": 23, "points": 40, "set_number": 7, "set_name": "Uncapped Batters"},
    {"name": "Angkrish Raghuvanshi","role": "Batsman",        "nationality": "India",       "age": 17, "points": 42, "set_number": 7, "set_name": "Uncapped Batters"},

    # ── SET 8: UNCAPPED WICKETKEEPERS ──
    {"name": "Upendra Yadav",       "role": "Wicketkeeper",   "nationality": "India",       "age": 27, "points": 45, "set_number": 8, "set_name": "Uncapped Wicketkeepers"},
    {"name": "Urvil Patel",         "role": "Wicketkeeper",   "nationality": "India",       "age": 27, "points": 42, "set_number": 8, "set_name": "Uncapped Wicketkeepers"},
    {"name": "Kona Srikar Bharat",  "role": "Wicketkeeper",   "nationality": "India",       "age": 31, "points": 50, "set_number": 8, "set_name": "Uncapped Wicketkeepers"},
    {"name": "Vishnu Vinod",        "role": "Wicketkeeper",   "nationality": "India",       "age": 31, "points": 42, "set_number": 8, "set_name": "Uncapped Wicketkeepers"},
    {"name": "Abishek Porel",       "role": "Wicketkeeper",   "nationality": "India",       "age": 22, "points": 48, "set_number": 8, "set_name": "Uncapped Wicketkeepers"},
    {"name": "Anuj Rawat",          "role": "Wicketkeeper",   "nationality": "India",       "age": 24, "points": 45, "set_number": 8, "set_name": "Uncapped Wicketkeepers"},
    {"name": "Tejasvi Singh",       "role": "Wicketkeeper",   "nationality": "India",       "age": 22, "points": 40, "set_number": 8, "set_name": "Uncapped Wicketkeepers"},

    # ── SET 9: UNCAPPED ALL-ROUNDERS ──
    {"name": "Musheer Khan",        "role": "All-Rounder",    "nationality": "India",       "age": 20, "points": 55, "set_number": 9, "set_name": "Uncapped All-Rounders"},
    {"name": "Abdul Samad",         "role": "All-Rounder",    "nationality": "India",       "age": 23, "points": 52, "set_number": 9, "set_name": "Uncapped All-Rounders"},
    {"name": "Shahbaz Ahmed",       "role": "All-Rounder",    "nationality": "India",       "age": 30, "points": 55, "set_number": 9, "set_name": "Uncapped All-Rounders"},
    {"name": "Ramandeep Singh",     "role": "All-Rounder",    "nationality": "India",       "age": 27, "points": 48, "set_number": 9, "set_name": "Uncapped All-Rounders"},
    {"name": "Jayant Yadav",        "role": "All-Rounder",    "nationality": "India",       "age": 34, "points": 50, "set_number": 9, "set_name": "Uncapped All-Rounders"},
    {"name": "Prashant Veer",       "role": "All-Rounder",    "nationality": "India",       "age": 25, "points": 42, "set_number": 9, "set_name": "Uncapped All-Rounders"},
    {"name": "Shahrukh Khan",       "role": "All-Rounder",    "nationality": "India",       "age": 29, "points": 55, "set_number": 9, "set_name": "Uncapped All-Rounders"},
    {"name": "Anshul Kamboj",       "role": "All-Rounder",    "nationality": "India",       "age": 24, "points": 48, "set_number": 9, "set_name": "Uncapped All-Rounders"},
    {"name": "Harpreet Brar",       "role": "All-Rounder",    "nationality": "India",       "age": 28, "points": 52, "set_number": 9, "set_name": "Uncapped All-Rounders"},
    {"name": "Swapnil Singh",       "role": "All-Rounder",    "nationality": "India",       "age": 33, "points": 45, "set_number": 9, "set_name": "Uncapped All-Rounders"},

    # ── SET 10: UNCAPPED FAST BOWLERS ──
    {"name": "Arjun Tendulkar",     "role": "Fast Bowler",    "nationality": "India",       "age": 24, "points": 42, "set_number": 10, "set_name": "Uncapped Fast Bowlers"},
    {"name": "Yash Dayal",          "role": "Fast Bowler",    "nationality": "India",       "age": 26, "points": 55, "set_number": 10, "set_name": "Uncapped Fast Bowlers"},
    {"name": "Mohsin Khan",         "role": "Fast Bowler",    "nationality": "India",       "age": 25, "points": 52, "set_number": 10, "set_name": "Uncapped Fast Bowlers"},
    {"name": "Vaibhav Arora",       "role": "Fast Bowler",    "nationality": "India",       "age": 26, "points": 50, "set_number": 10, "set_name": "Uncapped Fast Bowlers"},
    {"name": "Ishant Sharma",       "role": "Fast Bowler",    "nationality": "India",       "age": 35, "points": 60, "set_number": 10, "set_name": "Uncapped Fast Bowlers"},
    {"name": "Mayank Yadav",        "role": "Fast Bowler",    "nationality": "India",       "age": 22, "points": 58, "set_number": 10, "set_name": "Uncapped Fast Bowlers"},
    {"name": "Kuldeep Sen",         "role": "Fast Bowler",    "nationality": "India",       "age": 26, "points": 50, "set_number": 10, "set_name": "Uncapped Fast Bowlers"},
    {"name": "Mukesh Choudhary",    "role": "Fast Bowler",    "nationality": "India",       "age": 27, "points": 48, "set_number": 10, "set_name": "Uncapped Fast Bowlers"},
    {"name": "Kartik Tyagi",        "role": "Fast Bowler",    "nationality": "India",       "age": 24, "points": 48, "set_number": 10, "set_name": "Uncapped Fast Bowlers"},
    {"name": "Akash Singh",         "role": "Fast Bowler",    "nationality": "India",       "age": 22, "points": 42, "set_number": 10, "set_name": "Uncapped Fast Bowlers"},
    {"name": "Ashwani Kumar",       "role": "Fast Bowler",    "nationality": "India",       "age": 24, "points": 45, "set_number": 10, "set_name": "Uncapped Fast Bowlers"},

    # ── SET 11: UNCAPPED SPIN BOWLERS ──
    {"name": "R Sai Kishore",       "role": "Spin Bowler",    "nationality": "India",       "age": 27, "points": 55, "set_number": 11, "set_name": "Uncapped Spin Bowlers"},
    {"name": "Suyash Sharma",       "role": "Spin Bowler",    "nationality": "India",       "age": 21, "points": 48, "set_number": 11, "set_name": "Uncapped Spin Bowlers"},
    {"name": "Mayank Markande",     "role": "Spin Bowler",    "nationality": "India",       "age": 27, "points": 50, "set_number": 11, "set_name": "Uncapped Spin Bowlers"},
    {"name": "Kumar Kartikeya",     "role": "Spin Bowler",    "nationality": "India",       "age": 27, "points": 52, "set_number": 11, "set_name": "Uncapped Spin Bowlers"},
    {"name": "Digvesh Rathi",       "role": "Spin Bowler",    "nationality": "India",       "age": 25, "points": 42, "set_number": 11, "set_name": "Uncapped Spin Bowlers"},
    {"name": "Vignesh Puthur",      "role": "Spin Bowler",    "nationality": "India",       "age": 24, "points": 40, "set_number": 11, "set_name": "Uncapped Spin Bowlers"},
]


async def seed_data():
    async with async_session_maker() as session:
        async with session.begin():
            # 1. Reset auction state to remove foreign key references
            from sqlalchemy import update, select
            result = await session.execute(select(AuctionState).where(AuctionState.id == 1))
            state = result.scalar_one_or_none()
            if state:
                await session.execute(
                    update(AuctionState).where(AuctionState.id == 1).values(
                        status="WAITING",
                        current_bid=0,
                        current_bidder_id=None,
                        current_player_id=None,
                        remaining_players_count=len(PLAYERS),
                        version=0
                    )
                )

            # 2. Clear all existing players and bids
            await session.execute(delete(Bid))
            await session.execute(delete(Player))

            # 2. Insert all players
            for p in PLAYERS:
                player = Player(
                    name=p["name"],
                    role=p["role"],
                    nationality=p["nationality"],
                    age=p["age"],
                    points=p["points"],
                    set_number=p["set_number"],
                    set_name=p["set_name"],
                    base_price=(p.get("base_price_lakhs", 200 if p["set_number"] == 1 else 50 if p["set_number"] <= 6 else 20)) * 100000,
                    image=PLACEHOLDER_IMG,
                )
                session.add(player)

            # 3. Create auction state if not exists
            if not state:
                session.add(AuctionState(
                    id=1,
                    status="WAITING",
                    remaining_players_count=len(PLAYERS)
                ))

        print(f"Seeded {len(PLAYERS)} players across 11 sets")
        print("   Set breakdown:")
        from collections import Counter
        counts = Counter(p["set_name"] for p in PLAYERS)
        for name, count in counts.items():
            print(f"   - {name}: {count} players")


if __name__ == "__main__":
    asyncio.run(seed_data())
