# IPL Auction Portal - Player CSV Import Guide

## 📋 CSV Format for Player Data

To add players to the auction portal via CSV, create a CSV file with the following columns in **exact order**:

### Required Columns (Must be present):
1. **name** - Player's full name (string)
2. **role** - Player role: `Batsman`, `Bowler`, `All-rounder`, or `Wicketkeeper` (case-sensitive)
3. **basePrice** - Base auction price in lakhs (number, e.g., 150 for ₹15 crores)
4. **nationality** - Player's country (string)
5. **age** - Player's age in years (integer, 16-50)

### Optional Columns (Can be empty):
6. **battingStyle** - Batting style (e.g., "Right-hand bat", "Left-hand bat")
7. **bowlingStyle** - Bowling style (e.g., "Right-arm fast", "Left-arm orthodox")
8. **image** - Player image URL (leave empty for auto-generated avatar)
9. **matches** - Number of matches played (integer)
10. **runs** - Total runs scored (integer)
11. **wickets** - Total wickets taken (integer)
12. **average** - Batting/bowling average (decimal)
13. **strikeRate** - Strike rate (decimal)

## 📄 Sample CSV Format

```csv
name,role,basePrice,nationality,age,battingStyle,bowlingStyle,image,matches,runs,wickets,average,strikeRate
Virat Kohli,Batsman,150,India,35,Right-hand bat,Right-arm medium,,250,12000,4,52.5,93.2
Rohit Sharma,Batsman,160,India,36,Right-hand bat,Right-arm offbreak,,230,9500,8,48.2,89.5
MS Dhoni,Wicketkeeper,200,India,42,Right-hand bat,Right-arm medium,,250,5000,0,38.5,135.2
Jasprit Bumrah,Bowler,120,India,30,Right-hand bat,Right-arm fast,,120,50,150,24.5,45.2
Ravindra Jadeja,All-rounder,110,India,34,Left-hand bat,Slow left-arm orthodox,,200,2500,120,32.5,125.8
```

## 🚀 How to Import Players

### Step 1: Create Your CSV File
- Save your player data as a CSV file (e.g., `players.csv`)
- Ensure the first row contains the column headers exactly as shown above
- Use comma (`,`) as the delimiter
- Quote values containing commas with double quotes (`"`)

### Step 2: Place the CSV File
- Put your CSV file in the `backend/data/` folder, or
- Place it anywhere and provide the full path when running the script

### Step 3: Run the Import Script
```bash
# Navigate to backend directory
cd backend

# Run the import script with your CSV file path
node scripts/process-players-csv.js data/your-players.csv
```

### Step 4: Verify Import
The script will show:
- ✅ Successfully added players count
- ❌ Any errors with specific row details
- 📈 Total players in database after import

## 📊 Data Validation Rules

### Required Fields:
- **name**: Cannot be empty
- **role**: Must be one of: `Batsman`, `Bowler`, `All-rounder`, `Wicketkeeper`
- **basePrice**: Must be ≥ 0
- **nationality**: Cannot be empty
- **age**: Must be between 16 and 50

### Optional Fields:
- **battingStyle**, **bowlingStyle**: Can be empty strings
- **image**: Can be empty (will use auto-generated avatar)
- **stats**: All default to 0 if not provided

## 🎯 Tips for CSV Creation

### Excel/Google Sheets:
1. Create a spreadsheet with the columns above
2. Fill in your player data
3. Export as CSV (File → Download → Comma-separated values)

### Text Editor:
1. Create a new file with `.csv` extension
2. Add the header row first
3. Add one player per line
4. Save with UTF-8 encoding

### Common Issues to Avoid:
- **Extra spaces**: Trim spaces around values
- **Wrong role names**: Use exact case (`Batsman`, not `batsman`)
- **Invalid ages**: Keep between 16-50
- **Negative prices**: Base price must be ≥ 0
- **Missing commas**: Each field must be separated by exactly one comma

## 📈 Example Commands

```bash
# Import from data folder
node scripts/process-players-csv.js data/players.csv

# Import from different location
node scripts/process-players-csv.js ../data/my-players.csv

# Import with absolute path
node scripts/process-players-csv.js C:/Users/YourName/Documents/players.csv
```

## 🔍 Verification

After import, check the database:
```bash
# Count total players
node -e "const {Player} = require('./models'); (async () => { console.log('Total players:', await Player.count()); process.exit(0); })()"

# List recent players
node -e "const {Player} = require('./models'); (async () => { const players = await Player.findAll({limit: 5, order: [['createdAt', 'DESC']]}); players.forEach(p => console.log(p.name, '-', p.role)); process.exit(0); })()"
```

## 📋 Sample Data Available

A sample CSV file with 40+ international players is available at:
`backend/data/sample-players.csv`

You can use this as a template or import it directly:
```bash
node scripts/process-players-csv.js data/sample-players.csv
```

## 🆘 Troubleshooting

### Common Errors:
- **"Missing required columns"**: Check CSV header matches exactly
- **"Invalid role"**: Use exact role names (case-sensitive)
- **"Invalid age"**: Age must be 16-50
- **"Invalid base price"**: Must be non-negative number

### File Path Issues:
- Use forward slashes (`/`) in paths
- Or use double backslashes (`\\`) on Windows
- Or wrap path in quotes: `"C:\path\to\file.csv"`

### Encoding Issues:
- Save CSV as UTF-8 encoding
- Avoid special characters in player names if possible

---

**Need Help?** Check the console output for detailed error messages with row numbers!