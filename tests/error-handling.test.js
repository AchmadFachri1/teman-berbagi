// Set environment before importing app
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testsecretkey12345';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server/app');
const DataItem = require('../server/models/DataItem');
const User = require('../server/models/User');

let authToken = '';
let userId = '';

jest.setTimeout(30000);

describe('Error Handling Tests', () => {

    beforeAll(async () => {
        // Get token from global
        for (let i = 0; i < 50; i++) {
            if (global.__AUTH_TOKEN__) {
                authToken = global.__AUTH_TOKEN__;
                userId = global.__USER_ID__;
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        await DataItem.deleteMany({});
    });

    afterAll(async () => {
        await DataItem.deleteMany({});
    });

    // Test 1: Invalid ID format for GET
    test('GET /api/data/:id - should return 400 for invalid ID format', async () => {
        const res = await request(app)
            .get('/api/data/invalid-id-format')
            .expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('Invalid ID format');
    });

    // Test 2: Invalid ID format for PUT
    test('PUT /api/data/:id - should return 400 for invalid ID format', async () => {
        const res = await request(app)
            .put('/api/data/invalid-id-format')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'New Title' })
            .expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('Invalid ID format');
    });

    // Test 3: Invalid ID format for DELETE
    test('DELETE /api/data/:id - should return 400 for invalid ID format', async () => {
        const res = await request(app)
            .delete('/api/data/invalid-id-format')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('Invalid ID format');
    });

    // Test 4: Amount validation - too high
    test('POST /api/data - should fail when amount is too high', async () => {
        const invalidData = {
            title: 'Too High Amount',
            description: 'This is a valid description with enough length',
            amount: 2000000000, // > 1 billion
            category: 'donation'
        };

        const res = await request(app)
            .post('/api/data')
            .set('Authorization', `Bearer ${authToken}`)
            .send(invalidData)
            .expect(400);

        expect(res.body.success).toBe(false);
    });

    // Test 5: Invalid token
    test('POST /api/data - should return 401 for invalid token', async () => {
        const res = await request(app)
            .post('/api/data')
            .set('Authorization', 'Bearer invalid-token-12345')
            .send({
                title: 'Test',
                description: 'This is a valid description',
                amount: 50000,
                category: 'donation'
            })
            .expect(401);

        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('Token tidak valid');
    });

    // Test 6: Expired token simulation
    test('POST /api/data - should return 401 for expired token', async () => {
        const jwt = require('jsonwebtoken');
        const expiredToken = jwt.sign(
            { id: userId },
            process.env.JWT_SECRET,
            { expiresIn: '-1s' } // Already expired
        );

        const res = await request(app)
            .post('/api/data')
            .set('Authorization', `Bearer ${expiredToken}`)
            .send({
                title: 'Test',
                description: 'This is a valid description',
                amount: 50000,
                category: 'donation'
            })
            .expect(401);

        expect(res.body.success).toBe(false);
    });

    // Test 7: Health check endpoint
    test('GET /api/health - should return server status', async () => {
        const res = await request(app)
            .get('/api/health')
            .expect(200);

        expect(res.body.status).toBe('OK');
        expect(res.body.environment).toBe('test');
        expect(res.body.uptime).toBeDefined();
    });
});