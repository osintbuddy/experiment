import { ToastContainer } from "react-toastify";
import AppRoutes from "./AppRoutes";
import "./index.css";

function App() {
  return (
    <>
    <AppRoutes />
    <ToastContainer
        aria-label=""
        position='bottom-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />
    </>
  );
}

export default App;
