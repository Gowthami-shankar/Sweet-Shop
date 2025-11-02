const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Sweet = require('../models/Sweet'); 

let mongoServer;
let adminToken;
let customerToken;
let testSweetId;

// Setup: Connect to in-memory DB (Async)
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

// Teardown: Disconnect (Async)
afterAll(async () => {
    // ⭐️ FIX: Reliable disconnect to prevent test leaks
    if (mongoose.connection.readyState === 1) { 
        await mongoose.connection.close(); 
    }
    await mongoServer.stop();
});

// ⭐️ CRITICAL SETUP BLOCK: Registers users, logs them in, and gets REAL tokens ⭐️
beforeEach(async () => { 
    // Clear collections for fresh start
    await User.deleteMany({});
    await Sweet.deleteMany({});

    // 1. Register Admin
    await request(app).post('/api/auth/register').send({
        username: 'admin', 
        email: 'admin@test.com', 
        password: 'password', 
        role: 'admin'
    });

    // 2. Login Admin and store token
    const adminLoginRes = await request(app).post('/api/auth/login').send({
        email: 'admin@test.com', 
        password: 'password'
    });
    // Check if login failed (status is not 200) and handle gracefully
    if (adminLoginRes.statusCode !== 200) {
        console.error('Admin Login Failed in Setup:', adminLoginRes.body);
        adminToken = null;
    } else {
        adminToken = adminLoginRes.body.token; 
    }

    // 3. Register Customer
    await request(app).post('/api/auth/register').send({
        username: 'customer', 
        email: 'customer@test.com', 
        password: 'password', 
        role: 'customer'
    });

    // 4. Login Customer and store token
    const customerLoginRes = await request(app).post('/api/auth/login').send({
        email: 'customer@test.com', 
        password: 'password'
    });
    if (customerLoginRes.statusCode !== 200) {
        console.error('Customer Login Failed in Setup:', customerLoginRes.body);
        customerToken = null;
    } else {
        customerToken = customerLoginRes.body.token;
    }
    
    // 5. Create a fresh sweet for most tests to target
    const newSweet = await new Sweet({
        name: 'Test Sweet For Purchase', category: 'Classic', price: 5, quantity: 10
    }).save();
    testSweetId = newSweet._id;
});

// --- Test for POST /api/sweets ---
describe('POST /api/sweets', () => {
    it('should allow an admin to add a new sweet', async () => { 
        const res = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${adminToken}`) // FIX: Bearer token
            .send({
                name: 'Gulab Jamun',
                category: 'Classic',
                price: 2.50,
                quantity: 100
            });
            
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('name', 'Gulab Jamun');
    });

    it('should NOT allow a regular customer to add a new sweet', async () => { 
        const res = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${customerToken}`) // FIX: Bearer token
            .send({ name: 'Ladoo', category: 'Classic', price: 1.50, quantity: 50 });
            
        expect(res.statusCode).toBe(403); // Forbidden
    });

    it('should return 401 if no token is provided', async () => { 
        const res = await request(app)
            .post('/api/sweets')
            .send({ name: 'Jalebi', category: 'Classic', price: 3.00, quantity: 20 });
            
        expect(res.statusCode).toBe(401); // Unauthorized
    });
});

// --- GET /api/sweets (Your Original Tests) ---
describe('GET /api/sweets', () => {
    it('should allow a logged-in user to get all sweets', async () => { 
        const res = await request(app)
            .get('/api/sweets')
            .set('Authorization', `Bearer ${customerToken}`); // FIX: Bearer token
            
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0); 
    });

    it('should NOT allow a logged-out user to get sweets', async () => { 
        const res = await request(app)
            .get('/api/sweets'); // No token
            
        expect(res.statusCode).toBe(401); // Unauthorized
    });
});

// --- GET /api/sweets/search ---
describe('GET /api/sweets/search', () => {
    // Add multiple sweets to search through in this block's beforeEach
    beforeEach(async () => { 
        await Sweet.deleteMany({});
        await Sweet.insertMany([
            { name: 'Ladoo', category: 'Classic', price: 1.50, quantity: 50 },
            { name: 'Jalebi', category: 'Classic', price: 3.00, quantity: 30 },
            { name: 'Kaju Katli', category: 'Premium', price: 5.00, quantity: 20 }
        ]);
    });

    it('should find sweets by name', async () => { 
        const res = await request(app)
            .get('/api/sweets/search?name=Ladoo')
            .set('Authorization', `Bearer ${customerToken}`); // FIX: Bearer token
        
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].name).toBe('Ladoo');
    });

    it('should find sweets by category', async () => { 
        const res = await request(app)
            .get('/api/sweets/search?category=Classic')
            .set('Authorization', `Bearer ${customerToken}`); // FIX: Bearer token
        
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it('should find sweets by priceRange', async () => { 
        // Range 0 to 2
        const res = await request(app)
            .get('/api/sweets/search?priceRange=0-2')
            .set('Authorization', `Bearer ${customerToken}`); // FIX: Bearer token
        
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].name).toBe('Ladoo');
    });

    it('should handle combined queries', async () => { 
        const res = await request(app)
            .get('/api/sweets/search?category=Premium&priceRange=0-10')
            .set('Authorization', `Bearer ${customerToken}`); // FIX: Bearer token
        
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].name).toBe('Kaju Katli');
    });
});

