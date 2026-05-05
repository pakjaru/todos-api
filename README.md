# Blog Platform API

> A RESTful backend service for managing todo list with ownership, and authorization.

---

## 📖 Project Description

Blog Platform API is a RESTful backend service for managing todo list with ownership and authorization. It provides endpoints to create, read, update, and delete tasks.

---

## 🛠 Tech Stack

| Layer         | Technology         |
| ------------- | ------------------ |
| Runtime       | Node.js            |
| Framework     | Express.js         |
| Database      | PostgreSQL         |
| Query Builder | pg (node-postgres) |

---

## ⚙️ How to Setup Locally

### Prerequisites

- Node.js v18+
- PostgreSQL v14+
- pnpm

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Copy `.env.example` file to `.env` file in the root directory:

```env
PORT=your_api_port_here
JWT_SECRET=your_super_secret_key_here
JWT_REFRESH_SECRET=your_super_secret_key_here
POSTGRES_HOST=your_api_host_here
POSTGRES_PORT=your_db_port_here
POSTGRES_USER=your_db_username_here
POSTGRES_PASSWORD=your_db_password_here
POSTGRES_DATABASE=your_db_name_here
```

### 3. Run the Server

```bash
pnpm run dev   # development
pnpm start     # production
```

---

## 📡 API Endpoints

**Base URL:** `http://localhost:3000/api`

### Endpoints Overview

| Method   | Path                | Description             |
| -------- | ------------------- | ----------------------- |
| `GET`    | `/tasks`            | Get all tasks with tags |
| `GET`    | `/tasks/:id`        | Get a single task by ID |
| `POST`   | `/tasks`            | Create a new task       |
| `PUT`    | `/tasks/:id`        | Update a task           |
| `DELETE` | `/tasks/:id`        | Delete a task           |
| `PATCH`  | `/tasks/:id/finish` | Finish a task           |

---

### GET `/api/tasks`

Returns a list of all tasks of current login user.

**Response**

```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": 1,
      "content": "Hello world!",
      "owner_id": 1
    },
    {
      "id": 2,
      "content": "...",
      "owner_id": 1
    }
  ]
}
```

---

### GET `/api/tasks/:id`

Returns a single task by its ID of current login user.

**Response**

```json
{
  "success": true,
  "message": "Task with id 1 retrieved successfully",
  "data": {
    "id": 1,
    "content": "Hello world!",
    "owner_id": 1
  }
}
```

---

### POST `/api/tasks`

Creates a new task and links it to the provided tag IDs.

**Request Body**

```json
{
  "task": {
    "title": "My New Task",
    "content": "This is the content.",
    "owner_id": 1
  }
}
```

**Response**

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 5,
    "content": "This is the content.",
    "owner_id": 1
  }
}
```

---

### PUT `/api/tasks/:id`

Updates an existing task.

**Request Body**

```json
{
  "task": {
    "content": "Updated content.",
    "owner_id": 1
  }
}
```

**Response**

```json
{
  "success": true,
  "message": "Task with id 1 updated successfully",
  "data": {
    "id": 1,
    "content": "Updated content updated.",
    "owner_id": 1
  }
}
```

---

### DELETE `/api/tasks/:id`

Deletes a task by ID.

**Response**

```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": null
}
```

---

## 📝 Notes

- All responses are in JSON format.
- Use transactions when creating or updating tasks to ensure data consistency.
