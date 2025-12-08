print("[DEBUG] Running mongodb/init.js");

const user = process.env.MONGO_USER;
const pwd = process.env.MONGO_PASSWORD;
const initDb = process.env.MONGO_DATABASE;

db = db.getSiblingDB(initDb);

db.createUser({ user, pwd, roles: [{ role: "dbOwner", db: initDb }]});

print("[DEBUG] Finished mongodb/init.js");
