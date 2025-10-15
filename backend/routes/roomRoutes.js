const express = require("express");
const {
	createRoom,
	getRooms,
	getRoomById,
} = require("../controllers/roomController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authenticateToken, createRoom);
router.get("/", authenticateToken, getRooms);
router.get("/:id", authenticateToken, getRoomById);

module.exports = router;
