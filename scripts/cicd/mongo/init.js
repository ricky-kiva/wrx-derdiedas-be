import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function initDB() {
  const rootUser = process.env.MONGO_ROOT_USER;
  const rootPassword = process.env.MONGO_ROOT_PASSWORD;
  const host = process.env.MONGO_HOST;
  const port = process.env.MONGO_PORT;
  const createDb = process.env.MONGO_DATABASE;
  const user = process.env.MONGO_USER;
  const password = process.env.MONGO_PASSWORD;

  if (!rootUser || !rootPassword || !host || !port || !createDb || !user || !password) {
    throw new Error('One or more required env. are missing to init. Mongo DB');
  }

  const encodedRootUser = encodeURIComponent(rootUser);
  const encodedRootPassword = encodeURIComponent(rootPassword);

  const rootUri = `mongodb://${encodedRootUser}:${encodedRootPassword}@${host}:${port}/admin`;
  const client = new MongoClient(rootUri);

  try {
    await client.connect();
    
    const db = client.db(createDb);
    
    const users = await db.command({ usersInfo: user });

    if (!users.users.length) {
      await db.command({ createUser: user, pwd: password, roles: [
        { role: 'dbOwner', db: createDb }
      ]});
      console.log(`User created successfully`);
    } else {
      console.log(`User already exists`);
    }

    console.log(`Database is ready`);
  } catch (err) {
    console.error(`Failed to initialize DB: ${err}`)
  } finally {
    await client.close();
  }
}

initDB();
