// Set environment before importing app
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testsecretkey12345';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server/app');
const User = require('../server/models/User');
const bcrypt = require('bcryptjs');

jest.setTimeout(30000);

describe('Auth API Tests', () => {

    beforeEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
    });

    // Test register
    test('POST /api/auth/register - should create new user', async () => {
        const userData = {
            username: 'newuser',
            email: 'newuser@test.com',
            tanggalLahir: '1995-05-05',
            password: 'password123'
        };

        const res = await request(app)
            .post('/api/auth/register')
            .send(userData)
            .expect(201);

        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.username).toBe('newuser');
    });

    test('POST /api/auth/register - should return 400 for missing fields', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: 'onlyusername' })
            .expect(400);

        expect(res.body.success).toBe(false);
    });

    test('POST /api/auth/register - should return 400 for duplicate email', async () => {
        await User.create({
            username: 'existing',
            email: 'duplicate@test.com',
            tanggalLahir: new Date('1990-01-01'),
            password: await bcrypt.hash('password123', 10)
        });

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'newuser2',
                email: 'duplicate@test.com',
                tanggalLahir: '1995-05-05',
                password: 'password123'
            })
            .expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('Email sudah terdaftar');
    });

    // Test login
    test('POST /api/auth/login - should login successfully', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await User.create({
            username: 'loginuser',
            email: 'login@test.com',
            tanggalLahir: new Date('1990-01-01'),
            password: hashedPassword
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                identifier: 'login@test.com',
                password: 'password123'
            })
            .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
    });

    test('POST /api/auth/login - should return 401 for wrong password', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await User.create({
            username: 'loginuser2',
            email: 'login2@test.com',
            tanggalLahir: new Date('1990-01-01'),
            password: hashedPassword
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                identifier: 'login2@test.com',
                password: 'wrongpassword'
            })
            .expect(401);

        expect(res.body.success).toBe(false);
    });

    // Test get me (protected route)
    test('GET /api/auth/me - should return user data with valid token', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = await User.create({
            username: 'getmeuser',
            email: 'getme@test.com',
            tanggalLahir: new Date('1990-01-01'),
            password: hashedPassword
        });

        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.user.username).toBe('getmeuser');
    });

    test('GET /api/auth/me - should return 401 without token', async () => {
        await request(app)
            .get('/api/auth/me')
            .expect(401);
    });
});