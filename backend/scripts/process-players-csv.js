const fs = require('fs');
const path = require('path');
const { Player } = require('../models');
require('dotenv').config();

/**
 * Process CSV file and add players to database
 * CSV Format: name,role,basePrice,nationality,age,battingStyle,bowlingStyle,image,matches,runs,wickets,average,strikeRate
 */
const processPlayersCSV = async (csvFilePath) => {
  try {
    console.log('🔄 Processing players CSV file...\n');

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
    const requiredColumns = ['name', 'role', 'baseprice', 'nationality', 'age'];
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

        // Create player object
        const playerData = {
          name: values[header.indexOf('name')],
          role: values[header.indexOf('role')],
          basePrice: parseFloat(values[header.indexOf('baseprice')] || '0'),
          nationality: values[header.indexOf('nationality')],
          age: parseInt(values[header.indexOf('age')] || '0'),
          battingStyle: values[header.indexOf('battingstyle')] || '',
          bowlingStyle: values[header.indexOf('bowlingstyle')] || '',
          image: values[header.indexOf('image')] || '',
          stats: {
            matches: parseInt(values[header.indexOf('matches')] || '0'),
            runs: parseInt(values[header.indexOf('runs')] || '0'),
            wickets: parseInt(values[header.indexOf('wickets')] || '0'),
            average: parseFloat(values[header.indexOf('average')] || '0'),
            strikeRate: parseFloat(values[header.indexOf('strikerate')] || '0'),
          }
        };

        // Validate required fields
        if (!playerData.name || !playerData.role || !playerData.nationality) {
          throw new Error(`Missing required data: name, role, or nationality`);
        }

        // Validate role
        const validRoles = ['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper'];
        if (!validRoles.includes(playerData.role)) {
          throw new Error(`Invalid role: ${playerData.role}. Must be one of: ${validRoles.join(', ')}`);
        }

        // Validate age
        if (playerData.age < 16 || playerData.age > 50) {
          throw new Error(`Invalid age: ${playerData.age}. Must be between 16 and 50`);
        }

        // Validate base price
        if (playerData.basePrice < 0) {
          throw new Error(`Invalid base price: ${playerData.basePrice}. Must be non-negative`);
        }

        // Create player in database
        await Player.create(playerData);
        successCount++;
        console.log(`✅ Added: ${playerData.name} (${playerData.role})`);

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
  console.log('Usage: node scripts/process-players-csv.js <path-to-csv-file>');
  console.log('Example: node scripts/process-players-csv.js ../data/players.csv');
  process.exit(1);
}

// Resolve path relative to script location
const resolvedPath = path.resolve(__dirname, '..', csvFilePath);
processPlayersCSV(resolvedPath);
