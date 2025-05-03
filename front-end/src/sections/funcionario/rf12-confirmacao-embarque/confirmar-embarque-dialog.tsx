import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { createPortal } from 'react-dom';

type Reserva = {
  codigo: string;
  estado: string;
  voo: {
    id: string;
    origem: string;
    destino: string;
  };
};

type Props = {
  open: boolean;
  onClose: () => void;
  vooId: string;
};

export function ConfirmarEmbarqueDialog({ open, onClose, vooId }: Props) {
  const [codigo, setCodigo] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensagem, setSnackbarMensagem] = useState('');
  const [snackbarTipo, setSnackbarTipo] = useState<'success' | 'error'>('success');

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleConfirmar = () => {
    const reservas: Reserva[] = JSON.parse(localStorage.getItem('reservas') || '[]');
    const reserva = reservas.find((r) => r.codigo === codigo);

    if (!reserva) {
      setSnackbarMensagem('Reserva não encontrada.');
      setSnackbarTipo('error');
      setSnackbarOpen(true);
      return;
    }

    if (reserva.voo?.id !== vooId) {
      setSnackbarMensagem('Esta reserva não pertence a este voo.');
      setSnackbarTipo('error');
      setSnackbarOpen(true);
      return;
    }

    if (reserva.estado !== 'CHECK-IN') {
      setSnackbarMensagem('A reserva precisa estar no estado CHECK-IN.');
      setSnackbarTipo('error');
      setSnackbarOpen(true);
      return;
    }

    reserva.estado = 'EMBARCADO';
    localStorage.setItem('reservas', JSON.stringify(reservas));

    setSnackbarMensagem('Embarque confirmado com sucesso!');
    setSnackbarTipo('success');
    setSnackbarOpen(true);

    setTimeout(() => {
      onClose();
      setCodigo('');
    }, 2000);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmar Embarque</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Código da Reserva"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            margin="normal"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleConfirmar}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar fora do Dialog */}
      {createPortal(
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarTipo}
            sx={{ width: '100%' }}
          >
            {snackbarMensagem}
          </Alert>
        </Snackbar>,
        document.body
      )}
    </>
  );
}