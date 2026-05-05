const db = require("../config/db");

const User = {
  async createUser({ username, name, email, password }) {
    const { rows } = await db.query(
      "INSERT INTO users (username, name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, username, name, email",
      [username, name, email, password],
    );

    return rows[0];
  },

  async getUser({ username, email }) {
    if (!username && !email) return null;

    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (username) {
      conditions.push(`username = $${paramIndex}`);
      params.push(username);
      paramIndex++;
    }

    if (email) {
      conditions.push(`email = $${paramIndex}`);
      params.push(email);
      paramIndex++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" OR ")}` : "";
    const { rows } = await db.query(
      `SELECT * FROM users ${whereClause}`,
      params,
    );

    const user = rows[0];
    if (!user) return null;

    return user;
  },
};

module.exports = User;
