import { BrowserRouter, Routes, Route } from 'react-router';

import { MainLayout, AuthLayout } from '@/components/layouts';
import {
  Top,
  About,
  Login,
  Register,
  NotFound,
  Post,
} from '@/components/pages';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Top />} />
          <Route element={<About />} path="/about" />
          <Route element={<Post />} path="/post/:postId" />
          <Route element={<NotFound />} path="*" />
        </Route>
        <Route element={<AuthLayout />}>
          <Route element={<Login />} path="/login" />
          <Route element={<Register />} path="/register" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
