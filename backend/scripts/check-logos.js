const { Team } = require('../models');

(async () => {
  try {
    const teams = await Team.findAll({
      attributes: ['name', 'shortName', 'logo'],
      order: [['name', 'ASC']],
    });

    console.log('\n📋 Current Team Logos:\n');
    teams.forEach(t => {
      console.log(`${t.shortName.padEnd(6)} | ${t.name.padEnd(30)}`);
      console.log(`        ${t.logo || '(No logo)'}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
