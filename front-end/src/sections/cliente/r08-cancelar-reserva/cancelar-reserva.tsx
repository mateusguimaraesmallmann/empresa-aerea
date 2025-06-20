import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Grid,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import { Reserva, cancelarReserva } from 'src/api/reserva';

type CancelarReservaDialogProps = {
  open: boolean;
  onClose: () => void;
  reserva: Reserva | null;
  onReservaCancelada: () => void;
};

export function CancelarReservaDialog({
  open,
  onClose,
  reserva,
  onReservaCancelada,
}: CancelarReservaDialogProps) {
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!reserva) return null;

  const podeCancelar = ['CRIADA', 'CHECK_IN'].includes(reserva.estado);

  const handleCancelarReserva = async () => {
    setLoading(true);
    setErro(null);

    try {
      await cancelarReserva(reserva.codigo);
      setSucesso(true);
      onReservaCancelada();

      setTimeout(() => {
        setSucesso(false);
        onClose();
      }, 2000);
    } catch (e: any) {
      setErro(
        e?.response?.data?.message ||
          'Erro ao cancelar reserva. Tente novamente mais tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cancelar Reserva</DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {sucesso && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Reserva cancelada com sucesso! As milhas utilizadas serão devolvidas.
            </Alert>
          )}
          {erro && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {erro}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography><strong>Data/Hora:</strong></Typography>
              <Typography color="text.secondary">
                {new Date(reserva.dataHora).toLocaleString('pt-BR')}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><strong>Código:</strong></Typography>
              <Typography color="text.secondary">{reserva.codigo}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><strong>Código do Voo:</strong></Typography>
              <Typography color="text.secondary">{reserva.codigoVoo}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><strong>Qtd. Passagens:</strong></Typography>
              <Typography color="text.secondary">{reserva.quantidadePassagens}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><strong>Valor Gasto:</strong></Typography>
              <Typography color="text.secondary">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(reserva.valorPagoEmDinheiro)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><strong>Milhas Utilizadas:</strong></Typography>
              <Typography color="text.secondary">{reserva.milhasUtilizadas}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography><strong>Estado da Reserva:</strong></Typography>
              <Typography color="text.secondary">{reserva.estado}</Typography>
            </Grid>
          </Grid>

          {!podeCancelar && (
            <Typography mt={3} color="error">
              Esta reserva não pode ser cancelada pois já foi concluída ou está em outro estado.
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
        <Button
          onClick={handleCancelarReserva}
          color="error"
          variant="contained"
          disabled={!podeCancelar || sucesso || loading}
        >
          {loading ? 'Cancelando...' : 'Cancelar Reserva'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}



