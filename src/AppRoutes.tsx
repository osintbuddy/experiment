import { JSX } from "preact/jsx-runtime";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import AppLayout from "./components/AppLayout";
// import { TourProvider } from "@reactour/tour";
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import DatabasesPage from "./routes/LandingPage"
import DashboardPage from "./routes/DashboardPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {

        path: "",
        element: <DatabasesPage />,
      },
    ],
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />
      }
    ]
  }
]);


export default function AppRoutes(): JSX.Element {
  return (
      <RouterProvider router={router} />
  );
}
