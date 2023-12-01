// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.
// server/setupDatabase.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const adminUsername = process.argv[2];
const adminPassword = process.argv[3];

if (!adminUsername || !adminPassword) {
  console.error('Please provide both admin username and password as arguments.');
  process.exit(1);
}

mongoose.connect('mongodb://127.0.0.1:27017/fake_so', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const setupDatabase = async () => {
  try {
    const existingAdmin = await User.findOne({ username: adminUsername });

    if (existingAdmin) {
      console.log('Admin user already exists. Database setup skipped.');
      return;
    }

    // Hash the admin password using bcrypt
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = new User({
      username: adminUsername,
      password: hashedPassword,
    });

    await adminUser.save();

    console.log('Admin user created successfully. Database setup complete.');
  } catch (error) {
    console.error('Error setting up the database:', error);
  } finally {
    mongoose.disconnect();
  }
};

setupDatabase();
