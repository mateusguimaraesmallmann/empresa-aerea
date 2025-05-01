import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Grid,
} from '@mui/material';

import { Reserva } from 'src/sections/cliente/types/reserva';

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
  if (!reserva) return null;

  const podeCancelar = ['CRIADA', 'CHECK-IN'].includes(reserva.estado);

  const cancelarReserva = () => {
    // Carregar reservas existentes
    const reservasLocal = JSON.parse(localStorage.getItem('reservas') || '[]');

    // Atualizar status da reserva cancelada
    const reservasAtualizadas = reservasLocal.map((r: any) =>
      r.codigo === reserva.codigo
        ? {
            ...r,
            status: 'CANCELADA',
            dataHoraCancelamento: new Date().toISOString(),
          }
        : r
    );

    localStorage.setItem('reservas', JSON.stringify(reservasAtualizadas));

    // Reembolso de milhas
    const milhasAtuais = Number(localStorage.getItem('milhas')) || 0;
    const milhasParaReembolso = Number(reserva.milhasGastas) || 0;
    const novoSaldoMilhas = milhasAtuais + milhasParaReembolso;

    localStorage.setItem('milhas', JSON.stringify(novoSaldoMilhas));

    // Registrar transação de reembolso
    const transacoes = JSON.parse(localStorage.getItem('transacoes') || '[]');

    const novaTransacao = {
      id: crypto.randomUUID(),
      dataHora: new Date().toISOString(),
      descricao: 'Milhas devolvidas por cancelamento',
      tipo: 'ENTRADA',
      quantidadeMilhas: milhasParaReembolso,
      codigoReserva: reserva.codigo,
      valorReais: null,
    };

    transacoes.push(novaTransacao);
    localStorage.setItem('transacoes', JSON.stringify(transacoes));

    onReservaCancelada();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cancelar Reserva</DialogTitle>

      <DialogContent dividers>
        <Box p={2}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Código da Reserva:</Typography>
              <Typography color="text.secondary">{reserva.codigo}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2">Data/Hora:</Typography>
              <Typography color="text.secondary">
                {new Date(reserva.dataHora).toLocaleString()}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2">Origem:</Typography>
              <Typography color="text.secondary">{reserva.origem}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2">Destino:</Typography>
              <Typography color="text.secondary">{reserva.destino}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2">Milhas Gastas:</Typography>
              <Typography color="text.secondary">{reserva.milhasGastas}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2">Valor Pago:</Typography>
              <Typography color="text.secondary">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(reserva.valorReais)}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2">Status:</Typography>
              <Typography color="text.secondary">{reserva.estado}</Typography>
            </Grid>
          </Grid>
        </Box>

        {!podeCancelar && (
          <Typography mt={3} color="error">
            Esta reserva não pode ser cancelada pois já foi concluída ou está em outro estado.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
        <Button
          onClick={cancelarReserva}
          color="error"
          variant="contained"
          disabled={!podeCancelar}
        >
          Cancelar Reserva
        </Button>
      </DialogActions>
    </Dialog>
  );
}
