import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const user = process.env.DB_USER;
const host = process.env.DB_HOST;
const database = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;
const port = process.env.DB_PORT;

const db = new pg.Client({
  user: user,
  host: host,
  database: database,
  password: password,
  port: port,
});

db.connect()
  .then(() => console.log("Connected to the database successfully"))
  .catch((err) =>
    console.error("Error connecting to the database", err.message)
  );

export default db;
