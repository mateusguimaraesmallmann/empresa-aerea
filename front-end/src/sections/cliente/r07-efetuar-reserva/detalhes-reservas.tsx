// front-end/src/sections/reserva/components/detalhes-reservas.tsx
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
} from '@mui/material';
import { Voo } from './tabela-voos';

function gerarCodigoReserva() {
  const letras = Math.random().toString(36).substring(2, 5).toUpperCase();
  const numeros = Math.floor(100 + Math.random() * 900);
  return letras + numeros;
}

type Props = {
  voo: Voo;
};

export function DetalhesReserva({ voo }: Props) {
  const [quantidade, setQuantidade] = useState(1);
  const [milhasDisponiveis] = useState(1200); // mock de saldo atual de milhas
  const milhasNecessarias = voo.preco * quantidade;
  const [milhasUsadas, setMilhasUsadas] = useState(0);
  const restanteEmDinheiro = Math.max(voo.preco * quantidade - milhasUsadas, 0);

  // Estados para o Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Estado para o Dialog de confirmação
  const [openDialog, setOpenDialog] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const confirmarReserva = () => {
    // Ao clicar, abre o diálogo de confirmação mostrando o saldo atual e o saldo após a reserva
    setOpenDialog(true);
  };

  const handleConfirmDialog = () => {
    // O cliente confirmou a operação no diálogo, então finalizamos a reserva
    const codigo = gerarCodigoReserva();
    const novaReserva = {
      codigo,
      voo,
      quantidade,
      milhasUsadas,
      restanteEmDinheiro,
      status: 'CRIADA',
    };

    const reservasSalvas = JSON.parse(localStorage.getItem('reservas') || '[]');
    reservasSalvas.push(novaReserva);
    localStorage.setItem('reservas', JSON.stringify(reservasSalvas));

    setSnackbarMessage(`Reserva criada com sucesso! Código: ${codigo}`);
    setSnackbarOpen(true);
    setOpenDialog(false);
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Detalhes da Reserva
      </Typography>

      <Typography>
        <strong>Origem:</strong> {voo.origem}
      </Typography>
      <Typography>
        <strong>Destino:</strong> {voo.destino}
      </Typography>
      <Typography>
        <strong>Data/Hora:</strong> {new Date(voo.dataHora).toLocaleString('pt-BR')}
      </Typography>
      <Typography>
        <strong>Preço unitário:</strong> R$ {voo.preco.toFixed(2)}
      </Typography>
      <Typography>
        <strong>Milhas disponíveis:</strong> {milhasDisponiveis}
      </Typography>

      {/* Campos exibidos lado a lado */}
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

      <Typography>Milhas necessárias: {milhasNecessarias}</Typography>
      <Typography>
        Valor a pagar em dinheiro: R$ {restanteEmDinheiro.toFixed(2)}
      </Typography>

      <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={confirmarReserva}>
        Confirmar Reserva
      </Button>

      {/* Dialog de confirmação */}
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
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ backgroundColor: '#ADD8E6', color: 'black', width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
