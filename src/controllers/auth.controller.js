const bcrypt = require("bcrypt");

const User = require("../models/user.model");
const checkAuthFields = require("../utils/checkAuthFields");
const checkMissingFields = require("../utils/checkMissingFields");
const generateToken = require("../utils/generateToken");

const AuthController = {
  async register(req, res) {
    const { user } = req.body || {};

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Field missing: 'user' object is required",
        data: null,
      });
    }

    const { username, name, email, password } = user;
    const missingFields = checkMissingFields({
      username,
      name,
      email,
      password,
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Field missing: ${missingFields.join(", ")}`,
        data: null,
      });
    }

    const invalidFields = checkAuthFields({ username, email, password });
    if (Object.keys(invalidFields).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Fields invalid",
        data: invalidFields,
      });
    }

    try {
      const lowercasedEmail = email.toLowerCase().trim();
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.createUser({
        username,
        name,
        email: lowercasedEmail,
        password: hashedPassword,
      });
      res.status(201).json({
        success: true,
        message: `User created successfully with id ${user.id}`,
        data: user,
      });
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json({
          success: false,
          message: "Username or email already exists",
          data: null,
        });
      }

      console.error("register error:", error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        data: null,
      });
    }
  },

  async login(req, res) {
    const { user } = req.body || {};

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Field missing: 'user' object is required",
        data: null,
      });
    }

    const { username, email, password } = user;
    const usernameAndEmail = username || email;
    const missingFields = checkMissingFields({
      username_or_email: usernameAndEmail,
      password,
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Field missing: ${missingFields.join(", ")}`,
        data: null,
      });
    }

    try {
      const lowercasedEmail = email?.toLowerCase().trim();

      const user = await User.getUser({ username, email: lowercasedEmail });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or email or password",
          data: null,
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or email or password",
          data: null,
        });
      }

      const token = generateToken(user);

      res.json({
        success: true,
        message: "Login successful",
        data: {
          token,
        },
      });
    } catch (error) {
      console.error("login error:", error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        data: null,
      });
    }
  },
};

module.exports = AuthController;
