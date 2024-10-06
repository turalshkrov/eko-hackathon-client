import { Toaster } from "sonner";
import "./App.css";
import { BrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import router from "./config/routes";
import Modals from "./components/Modals";

function App() {
	return (
		<>
			<Toaster position="top-right" />
			<Suspense fallback={"Loading..."}>
				<RouterProvider router={router} />
			</Suspense>
		</>
	);
}

export default App;
