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
export const ReservaPage = lazy(() => import('src/pages/cliente/reserva'));
export const UserPage = lazy(() => import('src/pages/cliente/tela-inicial'));
export const SignInPage = lazy(() => import('src/pages/cliente/login'));
export const ProductsPage = lazy(() => import('src/pages/milhas'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const AutoCadastroPage = lazy(() => import('src/pages/cliente/autocadastro'));
export const ExtratoMilhasPage = lazy(() => import('src/pages/cliente/extrato-milhas'));
export const ComprarMilhasView = lazy(() => import('src/sections/cliente/r05-comprar-milhas/comprar-milhas-view'));



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
        { path: 'comprar-milhas', element: <ComprarMilhasView /> },
        { path: 'tela-inicial-cliente', element: <UserPage /> },
        { path: 'efetuar-reserva', element: <ReservaPage /> },
        { path: 'extrato-milhas', element: <ExtratoMilhasPage /> }
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