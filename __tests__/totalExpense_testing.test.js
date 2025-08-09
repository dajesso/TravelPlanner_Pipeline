//Logic
//1. as the user enter get all trips, it will show total expense for each trips
//2. when they enter get one trips there will be total exense for the ONE trip
//3. when they add one expense...the total expense should auto add on
//4. when we request all the trips from an authenticated user ......

// made sure the password was salted and hashed the arrival time and departure time was in the wrong format.
// most of the code was correct without the fixes

jest.setTimeout(60000); 
process.env.JWT_SECRET = 'felicisontheloose';
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/index.js');
const bcrypt = require('bcrypt');

// will store value later

let mongoServer;
let token = '';
let tripId = '';
let categoryId = '';

//Set up for test

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri;
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  // Use a static user for consistency with trip_testing.test.js
  const email = 'jesso@jesso.me';
  const password = 'password';

  // Register the user first (for disposable/in-memory DB)
  await request(app)
    .post('/register')
    .send({ email, password });

  // Login and get token
  const loginRes = await request(app)
    .post('/login')
    .send({ email, password });
  console.log('Login response:', loginRes.statusCode, loginRes.body);
  token = loginRes.body.token;

  // Create trip
  const tripRes = await request(app)
    .post('/trips')
    .set('Authorization', `Bearer ${token}`)
    .send({ location: 'TestLocation', arrivalDate: '08/09/1997', departureDate: '09/09/2025' });
  tripId = tripRes.body._id;

  // Create category
  const categoryRes = await request(app)
    .post('/categories')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'TestCategory' });
  categoryId = categoryRes.body._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});


//Testing
describe('Trip Expense Logic', () => {
    //Logic 1
    it('should return all trips with their total expenses', async () => {
    const res = await request(app)
      .get('/trips')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach(trip => {
      expect(trip).toHaveProperty('totalExpense');
      expect(typeof trip.totalExpense).toBe('number');
    });
  });

  // Logic 2
  it('should return one trip with its total expense', async () => {
    const res = await request(app)
      .get(`/trips/${tripId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalExpense');
    expect(typeof res.body.totalExpense).toBe('number');
  });

  //Logic 3
  it('should update the total expense after adding a new expense', async () => {
    // old total expense(before) + new expense = final total expense(after)
    const before = await request(app)
      .get(`/trips/${tripId}`)
      .set('Authorization', `Bearer ${token}`);
    
    const beforeTotalExpense = before.body.totalExpense;

    // to add a expense to test
    // array
    const addedNewExpense = {
      amount: 99,
      description: 'Test meal',
      trip: tripId,
      category: categoryId
    };
    // action
    const toAddNewExpense = await request(app)
      .post('/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send(addedNewExpense);

    expect(toAddNewExpense.statusCode).toBe(201);

    const after = await request(app)
      .get(`/trips/${tripId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(after.body.totalExpense).toBe(beforeTotalExpense + addedNewExpense.amount);
  });
});
