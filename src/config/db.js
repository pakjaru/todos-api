const { Pool } = require("pg");

const host = process.env.POSTGRES_HOST;
const port = process.env.POSTGRES_PORT;
const user = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;
const database = process.env.POSTGRES_DATABASE;

const pool = new Pool({ user, host, database, password, port });
pool.connect((err, client, release) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    release();
    console.log("Database connected successfully");
  }
});

module.exports = pool;
