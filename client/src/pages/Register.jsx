import { useState } from "react";
import { Navigate } from "react-router-dom";

const Register = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [redirect, setRedirect] = useState(false);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleRegister = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);

			// Basic validation
			if (!username || !password) {
				throw new Error("Please enter both username and password.");
			}

			const response = await fetch("http://localhost:4000/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});

			if (response.ok) {
				const confirmed = window.confirm("Registration successful. Do you want to proceed to login?");
				if (confirmed) {
					setRedirect(true);
				} else {
					// Clear username and password if the user clicks "No"
					setUsername("");
					setPassword("");
				}
			} else {
				throw new Error("Registration failed.");
			}
		} catch (error) {
			setError(error.message);
			setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
		} finally {
			setLoading(false);
		}
	};

	if (redirect) {
		return <Navigate to="/login" />;
	}

	return (
		<form
			className="register"
			onSubmit={handleRegister}>
			<h1>Register</h1>
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
				{loading ? "Registering..." : "Register"}
			</button>
		</form>
	);
};

export default Register;
