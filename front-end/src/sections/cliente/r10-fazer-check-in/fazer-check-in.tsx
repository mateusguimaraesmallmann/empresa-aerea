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

  const reservasPorVoo = reservas.reduce((acc: Record<string, boolean>, reserva: any) => {
    const codigo = reserva.voo?.codigo;
    if (codigo) acc[codigo] = true;
    return acc;
  }, {});

  const fazerCheckIn = (codigoVoo: string) => {
    // Atualiza o estado do voo
    const voosAtualizados = voos.map((v) =>
      v.codigo === codigoVoo ? { ...v, estado: 'CHECK-IN' } : v
    );
    localStorage.setItem('voos', JSON.stringify(voosAtualizados));
    setVoos(voosAtualizados);
  
    // Atualiza o estado das reservas associadas a esse voo
    const reservasAtuais = JSON.parse(localStorage.getItem('reservas') || '[]');
    const reservasAtualizadas = reservasAtuais.map((reserva: any) =>
      reserva.voo?.codigo === codigoVoo ? { ...reserva, estado: 'CHECK-IN' } : reserva
    );
    localStorage.setItem('reservas', JSON.stringify(reservasAtualizadas));
    setReservas(reservasAtualizadas);
  
    setSnackbarMsg(`Check-in realizado com sucesso para o voo ${codigoVoo}`);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const renderCard = (voo: any) => {
    const data = new Date(voo.dataHora);
    const dentroDe48h = data >= agora && data <= daqui48h;
    const temReserva = reservasPorVoo[voo.codigo] === true;
    const podeFazerCheckIn = voo.estado === 'CONFIRMADO' && dentroDe48h && temReserva;

    return (
      <Grid item xs={12} md={6} key={voo.codigo}>
        <Paper sx={{ p: 3, height: '100%', border: '1px solid #ccc', boxShadow: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Voo {voo.codigo}</strong>
          </Typography>

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

          {podeFazerCheckIn && (
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button variant="contained" onClick={() => fazerCheckIn(voo.codigo)}>
                Fazer Check-in
              </Button>
            </Box>
          )}
        </Paper>
      </Grid>
    );
  };

  const voosDentroDasProximas48h = voos.filter((voo) => {
    const data = new Date(voo.dataHora);
    return data >= agora && data <= daqui48h;
  });

  return (
    <>
      <Helmet>
        <title>Fazer Check-in</title>
      </Helmet>

      <DashboardContent>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5">
            Fazer Check-in
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1} mb={2}>
            Voos nas próximas 48h
          </Typography>

          {voosDentroDasProximas48h.length === 0 ? (
            <Typography color="text.secondary">
              Nenhum voo disponível nas próximas 48 horas.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {voosDentroDasProximas48h.map((voo) => renderCard(voo))}
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

