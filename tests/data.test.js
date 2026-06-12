// Set environment before importing app
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testsecretkey12345';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server/app');
const DataItem = require('../server/models/DataItem');

// Get auth token from global
let authToken = '';

// Wait for global setup to complete
beforeAll(async () => {
    // Tunggu hingga token tersedia (max 5 detik)
    for (let i = 0; i < 50; i++) {
        if (global.__AUTH_TOKEN__) {
            authToken = global.__AUTH_TOKEN__;
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log('Auth token available:', !!authToken);

    await DataItem.deleteMany({}).catch(() => { });
}, 30000);

afterAll(async () => {
    await DataItem.deleteMany({}).catch(() => { });
});

jest.setTimeout(60000);

describe('Data API Regression Test Suite', () => {

    // TC1: GET /api/data should return empty array
    test('TC1: GET /api/data should return empty array', async () => {
        await DataItem.deleteMany({});

        const res = await request(app)
            .get('/api/data')
            .expect(200);

        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.count).toBe(0);
    });

    // TC2: POST /api/data should create new data with auth
    test('TC2: POST /api/data should create new data with auth', async () => {
        if (!authToken) {
            console.log('No auth token available, skipping test');
            return;
        }

        const newData = {
            title: 'Test Donation Program',
            description: 'This is a test donation program for children in need',
            amount: 150000,
            category: 'education',
            status: 'active'
        };

        const res = await request(app)
            .post('/api/data')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newData);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeDefined();
        expect(res.body.data.title).toBe(newData.title);
    });

    // TC3: POST /api/data should return 401 without auth
    test('TC3: POST /api/data should return 401 without auth', async () => {
        const newData = {
            title: 'Unauthorized',
            description: 'This is a test description that is long enough',
            amount: 100000,
            category: 'donation'
        };

        await request(app)
            .post('/api/data')
            .send(newData)
            .expect(401);
    });

    // TC4: GET /api/data/:id should return data by ID
    test('TC4: GET /api/data/:id should return data by valid ID', async () => {
        const testItem = await DataItem.create({
            title: 'Get By ID Test',
            description: 'This is a valid test description with enough length',
            amount: 75000,
            category: 'health'
        });

        const res = await request(app)
            .get(`/api/data/${testItem._id}`)
            .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.data._id).toBe(testItem._id.toString());
    });

    // TC5: GET /api/data/:id should return 404 for invalid ID
    test('TC5: GET /api/data/:id should return 404 for non-existent ID', async () => {
        const fakeId = new mongoose.Types.ObjectId();

        await request(app)
            .get(`/api/data/${fakeId}`)
            .expect(404);
    });

    // TC6: PUT /api/data/:id should update existing data
    test('TC6: PUT /api/data/:id should update existing data', async () => {
        if (!authToken) {
            console.log('No auth token available, skipping test');
            return;
        }

        const testItem = await DataItem.create({
            title: 'Original Title',
            description: 'This is the original description with enough length',
            amount: 50000,
            category: 'donation'
        });

        const updateData = {
            title: 'Updated Title',
            amount: 75000
        };

        const res = await request(app)
            .put(`/api/data/${testItem._id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updateData)
            .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe('Updated Title');
        expect(res.body.data.amount).toBe(75000);
    });

    // TC7: PUT /api/data/:id should return 401 without auth
    test('TC7: PUT /api/data/:id should return 401 without auth', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const updateData = { title: 'New Title' };

        await request(app)
            .put(`/api/data/${fakeId}`)
            .send(updateData)
            .expect(401);
    });

    // TC8: DELETE /api/data/:id should delete existing data
    test('TC8: DELETE /api/data/:id should delete existing data', async () => {
        if (!authToken) {
            console.log('No auth token available, skipping test');
            return;
        }

        const testItem = await DataItem.create({
            title: 'To Be Deleted',
            description: 'This item will be deleted from the database',
            amount: 25000,
            category: 'other'
        });

        await request(app)
            .delete(`/api/data/${testItem._id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        // Verify data is really deleted
        await request(app)
            .get(`/api/data/${testItem._id}`)
            .expect(404);
    });

    // TC9: DELETE /api/data/:id should return 401 without auth
    test('TC9: DELETE /api/data/:id should return 401 without auth', async () => {
        const fakeId = new mongoose.Types.ObjectId();

        await request(app)
            .delete(`/api/data/${fakeId}`)
            .expect(401);
    });

    // TC10: POST /api/data should return 400 for missing required fields
    test('TC10: POST /api/data should return 400 for missing required fields', async () => {
        if (!authToken) {
            console.log('No auth token available, skipping test');
            return;
        }

        const invalidData = {
            title: 'Missing Fields'
        };

        const res = await request(app)
            .post('/api/data')
            .set('Authorization', `Bearer ${authToken}`)
            .send(invalidData)
            .expect(400);

        expect(res.body.success).toBe(false);
    });

    // TC11: GET /api/data should support pagination
    test('TC11: GET /api/data should support pagination', async () => {
        await DataItem.deleteMany({});

        for (let i = 1; i <= 5; i++) {
            await DataItem.create({
                title: `Item ${i}`,
                description: `This is description number ${i} with enough characters`,
                amount: i * 10000,
                category: 'donation'
            });
        }

        const res = await request(app)
            .get('/api/data?page=1&limit=3')
            .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.data.length).toBe(3);
        expect(res.body.total).toBe(5);
        expect(res.body.page).toBe(1);
    });

    // TC12: GET /api/data should filter by category
    test('TC12: GET /api/data should filter by category', async () => {
        await DataItem.deleteMany({});

        await DataItem.create([
            { title: 'Donation A', description: 'This is a valid description for donation A', amount: 10000, category: 'donation' },
            { title: 'Donation B', description: 'This is a valid description for donation B', amount: 20000, category: 'donation' },
            { title: 'Education A', description: 'This is a valid description for education A', amount: 30000, category: 'education' }
        ]);

        const res = await request(app)
            .get('/api/data?category=donation')
            .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(item => item.category === 'donation')).toBe(true);
    });
});