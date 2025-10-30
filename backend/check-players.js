const { Player } = require('./models');

async function checkPlayers() {
  try {
    const players = await Player.findAll({
      limit: 10,
      attributes: ['name', 'role', 'basePrice', 'nationality', 'age']
    });

    console.log('Sample imported players:');
    console.log('=' .repeat(60));
    players.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} (${p.role}) - ₹${(p.basePrice / 100000).toFixed(1)}L - ${p.nationality} - Age: ${p.age}`);
    });

    const total = await Player.count();
    console.log(`\n📊 Total players in database: ${total}`);

    // Check role distribution
    const roles = await Player.findAll({
      attributes: [
        'role',
        [Player.sequelize.fn('COUNT', Player.sequelize.col('role')), 'count']
      ],
      group: ['role']
    });

    console.log('\n📋 Role Distribution:');
    roles.forEach(r => {
      console.log(`   ${r.role}: ${r.dataValues.count}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkPlayers();