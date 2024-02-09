import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../components/Editor";

const EditPost = () => {
	const { id } = useParams();
	const [title, setTitle] = useState("");
	const [summary, setSummary] = useState("");
	const [content, setContent] = useState("");
	const [files, setFiles] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true); // Set initial loading state to true
	const [redirect, setRedirect] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`http://localhost:4000/post/${id}`);

				if (!response.ok) {
					throw new Error("Failed to fetch post data");
				}

				const postInfo = await response.json();
				setTitle(postInfo.title);
				setContent(postInfo.content);
				setSummary(postInfo.summary);
				setLoading(false); // Set loading to false after successful data fetch
			} catch (error) {
				console.error(error);
				setError("Error fetching post data. Please try again later.");
				setLoading(false); // Set loading to false on error
			}
		};

		fetchData();
	}, [id]);

	const updatePost = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);

			const data = new FormData();
			data.set("title", title);
			data.set("summary", summary);
			data.set("content", content);
			data.set("id", id);

			if (files?.[0]) {
				data.set("file", files?.[0]);
			}

			const response = await fetch(`http://localhost:4000/post/`, {
				method: "PUT",
				body: data,
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Failed to update post. Please try again later.");
			}

			setRedirect(true);
		} catch (error) {
			console.error(error);
			setError("Error updating post. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p className="error">{error}</p>;
	}

	if (redirect) {
		return <Navigate to={`/post/${id}`} />;
	}

	return (
		<form onSubmit={updatePost}>
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

			<button
				type="submit"
				className="create-btn"
				disabled={loading}>
				{loading ? "Updating..." : "Update Post"}
			</button>
		</form>
	);
};

export default EditPost;
