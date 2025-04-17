import { useState } from 'react';
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
import { Voo } from './tabela-voos';

function gerarCodigoReservaExistente(codigosExistentes: string[]): string {
  let novoCodigo = '';
  do {
    const letras = Math.random().toString(36).substring(2, 5).toUpperCase();
    const numeros = Math.floor(100 + Math.random() * 900);
    novoCodigo = letras + numeros;
  } while (codigosExistentes.includes(novoCodigo));
  return novoCodigo;
}

type Props = {
  voo: Voo;
  onReservaFinalizada: () => void;
};

export function DetalhesReserva({ voo, onReservaFinalizada }: Props) {
  const [quantidade, setQuantidade] = useState(1);
  const [milhasDisponiveis] = useState(1000); // mock de saldo atual de milhas
  const milhasNecessarias = voo.preco * quantidade;
  const [milhasUsadas, setMilhasUsadas] = useState(0);
  const restanteEmDinheiro = Math.max(voo.preco * quantidade - milhasUsadas, 0);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [reservaCriada, setReservaCriada] = useState(false); // controla o botão

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setReservaCriada(false); // libera o botão novamente
    onReservaFinalizada();   // reinicia a tela de busca
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const confirmarReserva = () => {
    setOpenDialog(true);
  };

  const handleConfirmDialog = () => {
    const reservasSalvas = JSON.parse(localStorage.getItem('reservas') || '[]');
    const codigosExistentes = reservasSalvas.map((r: any) => r.codigo);
    const codigo = gerarCodigoReservaExistente(codigosExistentes);

    const novaReserva = {
      codigo,
      voo,
      quantidade,
      milhasUsadas,
      restanteEmDinheiro,
      status: 'CRIADA',
    };

    reservasSalvas.push(novaReserva);
    localStorage.setItem('reservas', JSON.stringify(reservasSalvas));

    const milhasAtual = Number(localStorage.getItem('milhas')) || 1000;
    const novoSaldo = milhasAtual - milhasUsadas;
    localStorage.setItem('milhas', JSON.stringify(novoSaldo));

    setSnackbarMessage(`Reserva criada com sucesso! Código: ${codigo}`);
    setSnackbarOpen(true);
    setOpenDialog(false);
    setReservaCriada(true); // desabilita o botão
  };

  return (
    <Box sx={{
      backgroundColor: 'white',
      p: 3,
      borderRadius: 2,
      width: '100%',
    }}>
      <Typography variant="h5" mb={2}>
        Detalhes da Reserva
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6}>
          <Typography mb={1.5}><strong>Origem:</strong> {voo.origem}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography mb={1.5}><strong>Destino:</strong> {voo.destino}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography mb={1.5}><strong>Data/Hora:</strong> {new Date(voo.dataHora).toLocaleString('pt-BR')}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography mb={1.5}><strong>Preço unitário:</strong> R$ {voo.preco.toFixed(2)}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography mb={1.5}><strong>Milhas disponíveis:</strong> {milhasDisponiveis}</Typography>
        </Grid>
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
        <Grid item xs={12} sm={6}>
          <Typography mb={1.5}><strong>Milhas necessárias:</strong> {milhasNecessarias}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography mb={1.5}>
            <strong>Valor a pagar em dinheiro:</strong> R$ {restanteEmDinheiro.toFixed(2)}
          </Typography>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" mt={-1}>
        <Button
          variant="contained"
          color="primary"
          onClick={confirmarReserva}
          disabled={reservaCriada} // desabilita após sucesso
        >
          Confirmar Reserva
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirmar Reserva</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Seu saldo atual de milhas é {milhasDisponiveis}. Após a reserva, seu saldo será de{' '}
            {milhasDisponiveis - milhasUsadas}.
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
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{
            backgroundColor: '#d0f2d0',
            color: '#1e4620',
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