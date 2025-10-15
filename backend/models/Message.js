const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
	{
		roomId: {
			type: String,
		},
		name: {
			type: String,
		},
		text: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
