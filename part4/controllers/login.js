import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import User from './../models/user.js';
import config from './../utils/config.js';

const loginRouter = Router();

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  const validPassword = (user === null)
    ? false
    : await bcrypt.compare(password, user.password);

  if (!(user && validPassword)) {
    return response.status(401).json( {
      error: 'invalid user or password'
    });
  }

  const userForToken = {
    id: user._id,
    username: user.username
  };

  // token expires in one hour
  const token = jwt.sign(userForToken, config.SECRET, { expiresIn: 60 * 60 });

  response
    .status(200)
    .send({
      token,
      username: user.username,
    });
});

export default loginRouter;

