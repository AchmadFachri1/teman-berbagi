// Set environment before importing app
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testsecretkey12345';

const mongoose = require('mongoose');
const DataItem = require('../server/models/DataItem');

jest.setTimeout(30000);

describe('DataItem Model Validation Tests', () => {

    afterEach(async () => {
        await DataItem.deleteMany({});
    });

    afterAll(async () => {
        await DataItem.deleteMany({});
    });

    // Test 1: Valid data creation
    test('Should create valid data item', async () => {
        const validData = {
            title: 'Valid Title',
            description: 'This is a valid description with enough length',
            amount: 50000,
            category: 'donation',
            status: 'active'
        };

        const item = await DataItem.create(validData);
        expect(item._id).toBeDefined();
        expect(item.title).toBe('Valid Title');
        expect(item.createdAt).toBeDefined();
        expect(item.updatedAt).toBeDefined();
    });

    // Test 2: Title validation - min length 3
    test('Should fail when title is too short', async () => {
        const invalidData = {
            title: 'ab',
            description: 'This is a valid description with enough length',
            amount: 50000,
            category: 'donation'
        };

        let error;
        try {
            await DataItem.create(invalidData);
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.errors.title).toBeDefined();
        expect(error.errors.title.message).toContain('at least 3 characters');
    });

    // Test 3: Title validation - max length 100
    test('Should fail when title is too long', async () => {
        const invalidData = {
            title: 'a'.repeat(101),
            description: 'This is a valid description with enough length',
            amount: 50000,
            category: 'donation'
        };

        let error;
        try {
            await DataItem.create(invalidData);
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.errors.title).toBeDefined();
    });

    // Test 4: Description validation - required
    test('Should fail when description is missing', async () => {
        const invalidData = {
            title: 'Valid Title',
            amount: 50000,
            category: 'donation'
        };

        let error;
        try {
            await DataItem.create(invalidData);
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.errors.description).toBeDefined();
    });

    // Test 5: Description validation - min length 10
    test('Should fail when description is too short', async () => {
        const invalidData = {
            title: 'Valid Title',
            description: 'Too short',
            amount: 50000,
            category: 'donation'
        };

        let error;
        try {
            await DataItem.create(invalidData);
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.errors.description).toBeDefined();
        expect(error.errors.description.message).toContain('at least 10 characters');
    });

    // Test 6: Amount validation - required
    test('Should fail when amount is missing', async () => {
        const invalidData = {
            title: 'Valid Title',
            description: 'This is a valid description with enough length',
            category: 'donation'
        };

        let error;
        try {
            await DataItem.create(invalidData);
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.errors.amount).toBeDefined();
    });

    // Test 7: Amount validation - min 1000
    test('Should fail when amount is less than 1000', async () => {
        const invalidData = {
            title: 'Valid Title',
            description: 'This is a valid description with enough length',
            amount: 500,
            category: 'donation'
        };

        let error;
        try {
            await DataItem.create(invalidData);
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.errors.amount).toBeDefined();
    });

    // Test 8: Category validation - enum
    test('Should fail when category is invalid', async () => {
        const invalidData = {
            title: 'Valid Title',
            description: 'This is a valid description with enough length',
            amount: 50000,
            category: 'invalid_category'
        };

        let error;
        try {
            await DataItem.create(invalidData);
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.errors.category).toBeDefined();
    });

    // Test 9: Status validation - default value
    test('Should set default status to active', async () => {
        const validData = {
            title: 'Valid Title',
            description: 'This is a valid description with enough length',
            amount: 50000,
            category: 'donation'
        };

        const item = await DataItem.create(validData);
        expect(item.status).toBe('active');
    });

    // Test 10: updatedAt should update on save
    test('Should update updatedAt on save', async () => {
        const item = await DataItem.create({
            title: 'Test Item',
            description: 'This is a valid description with enough length',
            amount: 50000,
            category: 'donation'
        });

        const originalUpdatedAt = item.updatedAt;

        // Wait a bit
        await new Promise(resolve => setTimeout(resolve, 100));

        item.title = 'Updated Title';
        await item.save();

        expect(item.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
});