import { Toaster } from "sonner";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import router from "./config/routes";

function App() {
	return (
		<>
			<Toaster position="top-right" richColors />
			<Suspense fallback={"Loading..."}>
				<RouterProvider router={router} />
			</Suspense>
		</>
	);
}

export default App;
