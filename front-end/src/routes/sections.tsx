import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import { ProtectedRoute } from 'src/routes/ProtectedRoute';
import FazerCheckInPage from 'src/pages/cliente/fazer-check-in';
import ListarFuncionariosPage from 'src/pages/funcionario/listar-funcionarios';
import AlteracaoFuncionariosPage from 'src/pages/funcionario/alteracao-funcionarios';
import InserirFuncionarioPage from 'src/pages/funcionario/inserir-funcionarios';
import RemocaoFuncionarioPage from 'src/pages/funcionario/remocao-funcionarios';
import RealizarVooPage from 'src/pages/funcionario/realizar-voo'
import CancelarVooPage from 'src/pages/funcionario/cancelar-voo'
import { TelaInicialView } from 'src/sections/cliente/r03-mostrar-tela-inicial-cliente/cliente/view';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/cliente/home'));
export const ReservaPage = lazy(() => import('src/pages/cliente/reserva'));
export const UserPage = lazy(() => import('src/pages/cliente/tela-inicial'));
export const SignInPage = lazy(() => import('src/pages/cliente/login'));
export const ProductsPage = lazy(() => import('src/pages/cliente/milhas'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const AutoCadastroPage = lazy(() => import('src/pages/cliente/autocadastro'));
export const ExtratoMilhasPage = lazy(() => import('src/pages/cliente/extrato-milhas'));
export const ComprarMilhasView = lazy(() => import('src/sections/cliente/r05-comprar-milhas/comprar-milhas-view'));
export const FuncionarioTelaInicialPage = lazy(() => import('src/pages/funcionario/tela-inicial'));
export const CadastrarVooPage = lazy(() => import('src/pages/funcionario/cadastrar-voo'));

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
        { path: 'tela-inicial-cliente', element: <TelaInicialView /> },
        { path: 'efetuar-reserva', element: <ReservaPage /> },
        { path: 'extrato-milhas', element: <ExtratoMilhasPage /> },
        { path: 'check-in', element: <FazerCheckInPage /> },
        { path: 'tela-inicial-funcionario', element: <FuncionarioTelaInicialPage />},
        { path: 'cadastrar-voo', element: <CadastrarVooPage /> },
        { path: 'listar-funcionarios', element: <ListarFuncionariosPage /> },
        { path: 'alterar-funcionario', element: <AlteracaoFuncionariosPage /> },
        { path: 'inserir-funcionario', element: <InserirFuncionarioPage />},
        { path: 'remover-funcionario', element: <RemocaoFuncionarioPage />},
        { path: 'realizar-voo', element: <RealizarVooPage /> },
        { path: 'cancelar-voo', element: <CancelarVooPage />}
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
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}