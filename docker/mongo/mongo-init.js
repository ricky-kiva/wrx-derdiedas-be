print("[DEBUG] Running mongo-init.js");

const user = process.env.MONGO_USER;
const pwd = process.env.MONGO_PASSWORD;
const initDb = process.env.MONGO_INITDB_DATABASE;

db.createUser({ user, pwd, roles: [{ role: "dbOwner", db: initDb }]});

print("[DEBUG] Finished mongo-init.js");
