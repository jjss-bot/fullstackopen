/*import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

const app = express();

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model('Blog', blogSchema);

const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl, { family: 4 });

app.use(express.json());

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
});

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});*/

import app from './app.js';
import config from './utils/config.js';
import logger from './utils/logger.js';

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});