import { Router } from 'express';
import User from './../models/user.js';

const userRouter = Router();

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { likes: 0, user: 0 });
  response.json(users);
});

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  const user = new User({
    username,
    name,
    password
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

export default userRouter;