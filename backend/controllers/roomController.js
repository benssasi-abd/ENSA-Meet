const Room = require("../models/Room");
const { v4: uuidv4 } = require("uuid");

exports.createRoom = async (req, res) => {
	const { name } = req.body;

	try {
		const roomId = uuidv4();
		const newRoom = new Room({ name:roomId, host: req.user.id });
		
		await newRoom.save();
		res.status(201).json(newRoom);
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

exports.getRooms = async (req, res) => {
	try {
		const rooms = await Room.find();
		res.json(rooms);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

exports.getRoomById = async (req, res) => {
	try {
		const room = await Room.findById(req.params.id);
		if (!room) return res.status(404).json({ message: "Room not found" });

		res.json(room);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};
