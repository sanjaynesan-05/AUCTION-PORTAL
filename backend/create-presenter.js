const { User } = require('./models');
require('dotenv').config();

/**
 * Create presenter account if it doesn't exist
 */
const createPresenter = async () => {
  try {
    console.log('🔄 Checking for presenter account...\n');

    const presenterExists = await User.findOne({ where: { username: 'presenter' } });

    if (!presenterExists) {
      console.log('👤 Creating presenter account...');
      await User.create({
        username: 'presenter',
        password: 'presenter123',
        role: 'presenter',
      });
      console.log('✅ Presenter account created successfully!\n');
      console.log('Login credentials:');
      console.log('   Username: presenter');
      console.log('   Password: presenter123\n');
    } else {
      console.log('ℹ️  Presenter account already exists\n');
      console.log('Login credentials:');
      console.log('   Username: presenter');
      console.log('   Password: presenter123\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create presenter account:', error);
    process.exit(1);
  }
};

createPresenter();
