import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';

import { Reserva, buscarReservaPorCodigo } from 'src/api/reserva'; // Função correta do backend!

export default function ConsultarReserva() {
  const [codigo, setCodigo] = useState('');
  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const buscarReserva = async () => {
    setErro(null);
    setReservaSelecionada(null);
    if (!codigo.trim()) {
      setErro('Digite o código da reserva.');
      return;
    }
    setLoading(true);
    try {
      const reserva = await buscarReservaPorCodigo(codigo.trim());
      setReservaSelecionada(reserva);
    } catch (e: any) {
      setErro(
        e?.response?.data?.message ||
        'Reserva não encontrada ou erro na busca. Verifique o código e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fecharModal = () => {
    setReservaSelecionada(null);
  };

  // Checa se o voo está dentro de 48h para habilitar o check-in
  const vooDentroDe48h = (dataHora: string) => {
    const agora = new Date();
    const voo = new Date(dataHora);
    const diffHoras = (voo.getTime() - agora.getTime()) / 1000 / 60 / 60;
    return diffHoras <= 48 && diffHoras > 0;
  };

  return (
    <>
      <Box display="flex" flexDirection="column" gap={2} alignItems="center" mt={4}>
        <TextField
          label="Digite o código da reserva"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          size="small"
          variant="outlined"
          sx={{ width: 300 }}
          disabled={loading}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={buscarReserva}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Consultar'}
        </Button>
        {erro && <Alert severity="error">{erro}</Alert>}
      </Box>

      {reservaSelecionada && (
        <Dialog open onClose={fecharModal} maxWidth="sm" fullWidth>
          <DialogTitle>Dados da Reserva</DialogTitle>
          <DialogContent dividers>
            <Typography><strong>Código:</strong> {reservaSelecionada.codigo}</Typography>
            <Typography><strong>Data/Hora:</strong> {new Date(reservaSelecionada.dataHora).toLocaleString('pt-BR')}</Typography>
            <Typography><strong>Código do Voo:</strong> {reservaSelecionada.codigoVoo}</Typography>
            <Typography><strong>Quantidade de Passagens:</strong> {reservaSelecionada.quantidadePassagens}</Typography>
            <Typography><strong>Milhas Utilizadas:</strong> {reservaSelecionada.milhasUtilizadas}</Typography>
            <Typography><strong>Valor Pago:</strong> {reservaSelecionada.valorPagoEmDinheiro?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Typography>
            <Typography><strong>Status:</strong> {reservaSelecionada.estado}</Typography>
            <Typography><strong>CPF do Cliente:</strong> {reservaSelecionada.clienteCpf}</Typography>
          </DialogContent>
          <DialogActions>
            {vooDentroDe48h(reservaSelecionada.dataHora) && (
              <Button variant="contained" color="primary">
                Fazer Check-in
              </Button>
            )}
            <Button variant="contained" color="error">
              Cancelar Reserva
            </Button>
            <Button onClick={fecharModal}>Fechar</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}