// --- PUT /api/sweets/:id ---
describe('PUT /api/sweets/:id', () => {
    // sweetToUpdate is handled by global testSweetId in combined beforeEach
    it('should allow an ADMIN to update a sweet', async () => { 
        const res = await request(app)
            .put(`/api/sweets/${testSweetId}`)
            .set('Authorization', `Bearer ${adminToken}`) // FIX: Bearer token
            .send({ name: 'New Name', price: 99 });

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('New Name');
        expect(res.body.price).toBe(99);
    });

    it('should NOT allow a CUSTOMER to update a sweet', async () => { 
        const res = await request(app)
            .put(`/api/sweets/${testSweetId}`)
            .set('Authorization', `Bearer ${customerToken}`) // FIX: Bearer token
            .send({ name: 'New Name' });

        expect(res.statusCode).toBe(403); // Forbidden
    });
});

// --- DELETE /api/sweets/:id ---
describe('DELETE /api/sweets/:id', () => {
    // sweetToDelete is handled by global testSweetId in combined beforeEach
    it('should allow an ADMIN to delete a sweet', async () => { 
        const res = await request(app)
            .delete(`/api/sweets/${testSweetId}`)
            .set('Authorization', `Bearer ${adminToken}`); // FIX: Bearer token

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Sweet deleted');

        // Verify it's gone
        const found = await Sweet.findById(testSweetId);
        expect(found).toBeNull();
    });

    it('should NOT allow a CUSTOMER to delete a sweet', async () => { 
        const res = await request(app)
            .delete(`/api/sweets/${testSweetId}`)
            .set('Authorization', `Bearer ${customerToken}`); // FIX: Bearer token

        expect(res.statusCode).toBe(403);
    });
});

// --- POST /api/sweets/:id/purchase ---
describe('POST /api/sweets/:id/purchase', () => {
    it('should allow a CUSTOMER to purchase a sweet (decrement stock)', async () => { 
        const res = await request(app)
            .post(`/api/sweets/${testSweetId}/purchase`)
            .set('Authorization', `Bearer ${customerToken}`) // FIX: Bearer token
            .send({ quantity: 1 }); // Use amount of 1

        expect(res.statusCode).toBe(200);
        expect(res.body.quantity).toBe(9); // Was 10 (from setup), now 9
    });

    it('should NOT allow purchase if stock is 0', async () => { 
        // Set stock to 0 manually for this test case
        await Sweet.findByIdAndUpdate(testSweetId, { quantity: 0 });

        const res = await request(app)
            .post(`/api/sweets/${testSweetId}/purchase`)
            .set('Authorization', `Bearer ${customerToken}`) // FIX: Bearer token
            .send({ quantity: 1 }); // Try to buy 1

        expect(res.statusCode).toBe(400); // Bad Request
        expect(res.body.message).toBe('Out of stock'); 
    });

    it('should NOT allow a logged-out user to purchase', async () => { 
        const res = await request(app)
            .post(`/api/sweets/${testSweetId}/purchase`)
            .send({ quantity: 1 });
            
        expect(res.statusCode).toBe(401);
    });
});

// --- POST /api/sweets/:id/restock ---
describe('POST /api/sweets/:id/restock', () => {
    it('should allow an ADMIN to restock a sweet (increment stock)', async () => { 
        const res = await request(app)
            .post(`/api/sweets/${testSweetId}/restock`)
            .set('Authorization', `Bearer ${adminToken}`) // FIX: Bearer token
            .send({ amount: 20 }); // Send amount to add

        expect(res.statusCode).toBe(200);
        expect(res.body.quantity).toBe(30); // Was 10 (from setup), add 20
    });

    it('should NOT allow a CUSTOMER to restock', async () => { 
        const res = await request(app)
            .post(`/api/sweets/${testSweetId}/restock`)
            .set('Authorization', `Bearer ${customerToken}`) // FIX: Bearer token
            .send({ amount: 20 });
            
        expect(res.statusCode).toBe(403);
    });
});

// --- SECURITY & PURCHASE FAILURE CASES (Coverage Focus) ---
describe('SECURITY & PURCHASE FAILURE CASES (Coverage Focus)', () => {
    it('should return 403 when a Customer tries to DELETE a sweet (Admin Only)', async () => { // <--- async
        const response = await request(app)
            .delete(`/api/sweets/${testSweetId}`)
            .set('Authorization', `Bearer ${customerToken}`); 

        expect(response.statusCode).toBe(403); 
        expect(response.body).toHaveProperty('message', 'Access denied! Requires Admin role.');
    });

    it('should return 403 when a Customer tries to RESTOCK a sweet (Admin Only)', async () => { // <--- async
        const response = await request(app)
            .post(`/api/sweets/${testSweetId}/restock`)
            .set('Authorization', `Bearer ${customerToken}`)
            .send({ amount: 10 }); 

        expect(response.statusCode).toBe(403);
        expect(response.body).toHaveProperty('message', 'Access denied! Requires Admin role.');
    });

    it('should return 400 if purchase quantity is invalid or missing', async () => { // <--- async
        // Test 1: Missing quantity field
        const responseMissing = await request(app)
            .post(`/api/sweets/${testSweetId}/purchase`)
            .set('Authorization', `Bearer ${customerToken}`)
            .send({}); // Empty body

        expect(responseMissing.statusCode).toBe(400);
        expect(responseMissing.body).toHaveProperty('message'); 

        // Test 2: Invalid (zero) quantity
        const responseZero = await request(app)
            .post(`/api/sweets/${testSweetId}/purchase`)
            .set('Authorization', `Bearer ${customerToken}`)
            .send({ quantity: 0 });

        expect(responseZero.statusCode).toBe(400);
        expect(responseZero.body).toHaveProperty('message', 'Purchase quantity must be greater than zero.');
    });
});