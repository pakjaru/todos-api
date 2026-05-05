const db = require("../config/db");

const Task = {
  async getAllTasks(userId, { search }) {
    const conditions = ["owner_id = $1"];
    const params = [userId];
    let paramIndex = 2;

    if (search.length > 0) {
      conditions.push(`content ILIKE $${paramIndex}`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.join(" AND ");

    const { rows } = await db.query(
      `SELECT * FROM tasks WHERE ${whereClause} ORDER BY created_at DESC`,
      params,
    );
    return rows;
  },

  async getTaskById(userId, id) {
    const { rows } = await db.query(
      "SELECT * FROM tasks WHERE owner_id = $1 AND id = $2",
      [userId, id],
    );

    if (rows.length === 0) return null;

    return rows[0];
  },

  async createTask(userId, { content }) {
    const { rows } = await db.query(
      "INSERT INTO tasks (owner_id, content) VALUES ($1, $2) RETURNING *",
      [userId, content],
    );

    return rows[0];
  },

  async updateTaskById(userId, id, { content }) {
    const task = await this.getTaskById(userId, id);

    if (!task) return null;
    if (task.content === content) return false;

    await db.query(
      "UPDATE tasks SET content = $1, updated_at = NOW() WHERE owner_id = $2 AND id = $3",
      [content, userId, id],
    );
    return await this.getTaskById(userId, id);
  },

  async deleteTaskById(userId, id) {
    const { rowCount } = await db.query(
      "DELETE FROM tasks WHERE owner_id = $1 AND id = $2",
      [userId, id],
    );

    return rowCount > 0;
  },

  async finishTaskById(userId, id) {
    const task = await this.getTaskById(userId, id);

    if (!task) return null;
    if (task.finished_at) return false;

    await db.query(
      "UPDATE tasks SET finished_at = NOW() WHERE owner_id = $1 AND id = $2",
      [userId, id],
    );

    return await this.getTaskById(userId, id);
  },
};

module.exports = Task;
