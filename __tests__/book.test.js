// Lib
const supertest = require('supertest');
const mong = require('mongoose');

// Server
const app = require('../server');

// Model
const BookModel = require('../model/book.model');

// Create test agent
const server = supertest.agent(app);

// Option mongo
const optMongo = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: false,
};

// Test data
const testUser = {
  'title': 'Murder on the Orient Express',
  'author': 'Agatha Christie',
  'date': '1934-01-01',
  'description': 'very interesting book',
  'image': 'https://upload.wikimedia.org/wikipedia/en/c/c0/Murder_on_the_Orient_Express_First_Edition_Cover_1934.jpg',
};

let idUser = null;

// Tests
describe('Test the root book path', () => {
  beforeAll(async (done) => {
    await mong.connect(process.env.DB, optMongo);
    done();
  });

  afterAll(async (done) => {
    await mong.connection.close();
    done();
  });

  test('It should response the GET (all books) method', async (done) => {
    const resp = await server.get('/book?offset=1&limit=1&orderBy=author&groupBy=title,author');
    // const resp = await server.get('/book');

    expect(resp.statusCode).toBe(200);
    expect(typeof resp.body).toBe('object');
    expect(resp.body).toHaveProperty('data');
    expect(Array.isArray(resp.body.data)).toBeTruthy();
    done();
  });

  test('It should response the POST (create) method', async (done) => {
    const resp = await server.post('/book').send(testUser);

    expect(resp.statusCode).toBe(201);
    expect(typeof resp.body).toBe('object');
    expect(resp.body).toHaveProperty('data');
    expect(typeof resp.body.data).toBe('string');

    idUser = resp.body.data;
    done();
  });

  test('It should response the POST (duplicate error) method', async (done) => {
    const resp = await server.post('/book').send(testUser);

    expect(resp.statusCode).toBe(400);
    expect(typeof resp.body).toBe('object');
    expect(resp.body).toHaveProperty('message');
    expect(typeof resp.body.message).toBe('string');
    done();
  });

  test('It should response the GET (by id) method', async (done) => {
    const resp = await server.get(`/book/${idUser}`);

    expect(resp.statusCode).toBe(200);
    expect(typeof resp.body).toBe('object');
    expect(resp.body._id).toBe(idUser);
    expect(resp.body.title).toBe(testUser.title);
    expect(resp.body.author).toBe(testUser.author);
    done();
  });

  test('It should response the PUT (update by id) method', async (done) => {
    const resp = await server.put(`/book/${idUser}`).send({ title: 'Orient Express' });

    expect(resp.statusCode).toBe(200);
    expect(typeof resp.body).toBe('object');
    expect(resp.body).toHaveProperty('data');
    expect(typeof resp.body.data).toBe('string');

    // Check the data in the database
    const newPost = await BookModel.findById({ _id: resp.body.data }).lean();
    expect(newPost).toBeTruthy();
    expect(newPost.title).toBe('Orient Express');

    done();
  });

  test('It should response the DELETE (update by id) method', async (done) => {
    const resp = await server.delete(`/book/${idUser}`);

    expect(resp.statusCode).toBe(204);

    // Check the data in the database
    expect(await BookModel.findById({ _id: idUser })).toBeFalsy();

    done();
  });
});
