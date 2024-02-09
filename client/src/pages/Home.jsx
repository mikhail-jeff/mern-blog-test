import { useEffect, useState } from "react";
import Post from "../components/Post";

const Home = () => {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		fetch("http://localhost:4000/post").then((response) => {
			response.json().then((posts) => {
				setPosts(posts);
			});
		});
	}, []);

	return (
		<>
			{posts.length > 0 ? (
				posts.map((post) => (
					<Post
						key={post._id}
						{...post}
					/>
				))
			) : (
				<p className="no-post">No posts available.</p>
			)}
		</>
	);
};

export default Home;
