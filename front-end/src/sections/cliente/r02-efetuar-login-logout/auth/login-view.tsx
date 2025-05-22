import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import schemaLogin from 'src/hooks/formularios/cliente/login';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { useAuth } from 'src/context/AuthContext';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';

interface LoginFormInputs {
  login: string;
  password: string;
}

export function SignInView() {
  const router = useRouter();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarTipo, setSnackbarTipo] = useState<'success' | 'error'>('error');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schemaLogin),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data.login, data.password);
    } catch (error) {
      // Mensagem de erro caso o AuthContext lance erro 
      setSnackbarTipo('error');
      setSnackbarMessage('Usuário ou senha inválidos.');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h4" textAlign="center">
          Empresa Aérea
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Não tem uma conta?
          <Link
            variant="subtitle2"
            sx={{ ml: 0.5, cursor: 'pointer' }}
            onClick={() => router.push('/autocadastro')}
          >
            Cadastre-se!
          </Link>
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
      >
        <TextField
          fullWidth
          label="E-mail"
          {...register('login')}
          error={!!errors.login}
          helperText={errors.login?.message}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="contained"
        >
          Login
        </LoadingButton>
      </Box>

      {/* Snackbar de erro ou sucesso */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarTipo}
          sx={{
            backgroundColor: snackbarTipo === 'error' ? '#fddede' : '#d0f2d0',
            color: snackbarTipo === 'error' ? '#611a15' : '#1e4620',
            width: '100%',
          }}
          elevation={6}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

