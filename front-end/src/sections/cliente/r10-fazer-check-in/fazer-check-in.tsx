import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { DashboardContent } from 'src/layouts/dashboard';
import { Label } from 'src/components/label';

export function FazerCheckIn() {
  const [voos, setVoos] = useState<any[]>([]);
  const [reservas, setReservas] = useState<any[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const agora = new Date();
  const daqui48h = new Date(agora.getTime() + 48 * 60 * 60 * 1000);

  useEffect(() => {
    const voosLS = JSON.parse(localStorage.getItem('voos') || '[]');
    const reservasLS = JSON.parse(localStorage.getItem('reservas') || '[]');
    setVoos(voosLS);
    setReservas(reservasLS);
  }, []);

  const fazerCheckIn = (codigoVoo: string, codigoReserva: string) => {

    // Atualiza reserva específica
    const reservasAtualizadas = reservas.map((reserva) =>
      reserva.codigo === codigoReserva ? { ...reserva, estado: 'CHECK-IN' } : reserva
    );
    localStorage.setItem('reservas', JSON.stringify(reservasAtualizadas));
    setReservas(reservasAtualizadas);

    setSnackbarMsg(`Check-in realizado com sucesso para a reserva ${codigoReserva}`);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  // Renderizar um card por reserva com voo em até 48h
  const reservasParaCheckIn = reservas.filter((reserva) => {
    const vooData = new Date(reserva.voo?.dataHora);
    return (
      reserva.estado === 'CRIADA' &&
      reserva.voo &&
      vooData >= agora &&
      vooData <= daqui48h &&
      reserva.voo.estado === 'CONFIRMADO'
    );
  });

  const renderCard = (reserva: any) => {
    const voo = reserva.voo;

    return (
      <Grid item xs={12} md={6} key={`${voo.codigo}-${reserva.codigo}`}>
        <Paper sx={{ p: 3, height: '100%', border: '1px solid #ccc', boxShadow: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle1">
              <strong>Voo {voo.codigo}</strong>
            </Typography>
            <Label color="primary">Reserva: {reserva.codigo}</Label>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="body2" color="text.secondary">
            <strong>Origem:</strong> {voo.origem}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Destino:</strong> {voo.destino}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Data/Hora:</strong> {new Date(voo.dataHora).toLocaleString('pt-BR')}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Preço:</strong> R$ {voo.preco}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Milhas:</strong> {voo.milhas}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Poltronas:</strong> {voo.poltronas}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Status:</strong> {voo.estado}
              </Typography>
            </Grid>
          </Grid>

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={() => fazerCheckIn(voo.codigo, reserva.codigo)}
            >
              Fazer Check-in
            </Button>
          </Box>
        </Paper>
      </Grid>
    );
  };

  return (
    <>
      <Helmet>
        <title>Fazer Check-in</title>
      </Helmet>

      <DashboardContent>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5">Fazer Check-in</Typography>
          <Typography variant="body2" color="text.secondary" mt={1} mb={2}>
            Voos nas próximas 48h com reservas ativas
          </Typography>

          {reservasParaCheckIn.length === 0 ? (
            <Typography color="text.secondary">
              Nenhuma reserva disponível para check-in nas próximas 48 horas.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {reservasParaCheckIn.map((reserva) => renderCard(reserva))}
            </Grid>
          )}
        </Paper>
      </DashboardContent>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ backgroundColor: '#d0f2d0', color: '#1e4620', width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </>
  );
}


