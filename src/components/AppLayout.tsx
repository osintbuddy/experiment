import { JSX } from 'preact/jsx-runtime';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

export default function PublicLayout(): JSX.Element {
  return (
    <>
      <main id="main">
        <Outlet />
      </main>
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
        theme='light'
      />
    </>
  );
}
