import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

const Header = () => {
	const { userInfo, setUserInfo } = useContext(UserContext);

	useEffect(() => {
		fetch("http://localhost:4000/profile", {
			credentials: "include",
		}).then((response) => {
			response.json().then((userInfo) => {
				setUserInfo(userInfo);
			});
		});
	}, [setUserInfo]);

	const logout = async () => {
		try {
			const response = await fetch("http://localhost:4000/logout", {
				credentials: "include",
				method: "POST",
			});

			if (!response.ok) {
				throw new Error(`Logout failed. Status: ${response.status}`);
			}

			setUserInfo(null);
		} catch (error) {
			console.error("Error during logout:", error);
			// Handle the error as needed, e.g., show an error message to the user.
		}
	};

	const username = userInfo?.username;

	return (
		<header>
			<Link
				to="/"
				className="logo">
				BLOGS
			</Link>
			<nav>
				{username && (
					<>
						<span className="username">Welcome, @{username}</span>
						<Link to="/create">Create</Link>
						<a onClick={logout}>Logout</a>
					</>
				)}
				{!username && (
					<>
						<Link to="/login">Login</Link>
						<Link to="/register">Register</Link>
					</>
				)}
			</nav>
		</header>
	);
};

export default Header;
