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
  const [sucesso, setSucesso] = useState(false);

  if (!reserva) return null;

  const podeCancelar = ['CRIADA', 'CHECK-IN'].includes(reserva.estado);

  const cancelarReserva = () => {
    const reservasLocal = JSON.parse(localStorage.getItem('reservas') || '[]');

    const reservasAtualizadas = reservasLocal.map((r: any) =>
      r.codigo === reserva.codigo
        ? {
            ...r,
            estado: 'CANCELADA',
            dataHoraCancelamento: new Date().toISOString(),
          }
        : r
    );

    localStorage.setItem('reservas', JSON.stringify(reservasAtualizadas));

    const milhasAtuais = Number(localStorage.getItem('milhas')) || 0;
    const milhasParaReembolso = Number(reserva.milhasGastas) || 0;
    const novoSaldoMilhas = milhasAtuais + milhasParaReembolso;

    localStorage.setItem('milhas', JSON.stringify(novoSaldoMilhas));

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

    setSucesso(true);
    onReservaCancelada();

    setTimeout(() => {
      setSucesso(false);
      onClose();
    }, 3000);
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
              <Typography><strong>Origem:</strong></Typography>
              <Typography color="text.secondary">{reserva.origem}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography><strong>Destino:</strong></Typography>
              <Typography color="text.secondary">{reserva.destino}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography><strong>Valor Gasto:</strong></Typography>
              <Typography color="text.secondary">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(reserva.valorReais)}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography><strong>Milhas Gastas:</strong></Typography>
              <Typography color="text.secondary">{reserva.milhasGastas}</Typography>
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
          onClick={cancelarReserva}
          color="error"
          variant="contained"
          disabled={!podeCancelar || sucesso}
        >
          Cancelar Reserva
        </Button>
      </DialogActions>
    </Dialog>
  );
}


