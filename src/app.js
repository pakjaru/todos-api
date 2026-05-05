require("dotenv").config();

const requiredEnvs = [
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "POSTGRES_HOST",
  "POSTGRES_PORT",
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  "POSTGRES_DATABASE",
];

requiredEnvs.forEach((key) => {
  if (process.env[key] === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

require("./config/db");
const authMiddleware = require("./middlewares/auth.middleware");
const authRoutes = require("./routes/auth.route");
const taskRoutes = require("./routes/task.route");

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", authMiddleware, taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
