import mongoose, { SchemaType } from "mongoose";
import { SchemaTypes } from "mongoose";

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
		},
		summary: {
			type: String,
		},
		content: {
			type: String,
		},
		cover: {
			type: String,
		},
		author: {
			type: SchemaTypes.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
