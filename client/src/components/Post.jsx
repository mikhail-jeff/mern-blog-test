import { format } from "date-fns";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Post = ({ _id, title, summary, cover, createdAt, author }) => {
	return (
		<div className="post">
			<div className="image">
				<Link to={`/post/${_id}`}>
					<img
						src={`http://localhost:4000/${cover}`}
						alt={title}
					/>
				</Link>
			</div>
			<div className="texts">
				<Link to={`/post/${_id}`}>
					<h2 className="post-title">{title}</h2>
				</Link>
				<p className="info">
					<a className="author">@{author.username}</a>
					<time> {format(new Date(createdAt), "eee MMM dd, yyyy HH:mm")}</time>
				</p>
				<p className="summary">{summary}</p>
			</div>
		</div>
	);
};

Post.propTypes = {
	_id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	summary: PropTypes.string.isRequired,
	content: PropTypes.string.isRequired,
	cover: PropTypes.string.isRequired,
	createdAt: PropTypes.string.isRequired,
	author: PropTypes.shape({
		username: PropTypes.string.isRequired,
	}).isRequired,
};

export default Post;
