// Set environment before importing app
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testsecretkey12345';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server/app');
const DataItem = require('../server/models/DataItem');

let authToken = '';

jest.setTimeout(60000);

describe('Complete CRUD API Test Suite (13 Test Cases)', () => {

    beforeAll(async () => {
        // Get auth token from global setup
        for (let i = 0; i < 50; i++) {
            if (global.__AUTH_TOKEN__) {
                authToken = global.__AUTH_TOKEN__;
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        console.log('Auth token available:', !!authToken);

        await DataItem.deleteMany({});
    }, 30000);

    afterAll(async () => {
        await DataItem.deleteMany({});
    });

    // ============================================================
    // ENDPOINT 1-2: GET /api/data
    // ============================================================

    // TEST CASE 1: Happy Path - GET empty array when no data exists
    test('TC1: GET /api/data - should return empty array when no data', async () => {
        await DataItem.deleteMany({});

        const res = await request(app)
            .get('/api/data')
            .expect(200);

        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.count).toBe(0);
        expect(res.body.total).toBe(0);
    });

    // TEST CASE 2: Happy Path - GET with pagination
    test('TC2: GET /api/data - should support pagination', async () => {
        await DataItem.deleteMany({});

        // Create 5 test items
        for (let i = 1; i <= 5; i++) {
            await DataItem.create({
                title: `Pagination Item ${i}`,
                description: `This is description for item ${i} with enough length`,
                amount: i * 10000,
                category: 'donation'
            });
            // Small delay to ensure different timestamps
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        // Test page 1 with limit 2
        const res = await request(app)
            .get('/api/data?page=1&limit=2')
            .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.data.length).toBe(2);
        expect(res.body.total).toBe(5);
        expect(res.body.page).toBe(1);
        expect(res.body.totalPages).toBe(3);

        // Data sorted by createdAt DESC (newest first)
        // So item 5 is newest, then item 4
        expect(res.body.data[0].title).toBe('Pagination Item 5');
        expect(res.body.data[1].title).toBe('Pagination Item 4');

        // Test page 2
        const res2 = await request(app)
            .get('/api/data?page=2&limit=2')
            .expect(200);

        expect(res2.body.data[0].title).toBe('Pagination Item 3');
        expect(res2.body.data[1].title).toBe('Pagination Item 2');

        // Test page 3
        const res3 = await request(app)
            .get('/api/data?page=3&limit=2')
            .expect(200);

        expect(res3.body.data[0].title).toBe('Pagination Item 1');
        expect(res3.body.data.length).toBe(1);
    });

    // ============================================================
    // ENDPOINT 3-5: GET /api/data/:id
    // ============================================================

    // TEST CASE 3: Happy Path - GET data by valid ID
    test('TC3: GET /api/data/:id - should return data by valid ID', async () => {
        const testItem = await DataItem.create({
            title: 'Get By ID Test',
            description: 'This is a valid description for get by ID test',
            amount: 75000,
            category: 'health'
        });

        const res = await request(app)
            .get(`/api/data/${testItem._id}`)
            .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeDefined();
        expect(res.body.data._id).toBe(testItem._id.toString());
        expect(res.body.data.title).toBe('Get By ID Test');
        expect(res.body.data.amount).toBe(75000);
        expect(res.body.data.category).toBe('health');
    });

    // TEST CASE 4: Edge Case - GET with non-existent ID (404)
    test('TC4: GET /api/data/:id - should return 404 for non-existent ID', async () => {
        const fakeId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .get(`/api/data/${fakeId}`)
            .expect(404);

        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('not found');
    });

    // TEST CASE 5: Edge Case - GET with invalid ID format (400)
    test('TC5: GET /api/data/:id - should return 400 for invalid ID format', async () => {
        const res = await request(app)
            .get('/api/data/invalid-id-format-12345')
            .expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('Invalid ID format');
    });

    // ============================================================
    // ENDPOINT 6-8: POST /api/data
    // ============================================================

    // TEST CASE 6: Happy Path - POST create new data with valid input
    test('TC6: POST /api/data - should create new data with valid input', async () => {
        const newData = {
            title: 'New Donation Program',
            description: 'Help children in need get proper education and better future',
            amount: 150000,
            category: 'education',
            status: 'active'
        };

        const res = await request(app)
            .post('/api/data')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newData)
            .expect(201);

        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeDefined();
        expect(res.body.data.title).toBe(newData.title);
        expect(res.body.data.description).toBe(newData.description);
        expect(res.body.data.amount).toBe(newData.amount);
        expect(res.body.data.category).toBe(newData.category);
        expect(res.body.data.status).toBe(newData.status);
        expect(res.body.data.createdAt).toBeDefined();
        expect(res.body.data.updatedAt).toBeDefined();
    });

    // TEST CASE 7: Edge Case - POST with missing required fields (400)
    test('TC7: POST /api/data - should return 400 for missing required fields', async () => {
        const invalidData = {
            title: 'Incomplete Data'
        };

        const res = await request(app)
            .post('/api/data')
            .set('Authorization', `Bearer ${authToken}`)
            .send(invalidData)
            .expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('Missing required fields');
    });

    // TEST CASE 8: Edge Case - POST without authentication (401)
    test('TC8: POST /api/data - should return 401 when not authenticated', async () => {
        const newData = {
            title: 'Unauthorized Creation',
            description: 'This should not be created without auth token',
            amount: 100000,
            category: 'donation'
        };

        const res = await request(app)
            .post('/api/data')
            .send(newData)
            .expect(401);

        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('Akses ditolak');
    });

    // ============================================================
    // ENDPOINT 9-10: PUT /api/data/:id
    // ============================================================

    // TEST CASE 9: Happy Path - PUT update existing data
    test('TC9: PUT /api/data/:id - should update existing data', async () => {
        const testItem = await DataItem.create({
            title: 'Original Title',
            description: 'This is the original description with enough length',
            amount: 50000,
            category: 'donation'
        });

        const updateData = {
            title: 'Updated Title',
            amount: 75000,
            category: 'health'
        };

        const res = await request(app)
            .put(`/api/data/${testItem._id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updateData)
            .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe('Updated Title');
        expect(res.body.data.amount).toBe(75000);
        expect(res.body.data.category).toBe('health');
        expect(res.body.data.description).toBe(testItem.description);
    });

    // TEST CASE 10: Edge Case - PUT with non-existent ID (404)
    test('TC10: PUT /api/data/:id - should return 404 for non-existent ID', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const updateData = { title: 'New Title' };

        const res = await request(app)
            .put(`/api/data/${fakeId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updateData)
            .expect(404);

        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('not found');
    });

    // ============================================================
    // ENDPOINT 11-12: DELETE /api/data/:id
    // ============================================================

    // TEST CASE 11: Happy Path - DELETE existing data
    test('TC11: DELETE /api/data/:id - should delete existing data', async () => {
        const testItem = await DataItem.create({
            title: 'To Be Deleted',
            description: 'This item will be permanently deleted from database',
            amount: 25000,
            category: 'other'
        });

        const res = await request(app)
            .delete(`/api/data/${testItem._id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain('deleted successfully');

        const checkRes = await request(app)
            .get(`/api/data/${testItem._id}`)
            .expect(404);

        expect(checkRes.body.success).toBe(false);
    });

    // TEST CASE 12: Edge Case - DELETE with non-existent ID (404)
    test('TC12: DELETE /api/data/:id - should return 404 for non-existent ID', async () => {
        const fakeId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .delete(`/api/data/${fakeId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(404);

        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('not found');
    });

    // ============================================================
    // EXTRA TEST CASE 13: Filter by category
    // ============================================================

    // TEST CASE 13: Edge Case - GET with query filter
    test('TC13: GET /api/data - should filter data by category', async () => {
        await DataItem.deleteMany({});

        await DataItem.create([
            {
                title: 'Donation Program A',
                description: 'This is a valid description for donation program A',
                amount: 10000,
                category: 'donation'
            },
            {
                title: 'Donation Program B',
                description: 'This is a valid description for donation program B',
                amount: 20000,
                category: 'donation'
            },
            {
                title: 'Education Program',
                description: 'This is a valid description for education program',
                amount: 30000,
                category: 'education'
            },
            {
                title: 'Health Program',
                description: 'This is a valid description for health program',
                amount: 40000,
                category: 'health'
            }
        ]);

        const res = await request(app)
            .get('/api/data?category=donation')
            .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data.every(item => item.category === 'donation')).toBe(true);

        const res2 = await request(app)
            .get('/api/data?category=education')
            .expect(200);

        expect(res2.body.success).toBe(true);
        expect(res2.body.data.length).toBe(1);
        expect(res2.body.data[0].category).toBe('education');
    });
});