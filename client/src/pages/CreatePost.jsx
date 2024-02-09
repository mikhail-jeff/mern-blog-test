import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../components/Editor";

const CreatePost = () => {
	const [title, setTitle] = useState("");
	const [summary, setSummary] = useState("");
	const [content, setContent] = useState("");
	const [files, setFiles] = useState("");
	const [redirect, setRedirect] = useState(false);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const createNewPost = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);

			const data = new FormData();
			data.set("title", title);
			data.set("summary", summary);
			data.set("content", content);

			// Check if files array is not empty before setting it in FormData
			if (files && files[0]) {
				data.set("file", files[0]);
			}

			const response = await fetch("http://localhost:4000/post", {
				method: "POST",
				body: data,
				credentials: "include",
			});

			if (response.ok) {
				setRedirect(true);
			} else {
				throw new Error("Failed to create post. Please try again later.");
			}
		} catch (error) {
			setError(error.message);
			setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
		} finally {
			setLoading(false);
		}
	};

	if (redirect) {
		return <Navigate to="/" />;
	}

	return (
		<form onSubmit={createNewPost}>
			<input
				type="text"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Title"
			/>
			<input
				type="text"
				value={summary}
				onChange={(e) => setSummary(e.target.value)}
				placeholder="Summary"
			/>
			<input
				type="file"
				onChange={(e) => setFiles(e.target.files)}
			/>
			<Editor
				value={content}
				onChange={setContent}
			/>
			{error && <p className="error">{error}</p>}
			<button
				type="submit"
				className="create-btn"
				disabled={loading}>
				{loading ? "Creating..." : "Create Post"}
			</button>
		</form>
	);
};

export default CreatePost;
