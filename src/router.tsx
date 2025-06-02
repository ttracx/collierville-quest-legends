import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Index from './pages/Index';
import GenerateAvatars from './pages/GenerateAvatars';
import NotFound from './pages/NotFound';

/**
 * Application routing configuration
 * Implements proper React Router DOM integration
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
    errorElement: <NotFound />
  },
  {
    path: '/avatars',
    element: <GenerateAvatars />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export const AppRouter = () => <RouterProvider router={router} />;