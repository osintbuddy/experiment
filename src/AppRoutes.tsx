import { JSX } from "preact/jsx-runtime";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import PublicLayout from "./components/PublicLayout";
import DatabasesPage from "./routes/DatabasesPage"

import AppLayout from "./components/AppLayout";
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
