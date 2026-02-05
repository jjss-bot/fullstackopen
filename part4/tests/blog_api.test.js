import app from './../app.js';
import mongoose from 'mongoose';
import assert from 'node:assert';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import config from '../utils/config.js';
import helper from './test_helper.js';
import Blog from './../models/blog.js';
import User from './../models/user.js';
import { test, after, beforeEach, describe } from 'node:test';

const api = supertest(app);

after(async() => {
  await mongoose.connection.close();
});

describe('adding a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const user = new User({
      username: 'root',
      name: 'Jhon',
      password: 'secret'
    });

    await user.save();
  });

  test("succeeds if username is not already taken ", async () => {
    const usersAtStart = await helper.usersInDB();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDB();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("fails if username is already taken", async () => {
    const usersAtStart = await helper.usersInDB();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400);

    const usersAtEnd = await helper.usersInDB();

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    assert(result.body.error.includes('expected `username` to be unique'));
  });

  test("fails if username is too short", async () => {
    const usersAtStart = await helper.usersInDB();

    const newUser = {
      username: 'Mt',
      name: 'Matti Luukkainen',
      password: 'salainen'
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400);

    const usersAtEnd = await helper.usersInDB();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    assert(result.body.error.includes('User validation failed: username'));
  });

  test("fails if password is too short", async () => {
    const usersAtStart = await helper.usersInDB();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'mt'
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400);

    const usersAtEnd = await helper.usersInDB();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    assert(result.body.error.includes('User validation failed: password'));
  });
});

describe("adding a new blog", () => {
  let token = '';

  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});

    const user = new User({
      username: 'root',
      name: 'Jhon',
      password: 'secret'
    });

    await user.save();

    const userForToken = {
      id: user._id,
      username: user.username
    };

    token = jwt.sign(userForToken, config.SECRET, { expiresIn: 60 * 60 });
  });

  test('succeeds if token is valid', async () => {
    const blog = {
      title: 'What is RCU, Fundamentally?',
      author: 'Paul McKenney',
      url: 'https://lwn.net/Articles/262464/',
      likes: 20
    };

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, 1);

    const newBlog = await helper.blogInDB(response.body.id);
    delete newBlog.id;
    delete newBlog.user;

    assert.deepStrictEqual(blog, newBlog);
  });

  test('fails if token is not valid', async () => {
    const blog = {
      title: 'What is RCU, Fundamentally?',
      author: 'Paul McKenney',
      url: 'https://lwn.net/Articles/262464/',
      likes: 20
    };

    const response = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiI')
      .send(blog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, 0);
  });

  test('succeeds and set likes to 0 if not present', async () => {
    const blog = {
      title: 'What is RCU, Fundamentally?',
      author: 'Paul McKenney',
      url: 'https://lwn.net/Articles/262464/'
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, 1);

    const newBlog = await helper.blogInDB(response.body.id);
    assert.strictEqual(newBlog.likes, 0);
  });

  test('fails if title is not added', async () => {
    const newBlog = {
      author: 'Paul McKenney',
      url: 'https://lwn.net/Articles/262464/',
      likes: 20
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, 0);
  });

  test('fails if url is not added', async () => {
    const newBlog = {
      title: 'What is RCU, Fundamentally?',
      author: 'Paul McKenney',
      likes: 20
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, 0);
  });
});