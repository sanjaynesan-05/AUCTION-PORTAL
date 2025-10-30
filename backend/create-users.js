const { User } = require('./models');

const createUsers = async () => {
  try {
    // Create presenter user
    const presenterExists = await User.findOne({ where: { username: 'presenter' } });
    if (!presenterExists) {
      await User.create({
        username: 'presenter',
        password: 'Presenter123',
        role: 'presenter',
      });
      console.log('✅ Presenter user created');
    } else {
      console.log('ℹ️ Presenter user already exists');
    }

    // Create viewer user
    const viewerExists = await User.findOne({ where: { username: 'viewer' } });
    if (!viewerExists) {
      await User.create({
        username: 'viewer',
        password: 'Viewer123',
        role: 'viewer',
      });
      console.log('✅ Viewer user created');
    } else {
      console.log('ℹ️ Viewer user already exists');
    }

    console.log('🎉 User creation completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating users:', error);
    process.exit(1);
  }
};

createUsers();