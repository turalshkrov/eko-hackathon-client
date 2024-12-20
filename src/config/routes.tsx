import { createBrowserRouter } from "react-router-dom";

import { Home, Login, Park, Signup } from "../pages";
import { Plant } from "../pages/Plant/Plant";
import { Parks } from "../pages/Parks";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "login",
		element: <Login />,
	},
	{
		path: "signup",
		element: <Signup />,
	},
	{
		path: "parks/:id",
		element: <Park />,
	},
	{
		path: "parks",
		element: <Parks />,
	},
	{
		path: "/plants/:id",
		element: <Plant />,
	},
]);

export default router;
