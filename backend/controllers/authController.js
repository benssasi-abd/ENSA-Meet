const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
	const { name, email, password } = req.body;


	try {
		let user = await User.findOne({ email });
		if (user) return res.status(400).json({ message: "User already exists" });
		user = new User({ name, email, password: password });

		await user.save();

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});
		res.status(201).json({ token, user: { id: user._id, name, email } });
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

exports.login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ message: "Invalid credentials" });

		const isMatch = await bcrypt.compare(password, user.password);
		
		if (!isMatch)
			return res.status(400).json({ message: "Invalid credentials" });

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});
		res.json({ token, user: { id: user._id, name: user.name, email } });
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

exports.getUser = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		res.json(user);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};
