import { Router } from 'express';
import Blog from './../models/blog.js';
import middleware from '../utils/middleware.js';

const blogRouter = Router();

blogRouter.get('/',async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{ name: 1, username: 1 });
  response.json(blogs);
});

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = request.user;
  const { title, author, url, likes } = request.body;
  
  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogRouter.put('/:id', async (request, response) => {
  const { likes } = request.body;
  const blog = await Blog.findById(request.params.id);

  if (blog) {
    blog.likes = likes;
    const savedBlog = await blog.save();
    return response.json(savedBlog);
  }

  response.status(404).end();
});

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user;
  const id = request.params.id;
  const blog = await Blog.findById(id);

  if (blog) {
    if (blog.user.toString() === user._id.toString()) {
      user.blogs = user.blogs.filter(b => {
        return b._id.toString() !== id;
      });

      await blog.deleteOne();
    } else {
      return response.status(403).end();
    }
  }

  response.status(204).end();
});

export default blogRouter;