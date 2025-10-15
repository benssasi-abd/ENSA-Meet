const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const roomRoutes = require("./routes/roomRoutes");
const authRoutes = require("./routes/authRoutes");

const dotenv = require("dotenv");

const app = express();
const server = http.createServer(app);
// const io = socketIo(server);

app.use(
	cors({
		origin: "http://127.0.0.1:3000",
		methods: ["GET", "POST"],
		credentials: true,
	})
);

const io = socketIo(server, {
	cors: {
		origin: "http://127.0.0.1:3000",
		methods: ["GET", "POST"],
	},
});
app.use(express.json());

app.use("/api/rooms", roomRoutes);
app.use("/api/auth", authRoutes);

dotenv.config();
connectDB();

// Store messages in memory for simplicity
// let messages = [];
const Message = require("./models/Message");

io.on("connection", (socket) => {
	console.log("🟢 A user connected: ", socket.id);

	// Send existing messages to the newly connected user

	socket.on("join-room", async (roomId, userName) => {
		socket.join(roomId);
		socket.roomId = roomId;
		console.log(`${userName} joined room ${roomId}`);

		const history = await Message.find({ roomId }).sort({ createdAt: 1 });
		socket.emit("chat history", history);

		socket.to(roomId).emit("user-joined", userName);
	});

	// Listen for new messages
	socket.on("send message", async ({ roomId, text, name }) => {
		try {
			const newMessage = new Message({
				roomId,
				text,
				name,
			});
			await newMessage.save();

			io.to(roomId).emit("receive message", newMessage);
		} catch (err) {
			console.error("Failed to save message:", err);
		}
	});

	socket.on("disconnect", () => {
		console.log("🔴 User disconnected: ", socket.id);
	});
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
