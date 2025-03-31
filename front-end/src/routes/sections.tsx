import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import { ProtectedRoute } from 'src/routes/ProtectedRoute';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/cliente/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/cliente/login'));
export const ProductsPage = lazy(() => import('src/pages/milhas'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const AutoCadastroPage = lazy(() => import('src/pages/cliente/autocadastro'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        { element: <HomePage />, index: true },
        { path: 'comprar-milhas', element: <ProductsPage /> },
        { path: 'tela-inicial-cliente', element: <UserPage /> },
        { path: 'efetuar-reserva', element: <BlogPage /> }
      ],
    },
    {
      path: 'login',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },

    /* Informa ao React Router que quando o usuário acessar /autocadastro, a aplicação 
       deve carregar a página AutoCadastroPage, que por sua vez renderiza AutoCadastroView.
    */
    {
      path: 'autocadastro',
      element: <AutoCadastroPage />, 
    },    

    {
      path: 'check-in',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
