import {
  Box, Grid, Paper, Typography, Button, Divider, Snackbar, Alert, CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { DashboardContent } from 'src/layouts/dashboard';
import { Label } from 'src/components/label';
import { useAuth } from 'src/context/AuthContext';
import { format, addHours } from 'date-fns';
import { listarReservasPorCliente, atualizarEstadoReserva, Reserva } from 'src/api/reserva';
import { buscarVooPorCodigo, Voo } from 'src/api/voo';

type ReservaComVoo = Reserva & { voo?: Voo };

export function FazerCheckIn() {
  const { usuario } = useAuth();
  const [reservas, setReservas] = useState<ReservaComVoo[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function carregarReservasComVoos() {
      if (!usuario?.id) return;
      setLoading(true);
      setError('');
      try {
        const reservasCliente = await listarReservasPorCliente(Number(usuario.id));

        // Busca os detalhes do voo para cada reserva
        const reservasComVoos: ReservaComVoo[] = await Promise.all(
          reservasCliente.map(async (reserva) => {
            try {
              const voo = await buscarVooPorCodigo(reserva.codigoVoo);
              return { ...reserva, voo };
            } catch (e) {
              return { ...reserva };
            }
          })
        );

        const agora = new Date();
        const daqui48h = addHours(agora, 48);

        const reservasValidas = reservasComVoos.filter((reserva) => {
          if (!reserva.voo) return false;
          const dataVoo = new Date(reserva.voo.dataHora);
          return (
            reserva.estado === 'CRIADA' &&
            reserva.voo.estado === 'CONFIRMADO' &&
            dataVoo >= agora &&
            dataVoo <= daqui48h
          );
        });

        setReservas(reservasValidas);
      } catch (err) {
        setError('Erro ao carregar reservas.');
      } finally {
        setLoading(false);
      }
    }
    carregarReservasComVoos();
  }, [usuario]);

  const fazerCheckIn = async (codigoReserva: string) => {
    setError('');
    try {
      await atualizarEstadoReserva(codigoReserva, 'CHECK_IN');
      setReservas(reservas.map(reserva =>
        reserva.codigo === codigoReserva ? { ...reserva, estado: 'CHECK_IN' } : reserva
      ));
      setSnackbarMsg(`Check-in realizado com sucesso para a reserva ${codigoReserva}`);
      setSnackbarOpen(true);
    } catch (err) {
      setError('Erro ao realizar check-in');
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const renderCard = (reserva: ReservaComVoo) => {
    const voo = reserva.voo;
    return (
      <Grid item xs={12} md={6} key={reserva.codigo}>
        <Paper sx={{ p: 3, height: '100%', border: '1px solid #ccc', boxShadow: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle1">
              <strong>Voo {voo?.codigo ?? reserva.codigoVoo}</strong>
            </Typography>
            <Label color="primary">Reserva: {reserva.codigo}</Label>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            <strong>Origem:</strong> {voo?.origem?.codigoAeroporto} - {voo?.origem?.cidade}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Destino:</strong> {voo?.destino?.codigoAeroporto} - {voo?.destino?.cidade}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Data/Hora:</strong> {voo ? format(new Date(voo.dataHora), 'dd/MM/yyyy HH:mm') : '--'}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Preço:</strong> R$ {voo?.preco?.toFixed(2) ?? reserva.valorPagoEmDinheiro}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Poltronas:</strong> {voo?.poltronas}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Status Voo:</strong> {voo?.estado}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Status Reserva:</strong>
                <Label color={reserva.estado === 'CRIADA' ? 'primary' : 'success'}>
                  {reserva.estado}
                </Label>
              </Typography>
            </Grid>
          </Grid>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              disabled={reserva.estado !== 'CRIADA'}
              onClick={() => fazerCheckIn(reserva.codigo)}
            >
              {reserva.estado === 'CRIADA' ? 'Fazer Check-in' : 'Check-in Realizado'}
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
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : reservas.length === 0 ? (
            <Typography color="text.secondary">
              Nenhuma reserva disponível para check-in nas próximas 48 horas.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {reservas.map(renderCard)}
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
          sx={{ width: '100%' }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </>
  );
}

