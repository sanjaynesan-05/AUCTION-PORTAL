const { User } = require('./backend/models');

const checkUsers = async () => {
  try {
    console.log('🔍 Checking users in database...\n');

    const users = await User.findAll({
      attributes: ['id', 'username', 'role']
    });

    console.log('📋 Found users:');
    users.forEach(user => {
      console.log(`   - ${user.username} (${user.role})`);
    });

    console.log('\n✅ User check completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking users:', error);
    process.exit(1);
  }
};

checkUsers();