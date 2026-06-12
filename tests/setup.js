const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');
const User = require('../server/models/User');
const jwt = require('jsonwebtoken');

let mongoServer;
let globalAuthToken = '';

beforeAll(async () => {
    // Set JWT secret
    process.env.JWT_SECRET = 'testsecretkey12345';

    // Disconnect existing connection
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    // Create in-memory database
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
    console.log('✅ Test database connected');

    // Create test user
    const hashedPassword = await bcrypt.hash('testpass123', 10);
    const testUser = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        tanggalLahir: new Date('1990-01-01'),
        password: hashedPassword
    });

    // Generate token
    globalAuthToken = jwt.sign(
        { id: testUser._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    // Set global variable
    global.__AUTH_TOKEN__ = globalAuthToken;
    global.__USER_ID__ = testUser._id.toString();

    console.log('✅ Global test user created');
}, 60000);

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        if (collections[key] && collections[key].deleteMany && key !== 'users') {
            await collections[key].deleteMany();
        }
    }
}, 30000);

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log('✅ Test database disconnected');
}, 30000);