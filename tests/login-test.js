const request = require('supertest');
const app = require('../server/app');

describe('Login Test', () => {
    test('Should login successfully', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                identifier: 'test@example.com',
                password: 'testpass123'
            });

        console.log('Login response:', res.body);
        expect(res.status).toBe(200);
    });
});