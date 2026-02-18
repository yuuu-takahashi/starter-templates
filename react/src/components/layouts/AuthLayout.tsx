import { Outlet } from 'react-router';

import { Header } from '@/components/layouts/parts/Header';

export const AuthLayout = () => {
  return (
    <div>
      <h1>Auth Layout</h1>
      <p>This is the Auth Layout page.</p>
      <Header />
      <Outlet />
    </div>
  );
};
