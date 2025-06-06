import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { DashboardContent } from 'src/layouts/dashboard';
import { Label } from 'src/components/label';
import axios from 'axios';
import { useAuth } from 'src/context/AuthContext'; 
import { format, addHours } from 'date-fns';

export function FazerCheckIn() {
  const { usuario } = useAuth(); // Contexto com usuário logado
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const carregarReservasParaCheckIn = async () => {

      const agora = new Date();
      const daqui48h = addHours(agora, 48);
      
      try {
        setLoading(true);
        
        // 1. Buscar reservas do cliente nas próximas 48h
        const response = await axios.get(
          `/api/clientes/${usuario?.idCliente}/reservas?estado=CRIADA`,
          {
            headers: {
              Authorization: `Bearer ${usuario?.token}`,
            },
          }
        );

        // 2. Filtrar reservas com voo nas próximas 48h e estado CONFIRMADO
        const reservasValidas = response.data.filter((reserva: any) => {
          const dataVoo = new Date(reserva.voo.dataHora);
          return (
            dataVoo >= agora && 
            dataVoo <= daqui48h &&
            reserva.voo.estado === 'CONFIRMADO'
          );
        });

        setReservas(reservasValidas);
      } catch (err) {
        setError('Erro ao carregar reservas');
        console.error('Erro ao buscar reservas:', err);
      } finally {
        setLoading(false);
      }
    };

    if (usuario?.idCliente) {
      carregarReservasParaCheckIn();
    }
  }, [usuario]);

  const fazerCheckIn = async (codigoReserva: string) => {
    try {
      // 3. Atualizar estado da reserva para CHECK-IN
      await axios.patch(
        `/api/reservas/${codigoReserva}/checkin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${usuario?.token}`,
          },
        }
      );

      // 4. Atualizar estado local
      setReservas(reservas.map(reserva => 
        reserva.codigo === codigoReserva 
          ? { ...reserva, estado: 'CHECK-IN' } 
          : reserva
      ));

      setSnackbarMsg(`Check-in realizado com sucesso para a reserva ${codigoReserva}`);
      setSnackbarOpen(true);
    } catch (err) {
      setError('Erro ao realizar check-in');
      console.error('Erro no check-in:', err);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  // 5. Filtrar apenas reservas ainda elegíveis para check-in
  const reservasParaCheckIn = reservas.filter(
    reserva => reserva.estado === 'CRIADA'
  );

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
            <strong>Origem:</strong> {voo.aeroportoOrigem.codigo} - {voo.aeroportoOrigem.cidade}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Destino:</strong> {voo.aeroportoDestino.codigo} - {voo.aeroportoDestino.cidade}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Data/Hora:</strong> {format(new Date(voo.dataHora), 'dd/MM/yyyy HH:mm')}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Preço:</strong> R$ {voo.valorPassagem.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Milhas:</strong> {voo.milhasNecessarias}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Status Voo:</strong> {voo.estado}
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

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : reservasParaCheckIn.length === 0 ? (
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
          sx={{ width: '100%' }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </>
  );
}