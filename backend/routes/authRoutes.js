const express = require("express");
const { register, login, getUser } = require("../controllers/authController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", authenticateToken, getUser);

module.exports = router;
