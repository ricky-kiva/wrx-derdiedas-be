import mongoose from 'mongoose';
import config from '../../../commons/config';

export default async function connectToDatabase(): Promise<void> {
  const { user, password, host, port, database } = config.database.mongodb;

  const encodedUser = encodeURIComponent(user);
  const encodedPassword = encodeURIComponent(password);

  const uri = `mongodb://${encodedUser}:${encodedPassword}@${host}:${port}/${database}`;

  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected! (${database})`);
  } catch (e) {
    console.error(`MongoDB connection error: ${e}`);
    process.exit(1);
  }
};
