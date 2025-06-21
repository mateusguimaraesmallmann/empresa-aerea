import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  Grid,
} from '@mui/material';
import { criarReserva } from 'src/api/reserva';
import { Voo } from './tabela-voos';

type Props = {
  voo: Voo;
  onReservaFinalizada: () => void;
};

export function DetalhesReserva({ voo, onReservaFinalizada }: Props) {
  const [quantidade, setQuantidade] = useState(1);
  const [milhasDisponiveis, setMilhasDisponiveis] = useState(0);
  const [milhasUsadas, setMilhasUsadas] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarTipo, setSnackbarTipo] = useState<'success' | 'error'>('success');
  const [openDialog, setOpenDialog] = useState(false);
  const [reservaCriada, setReservaCriada] = useState(false);

  // Recupera o cliente logado (PRECISA AJUSTAR PARA PEGAR O LOGIN REAL)
  const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado') || '{}');
  const clienteCpf = usuario.cpf;
  const idCliente = usuario.id;

  // Simulação de busca de milhas do cliente
  useEffect(() => {
    setMilhasDisponiveis(1000);
  }, []);

  const milhasNecessarias = Math.ceil((voo.preco * quantidade) / 5);
  const restanteEmDinheiro = Math.max(voo.preco * quantidade - milhasUsadas, 0);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setReservaCriada(false);
    onReservaFinalizada();
  };

  const handleDialogClose = () => setOpenDialog(false);

  const confirmarReserva = () => {
    if (voo.estado !== 'CONFIRMADO') {
      setSnackbarMessage('Este voo não está CONFIRMADO!');
      setSnackbarTipo('error');
      setSnackbarOpen(true);
      return;
    }
    setOpenDialog(true);
  };

  const handleConfirmDialog = async () => {
    try {
      const reserva = await criarReserva({
        codigoVoo: voo.codigo,
        clienteCpf,
        idCliente,
        quantidadePassagens: quantidade,
        milhasUtilizadas: milhasUsadas,
        valorPagoEmDinheiro: restanteEmDinheiro,
      });
      setSnackbarMessage(`Reserva criada com sucesso! Código: ${reserva.codigo}`);
      setSnackbarTipo('success');
      setOpenDialog(false);
      setReservaCriada(true);
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Erro ao criar reserva.');
      setSnackbarTipo('error');
      setSnackbarOpen(true);
      setOpenDialog(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: 'white', p: 3, borderRadius: 2, width: '100%' }}>
      <Typography variant="h5" mb={2}>
        Detalhes da Reserva
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6}><Typography><strong>Código Voo:</strong> {voo.codigo}</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography><strong>Origem:</strong> {typeof voo.origem === 'string' ? voo.origem : voo.origem.nome || voo.origem.codigoAeroporto}</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography><strong>Destino:</strong> {typeof voo.destino === 'string' ? voo.destino : voo.destino.nome || voo.destino.codigoAeroporto}</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography><strong>Data/Hora:</strong> {new Date(voo.dataHora).toLocaleString('pt-BR')}</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography><strong>Preço unitário:</strong> R$ {voo.preco.toFixed(2)}</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography><strong>Saldo de Milhas:</strong> {milhasDisponiveis}</Typography></Grid>
      </Grid>

      <Divider sx={{ mb: 4 }} />

      <Box display="flex" gap={2} my={2}>
        <TextField
          type="number"
          label="Quantidade de passagens"
          value={quantidade}
          onChange={(e) => setQuantidade(Number(e.target.value))}
          fullWidth
          inputProps={{ min: 1 }}
        />
        <TextField
          type="number"
          label="Milhas que deseja usar"
          value={milhasUsadas}
          onChange={(e) => setMilhasUsadas(Number(e.target.value))}
          fullWidth
          inputProps={{ min: 0, max: milhasDisponiveis }}
        />
      </Box>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6}><Typography><strong>Milhas necessárias:</strong> {milhasNecessarias}</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography><strong>Valor a pagar em dinheiro:</strong> R$ {restanteEmDinheiro.toFixed(2)}</Typography></Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" mt={-1}>
        <Button
          variant="contained"
          color="primary"
          onClick={confirmarReserva}
          disabled={reservaCriada}
        >
          Confirmar Reserva
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirmar Reserva</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Seu saldo atual de milhas é {milhasDisponiveis}. Após a reserva, seu saldo será de {milhasDisponiveis - milhasUsadas}.
          </DialogContentText>
          <DialogContentText>Deseja efetuar a operação?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancelar</Button>
          <Button onClick={handleConfirmDialog} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
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
    </Box>
  );
}
