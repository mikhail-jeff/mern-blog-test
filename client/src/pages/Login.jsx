import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [redirect, setRedirect] = useState(false);
	const { setUserInfo } = useContext(UserContext);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleLogin = async () => {
		try {
			setLoading(true);

			// Basic validation
			if (!username || !password) {
				throw new Error("Please enter both username and password.");
			}

			const response = await fetch("http://localhost:4000/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
				credentials: "include",
			});

			if (response.ok) {
				const userInfo = await response.json();
				setUserInfo(userInfo);
				setRedirect(true);
			} else {
				const errorMessage = await response.text();
				throw new Error(errorMessage || "Login failed. Please try again later.");
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
		<form
			className="login"
			onSubmit={(e) => {
				e.preventDefault();
				handleLogin();
			}}>
			<h1>Login</h1>
			{error && <p className="error">{error}</p>}
			<input
				type="text"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				placeholder="username"
			/>
			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="password"
			/>
			<button
				type="submit"
				disabled={loading}>
				{loading ? "Logging in..." : "Login"}
			</button>
		</form>
	);
};

export default Login;
