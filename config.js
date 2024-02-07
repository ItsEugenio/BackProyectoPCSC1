import { config } from "dotenv";
config();

export default {
  mongodbURL: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/usersGame',
};
