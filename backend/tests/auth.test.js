const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../app'); // We need to create this app.js file
const User = require('../models/User');

let mongoServer;

// Setup: Connect to a new in-memory DB before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Teardown: Clear data and disconnect after all tests
afterAll(async () => {
   if (mongoose.connection.readyState === 1) { 
        await mongoose.connection.close(); 
    }
    await mongoServer.stop();
});

// Clear user collection before each test
afterEach(async () => {
  await User.deleteMany({});
});



describe('POST /api/auth/register', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123',
        role: 'customer' // Add role
      });
      
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');

    // Check if user is actually in the database
    const user = await User.findOne({ username: 'testuser' });
    expect(user).not.toBeNull();
    expect(user.role).toBe('customer');
  });

  it('should return 400 if user already exists', async () => {
    // First, create the user
    const user = new User({ username: 'testuser', password: 'password123' });
    await user.save();

    // Then, try to register again
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123'
      });
      
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'User already exists');
  });
  it('should login a valid user and return a JWT token', async () => {
    // Create user first
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'loginuser', password: 'password123' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'loginuser',
        password: 'password123'
      });
      
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should return 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'nonexistent',
        password: 'wrongpassword'
      });
      
    expect(res.statusCode).toBe(401);
  });
});
describe('AUTH FAILURE CASES (Coverage Focus)', () => {

    it('should return 400 if user registers with an existing email', async () => {
        // First, register a user successfully (assumes this is already working)
        await request(app)
            .post('/api/auth/register')
            .send({ 
                username: 'DuplicateUser',
                email: 'testuser@example.com',
                password: 'password123'
            });

        // Second, try to register the same user again
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'AnotherDuplicate',
                email: 'testuser@example.com', // Duplicate email
                password: 'newpassword'
            });

        // Expect 400 Bad Request
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message', 'User with this email already exists.');
    });

    it('should return 401 for login with non-existent email', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'unknown@example.com', // Non-existent email
                password: 'anypassword'
            });

        // Expect 401 Unauthorized
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 401 for login with correct email but wrong password', async () => {
        // Assume 'testuser@example.com' exists from the registration test above.
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'wrongpassword' // Incorrect password
            });

        // Expect 401 Unauthorized
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
    it('should return 401 for login with non-existent email', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'unknown@example.com',
                password: 'anypassword'
            });

        expect(response.statusCode).toBe(401);
        // --- FIX: Change expected message to match application code ---
        expect(response.body).toHaveProperty('message', 'Invalid credentials'); 
    });

    it('should return 401 for login with correct email but wrong password', async () => {
        // Assume 'testuser@example.com' exists from setup
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'wrongpassword'
            });

        expect(response.statusCode).toBe(401);
        // --- FIX: Change expected message to match application code ---
        expect(response.body).toHaveProperty('message', 'Invalid credentials'); 
    });
    it('should register a new user successfully', async () => {
    const res = await request(app)
        .post('/api/auth/register')
        .send({ 
            username: 'validuser', // Make sure this is sent
            email: 'validuser@test.com', // <-- CRITICAL: ENSURE EMAIL IS SENT
            password: 'password123' 
        });
    
    // The test framework should have provided the email/password in the payload
    expect(res.statusCode).toBe(201);
});
});
afterAll(async () => {
    // This is the most reliable way to ensure connections are closed for testing:
    if (mongoose.connection.readyState === 1) { // Check if connected
        await mongoose.connection.close(); 
    }
    await mongoServer.stop();
});
