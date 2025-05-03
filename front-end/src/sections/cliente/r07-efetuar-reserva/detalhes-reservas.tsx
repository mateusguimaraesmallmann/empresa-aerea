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
import { Voo } from './tabela-voos';

function gerarCodigoReservaExistente(codigosExistentes: string[]): string {
  const gerarLetras = () =>
    Array.from({ length: 3 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');

  const gerarNumeros = () => String(Math.floor(Math.random() * 1000)).padStart(3, '0');

  let novoCodigo = '';
  do {
    novoCodigo = gerarLetras() + gerarNumeros();
  } while (codigosExistentes.includes(novoCodigo));

  return novoCodigo;
}

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
  const [openDialog, setOpenDialog] = useState(false);
  const [reservaCriada, setReservaCriada] = useState(false);

  const milhasNecessarias = voo.preco * quantidade;
  const restanteEmDinheiro = Math.max(voo.preco * quantidade - milhasUsadas, 0);

  useEffect(() => {
    const compras = JSON.parse(localStorage.getItem('comprasMilhas') || '[]');
    const totalComprado = compras.reduce((acc: number, item: any) => acc + Number(item.milhas), 0);

    const milhasUsadasEmReservas = JSON.parse(localStorage.getItem('reservas') || '[]')
      .reduce((acc: number, r: any) => acc + (r.milhasUsadas || 0), 0);

    setMilhasDisponiveis(totalComprado - milhasUsadasEmReservas);
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setReservaCriada(false);
    onReservaFinalizada();
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
      estado: 'CRIADA',
      dataHoraCriacao: new Date().toISOString()
    };

    reservasSalvas.push(novaReserva);
    localStorage.setItem('reservas', JSON.stringify(reservasSalvas));

    setSnackbarMessage(`Reserva criada com sucesso! Código: ${codigo}`);
    setSnackbarOpen(true);
    setOpenDialog(false);
    setReservaCriada(true);
  };

  return (
    <Box sx={{ backgroundColor: 'white', p: 3, borderRadius: 2, width: '100%' }}>
      <Typography variant="h5" mb={2}>
        Detalhes da Reserva
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6}>
          <Typography mb={1.5}><strong>Código Voo:</strong> {voo.codigo}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography mb={1.5}><strong>Origem:</strong> {voo.origem}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography mb={1.5}><strong>Destino:</strong> {voo.destino}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography mb={1.5}>
            <strong>Data/Hora:</strong> {new Date(voo.dataHora).toLocaleString('pt-BR')}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography mb={1.5}>
            <strong>Preço unitário:</strong> R$ {voo.preco.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography mb={1.5}><strong>Saldo de Milhas:</strong> {milhasDisponiveis}</Typography>
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
          disabled={reservaCriada}
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
