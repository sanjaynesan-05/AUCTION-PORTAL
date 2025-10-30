const fs = require('fs');
const path = require('path');
const { Player } = require('../models');
require('dotenv').config();

/**
 * Process IPL 2025 CSV file and add players to database
 * CSV Format: No,Name,Country,Age,Role,T20_Caps,IPL_Matches,2024_Team,Status,Reserve_Price_Lakh,battingStyle,bowlingStyle,image,matches,runs,wickets,average,strikeRate
 */
const processIPL2025CSV = async (csvFilePath) => {
  try {
    console.log('🔄 Processing IPL 2025 players CSV file...\n');

    // Test database connection
    const { sequelize } = require('../database');
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    // Read CSV file
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`CSV file not found: ${csvFilePath}`);
    }

    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header row and one data row');
    }

    // Parse header
    const header = lines[0].split(',').map(col => col.trim().toLowerCase());
    console.log('📋 CSV Headers:', header.join(', '));

    // Validate required columns
    const requiredColumns = ['name', 'country', 'age', 'role', 'reserve_price_lakh'];
    const missingColumns = requiredColumns.filter(col => !header.includes(col));

    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    // Process data rows
    const players = [];
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      try {
        const values = line.split(',').map(val => val.trim());

        // Skip if first column is empty (No column)
        if (!values[0] || values[0] === '') continue;

        // Map role to database format
        const csvRole = values[header.indexOf('role')];
        let dbRole;
        switch (csvRole) {
          case 'WK/BAT':
            dbRole = 'Wicketkeeper';
            break;
          case 'BAT':
            dbRole = 'Batsman';
            break;
          case 'SEAM':
          case 'SPIN':
            dbRole = 'Bowler';
            break;
          case 'BAT/SPIN':
          case 'BAT/SEAM':
          case 'SPIN/BAT':
          case 'SEAM/BAT':
            dbRole = 'All-rounder';
            break;
          default:
            dbRole = 'Batsman'; // Default fallback
        }

        // Create player object
        const playerData = {
          name: values[header.indexOf('name')],
          role: dbRole,
          basePrice: parseFloat(values[header.indexOf('reserve_price_lakh')] || '0') * 100000, // Convert lakh to rupees
          nationality: values[header.indexOf('country')],
          age: parseInt(values[header.indexOf('age')] || '0'),
          battingStyle: values[header.indexOf('battingstyle')] || '',
          bowlingStyle: values[header.indexOf('bowlingstyle')] || '',
          image: values[header.indexOf('image')] || '',
          matches: parseInt(values[header.indexOf('matches')] || '0'),
          runs: parseInt(values[header.indexOf('runs')] || '0'),
          wickets: parseInt(values[header.indexOf('wickets')] || '0'),
          average: parseFloat(values[header.indexOf('average')] || '0'),
          strikeRate: parseFloat(values[header.indexOf('strikerate')] || '0')
        };

        // Validate required fields
        if (!playerData.name || !playerData.nationality) {
          throw new Error(`Missing required data: name or nationality`);
        }

        // Validate role
        const validRoles = ['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper'];
        if (!validRoles.includes(playerData.role)) {
          throw new Error(`Invalid role: ${playerData.role}. Must be one of: ${validRoles.join(', ')}`);
        }

        // Validate age
        if (playerData.age < 12 || playerData.age > 50) {
          throw new Error(`Invalid age: ${playerData.age}. Must be between 12 and 50`);
        }

        // Validate base price
        if (playerData.basePrice < 0) {
          throw new Error(`Invalid base price: ${playerData.basePrice}. Must be non-negative`);
        }

        // Create player in database
        await Player.create(playerData);
        successCount++;
        console.log(`✅ Added: ${playerData.name} (${playerData.role}) - ₹${playerData.basePrice}L`);

      } catch (error) {
        errorCount++;
        const errorMsg = `Row ${i + 1}: ${error.message}`;
        errors.push(errorMsg);
        console.log(`❌ ${errorMsg}`);
      }
    }

    // Summary
    console.log('\n📊 Processing Summary:');
    console.log(`✅ Successfully added: ${successCount} players`);
    console.log(`❌ Errors: ${errorCount} players`);

    if (errors.length > 0) {
      console.log('\n🚨 Error Details:');
      errors.forEach(error => console.log(`   - ${error}`));
    }

    // Final count
    const totalPlayers = await Player.count();
    console.log(`\n📈 Total players in database: ${totalPlayers}`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Failed to process CSV:', error.message);
    process.exit(1);
  }
};

// Check if CSV file path is provided
const csvFilePath = process.argv[2];
if (!csvFilePath) {
  console.log('Usage: node scripts/process-ipl2025-csv.js <path-to-csv-file>');
  console.log('Example: node scripts/process-ipl2025-csv.js data/ipl2025-players.csv');
  process.exit(1);
}

// Resolve path relative to script location
const resolvedPath = path.resolve(__dirname, '..', csvFilePath);
processIPL2025CSV(resolvedPath);
