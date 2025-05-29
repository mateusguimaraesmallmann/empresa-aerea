import { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { useRouter } from 'src/routes/hooks';

function ComprarMilhasView() {
  const [milhas, setMilhas] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const router = useRouter();

  const valorPorMilha = 5;

  const handleCompra = async () => {
    try {
      const id = localStorage.getItem('cliente_codigo'); // Simulado via localStorage
      if (!id) throw new Error('Cliente não identificado');

      const { atualizarMilhasCliente } = await import('src/api/milha');
      await atualizarMilhasCliente(Number(id), milhas);

      setSnackbarMessage('Compra registrada com sucesso!');
      setOpenSnackbar(true);
      setMilhas(0);
    } catch (err) {
      setSnackbarMessage('Erro ao comprar milhas.');
      setOpenSnackbar(true);
    }
  };

  const handleIrParaExtrato = () => {
    router.push('/extrato-milhas'); // redirecionamento correto
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <DashboardContent>
      <Typography variant="h4" mb={4} gutterBottom>
        Comprar Milhas
      </Typography>

      <Box
        sx={{
          backgroundColor: 'white',
          p: 3,
          borderRadius: 2,
          width: '100%',
        }}
      >
        <Grid container spacing={3} maxWidth={500}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Quantidade de Milhas"
              type="number"
              fullWidth
              value={milhas}
              onChange={(e) => setMilhas(Number(e.target.value))}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">
              Valor total: R$ {(milhas * valorPorMilha).toFixed(2)}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2}>
              <Button variant="contained" color="primary" onClick={handleCompra}>
                Confirmar Compra
              </Button>
              <Button variant="contained" color="primary" onClick={handleIrParaExtrato}>
                Visualizar Extrato de Milhas
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          elevation={6}
          variant="filled"
          sx={{
            backgroundColor: '#d0f2d0',
            color: '#1e4620',
            width: '100%',
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}

export default ComprarMilhasView;