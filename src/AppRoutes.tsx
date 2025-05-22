import { JSX } from "preact/jsx-runtime";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

import PublicLayout from "./components/PublicLayout";
import DatabasesPage from "./routes/DatabasesPage"

import AppLayout from "./components/AppLayout";
import DashboardPage from "./routes/DashboardPage";
import { useMountEffect } from "./app/hooks";


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
  useMountEffect(() => invoke('show_main_window'))
  return (
      <RouterProvider router={router} />
  );
}
