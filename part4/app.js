import express from 'express';
import mongoose from 'mongoose';
import config from './utils/config.js';
import logger from './utils/logger.js';
import middleware from './utils/middleware.js';
import blogRouter from './controllers/blogs.js';
import userRouter from './controllers/users.js';
import loginRouter from './controllers/login.js';

const app = express();
logger.info('connecting to', config.MONGO_URI);

mongoose
  .connect(config.MONGO_URI, { family: 4 })
  .then( () => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Unable to connect to MongoDB:', error.message);
  });
  
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);
app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;