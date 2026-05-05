const Task = require("../models/task.model");
const checkIsIdValid = require("../utils/checkIsIdValid");

const TaskController = {
  async getAllTasks(req, res) {
    const search = (req.query.search || "").trim();

    try {
      const tasks = await Task.getAllTasks(req.user.id, { search });
      res.json({
        success: true,
        message: "Tasks retrieved successfully",
        data: tasks,
      });
    } catch (error) {
      console.error("getAllTasks error:", error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        data: null,
      });
    }
  },

  async getTaskById(req, res) {
    const id = parseInt(req.params.id, 10);

    if (!checkIsIdValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Wrong params id",
        data: null,
      });
    }

    try {
      const task = await Task.getTaskById(req.user.id, id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: `Task with id ${id} not found`,
          data: null,
        });
      }

      res.json({
        success: true,
        message: `Task with id ${id} retrieved successfully`,
        data: task,
      });
    } catch (error) {
      console.error("getTaskById error:", error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        data: null,
      });
    }
  },

  async createTask(req, res) {
    const { task } = req.body || {};

    if (!task) {
      return res.status(400).json({
        success: false,
        message: "Field missing: 'task' object is required",
        data: null,
      });
    }

    const { content } = task;

    if (!content?.toString().trim()) {
      return res.status(400).json({
        success: false,
        message: "Field missing: 'content'",
        data: null,
      });
    }

    try {
      const createdTask = await Task.createTask(req.user.id, { content });

      res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: createdTask,
      });
    } catch (error) {
      console.error("createTask error:", error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        data: null,
      });
    }
  },

  async updateTaskById(req, res) {
    const id = parseInt(req.params.id, 10);

    if (!checkIsIdValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Wrong params id",
        data: null,
      });
    }

    const { task } = req.body || {};

    if (!task) {
      return res.status(400).json({
        success: false,
        message: "Field missing: 'task' object is required",
        data: null,
      });
    }

    const { content } = task;

    if (!content?.toString().trim()) {
      return res.status(400).json({
        success: false,
        message: "Field missing: 'content'",
        data: null,
      });
    }

    try {
      const updatedTask = await Task.updateTaskById(req.user.id, id, {
        content,
      });

      if (updatedTask === null) {
        return res.status(404).json({
          success: false,
          message: `Task with id ${id} not found`,
          data: null,
        });
      }

      if (updatedTask === false) {
        return res.json({
          success: true,
          message: `Task with id ${id} not updated, updated data same as origin data`,
          data: null,
        });
      }

      res.json({
        success: true,
        message: `Task with id ${id} updated successfully`,
        data: updatedTask,
      });
    } catch (error) {
      console.error("updateTaskById error:", error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        data: null,
      });
    }
  },

  async deleteTaskById(req, res) {
    const id = parseInt(req.params.id, 10);

    if (!checkIsIdValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Wrong params id",
        data: null,
      });
    }

    try {
      const isDeleted = await Task.deleteTaskById(req.user.id, id);

      if (!isDeleted) {
        return res.status(404).json({
          success: false,
          message: `Task with id ${id} not found`,
          data: null,
        });
      }

      res.json({
        success: true,
        message: `Task with id ${id} deleted successfully`,
        data: null,
      });
    } catch (error) {
      console.error("deleteTaskById error:", error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        data: null,
      });
    }
  },

  async finishTaskById(req, res) {
    const id = parseInt(req.params.id, 10);

    if (!checkIsIdValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Wrong params id",
        data: null,
      });
    }

    try {
      const updatedTask = await Task.finishTaskById(req.user.id, id);

      if (updatedTask === null) {
        return res.status(404).json({
          success: false,
          message: `Task with id ${id} not found`,
          data: null,
        });
      }

      if (updatedTask === false) {
        return res.status(409).json({
          success: false,
          message: `Task with id ${id} is already finished`,
          data: null,
        });
      }

      res.json({
        success: true,
        message: `Task with id ${id} finished successfully`,
        data: null,
      });
    } catch (error) {
      console.error("finishTaskById error:", error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        data: null,
      });
    }
  },
};

module.exports = TaskController;
