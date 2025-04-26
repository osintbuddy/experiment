import { JSX } from "preact/jsx-runtime";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import AppLayout from "./components/AppLayout";
import { TourProvider } from "@reactour/tour";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
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
    <TourProvider
      onClickClose={({ setCurrentStep, currentStep, steps, setIsOpen }: any) => {
        setIsOpen(false)
        setCurrentStep(0)
      }}
      padding={{ mask: 10, popover: [5, 10], wrapper: 0 }}
      prevButton={({ currentStep, setCurrentStep, steps }: any) => {
        const first = currentStep === 0;
        return (
          <button
            className={`btn-primary !justify-between ${first && '!opacity-0'}`}
            onClick={() => { first ? setCurrentStep((s: number) => steps.length - 1) : setCurrentStep((s: number) => s - 1) }}
          >
            <ChevronLeftIcon className="w-5 h-5 !ml-0 mr-5" />
            <span>Back</span>
          </button>
        );
      }}
      nextButton={({
        currentStep,
        stepsLength,
        setIsOpen,
        setCurrentStep,
        steps,
      }: any) => {
        const last = currentStep === stepsLength - 1;
        return (
          <>
            <button
              onClick={() => last ? setIsOpen(false) : setCurrentStep((s: number) => s === steps?.length - 1 ? 0 : s + 1)}
              className="btn-primary"
            >
              <span>{!last ? "Next" : "Close guide"}</span>
              <ChevronRightIcon className="w-5 h-5 !ml-0" />
            </button >
          </>
        );
      }}
    >
      <RouterProvider router={router} />
    </TourProvider>
  );
}
