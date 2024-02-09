import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserContextProvider } from "./UserContext";
import CreatePost from "./pages/CreatePost";
import SinglePost from "./pages/SinglePost";
import EditPost from "./pages/EditPost";

function App() {
	return (
		<UserContextProvider>
			<Routes>
				<Route
					path="/"
					element={<Layout />}>
					<Route
						index
						element={<Home />}
					/>
					<Route
						path="/login"
						element={<Login />}
					/>
					<Route
						path="/register"
						element={<Register />}
					/>
					<Route
						path="/create"
						element={<CreatePost />}
					/>
					<Route
						path="/post/:id"
						element={<SinglePost />}
					/>
					<Route
						path="/edit/:id"
						element={<EditPost />}
					/>
				</Route>
			</Routes>
		</UserContextProvider>
	);
}

export default App;
