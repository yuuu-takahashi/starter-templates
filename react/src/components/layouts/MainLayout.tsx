import { Outlet } from 'react-router';

import { Header } from '@/components/layouts/parts/Header';

export const MainLayout = () => {
  return (
    <div>
      <h1>Main Layout</h1>
      <p>This is the Main Layout page.</p>
      <Header />
      <Outlet />
    </div>
  );
};
