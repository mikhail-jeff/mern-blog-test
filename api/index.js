import express from "express";
import dotenv from "dotenv";
import chalk from "chalk";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { dirname } from "path";
import cookieParser from "cookie-parser";
dotenv.config();
import User from "./models/userModel.js";
import Post from "./models/postModel.js";
import connectDB from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 4000;
const secret = process.env.SECRET;
const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		credentials: true,
		methods: ["POST", "GET"],
		origin: ["http://localhost:5173"],
	})
);
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// *** REGISTER
app.post("/register", async (req, res) => {
	const { username, password } = req.body;

	try {
		const salt = bcrypt.genSaltSync(10);

		const user = await User.create({
			username,
			password: bcrypt.hashSync(password, salt),
		});

		res.status(201).json(user);
	} catch (error) {
		console.log(error);
		res.status(400).json(error.message);
	}
});

// *** LOGIN
app.post("/login", async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username });

		if (!user) {
			return res.status(400).json("User not found");
		}

		const passOk = bcrypt.compareSync(password, user.password);

		if (passOk) {
			jwt.sign({ username, id: user._id }, secret, { expiresIn: "1d" }, (err, token) => {
				if (err) {
					console.error(err);
					return res.status(500).json("Internal Server Error");
				}
				res.cookie("token", token).json({
					id: user._id,
					username,
				});
			});
		} else {
			res.status(400).json("Wrong credentials");
		}
	} catch (error) {
		console.error(error);
		res.status(500).json("Internal Server Error");
	}
});

// *** PROFILE
app.get("/profile", (req, res) => {
	const { token } = req.cookies;

	// Check if the token is missing
	if (!token) {
		console.log("Token missing");
		return res.status(401).json({ error: "Token missing" });
	}

	// Verify the token
	jwt.verify(token, secret, {}, (err, info) => {
		if (err) {
			// Handle different error scenarios
			if (err.name === "TokenExpiredError") {
				console.log("Token expired");
				return res.status(401).json({ error: "Token expired" });
			} else if (err.name === "JsonWebTokenError") {
				console.log("Invalid token");
				return res.status(401).json({ error: "Invalid token" });
			} else {
				console.log("Internal Server Error");
				return res.status(500).json({ error: "Internal Server Error" });
			}
		}

		// Token is valid, send the user information
		console.log("Token verified:", info);
		res.json(info);
	});
});

// *** LOGOUT
app.post("/logout", (req, res) => {
	try {
		res.clearCookie("token").json("ok");
	} catch (error) {
		console.error(error);
		res.status(500).json("Internal Server Error");
	}
});

// *** CREATE POST
app.post("/post", upload.single("file"), async (req, res) => {
	try {
		const { originalname, path } = req.file;
		const parts = originalname.split(".");
		const ext = parts[parts.length - 1];

		const newPath = path + "." + ext;
		fs.renameSync(path, newPath);

		const { token } = req.cookies;

		jwt.verify(token, secret, {}, async (err, info) => {
			if (err) throw err;

			const { title, summary, content } = req.body;
			const post = await Post.create({
				title,
				summary,
				content,
				cover: newPath,
				author: info.id,
			});

			res.json(post);
		});
	} catch (error) {
		console.error(error);
		res.status(500).json("Internal Server Error");
	}
});

// *** GET POSTS
app.get("/post", async (req, res) => {
	try {
		const posts = await Post.find().populate("author", ["username"]).sort({ createdAt: -1 }).limit(10);

		res.json(posts);
	} catch (error) {
		console.error(error);
		res.status(500).json("Internal Server Error");
	}
});

// *** GET SINGLE POST
app.get("/post/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const post = await Post.findById(id).populate("author", ["username"]);

		if (!post) {
			return res.status(404).json("Post not found");
		}

		res.json(post);
	} catch (error) {
		console.error(error);
		res.status(500).json("Internal Server Error");
	}
});

// *** UPDATE POST
app.put("/post", upload.single("file"), async (req, res) => {
	let newPath = null;

	if (req.file) {
		const { originalname, path } = req.file;
		const parts = originalname.split(".");
		const ext = parts[parts.length - 1];
		newPath = path + "." + ext;
		fs.renameSync(path, newPath);
	}

	const { token } = req.cookies;
	jwt.verify(token, secret, {}, async (err, info) => {
		if (err) throw err;

		const { id, title, summary, content } = req.body;

		try {
			const post = await Post.findById(id);

			if (!post) {
				return res.status(404).json("Post not found");
			}

			const isAuthor = JSON.stringify(post.author) === JSON.stringify(info.id);

			if (!isAuthor) {
				return res.status(400).json("You are not the author");
			}

			post.title = title;
			post.summary = summary;
			post.content = content;
			post.cover = newPath ? newPath : post.cover;

			await post.save();

			res.json(post);
		} catch (error) {
			console.error(error);
			res.status(500).json("Internal Server Error");
		}
	});
});

// *** DELETE POST
app.delete("/post/:id", async (req, res) => {
	const { id } = req.params;
	console.log("Deleting post with ID:", id);
	const { token } = req.cookies;

	jwt.verify(token, secret, {}, async (err, info) => {
		if (err) {
			return res.status(401).json({ error: "Invalid token" });
		}

		try {
			console.log("Deleting post with ID:", id);
			const post = await Post.findById(id);

			if (!post) {
				return res.status(404).json("Post not found");
			}

			const isAuthor = JSON.stringify(post.author) === JSON.stringify(info.id);

			if (!isAuthor) {
				return res.status(400).json("You are not the author");
			}

			// Delete the post
			await Post.deleteOne({ _id: post._id });

			// Optionally, you may want to remove the associated file if it exists
			if (post.cover) {
				fs.unlinkSync(post.cover);
			}

			res.json({ message: "Post deleted successfully" });
		} catch (error) {
			console.error(error);
			res.status(500).json("Internal Server Error");
		}
	});
});

const startServer = async () => {
	try {
		await connectDB();
		app.listen(PORT, () => {
			console.log(chalk.cyanBright.bold(`Server running on port http://localhost:${PORT}`));
		});
	} catch (error) {
		console.log(chalk.redBright.bold(error));
	}
};

startServer();
