import { JSX } from "preact/jsx-runtime";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import AppLayout from "./components/AppLayout";
// import { TourProvider } from "@reactour/tour";
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import LandingPage from "./LandingPage"


const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {

        path: "",
        element: <LandingPage />,
      },
    ],
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
    ]
  }
]);


export default function AppRoutes(): JSX.Element {
  return (
   
      <RouterProvider router={router} />
  );
}
