import { JSX } from 'preact/jsx-runtime';
import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';

export default function PublicLayout(): JSX.Element {
  return (
    <>
      <Outlet />
      <PublicNavbar />
    </>
  );
}
