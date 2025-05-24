import { JSX } from 'preact/jsx-runtime';
import { Outlet } from 'react-router-dom';

export default function PublicLayout(): JSX.Element {
  return (
    <>
      <main id="main">
        <Outlet />
      </main>

    </>
  );
}
