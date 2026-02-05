import 'dotenv/config';

const PORT = process.env.PORT;
const MONGO_URI = (process.env.NODE_ENV === 'test')
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI;

const SECRET = process.env.SECRET;

export default { PORT, MONGO_URI, SECRET };