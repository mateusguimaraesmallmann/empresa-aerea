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
import api from 'src/api/api';

interface Props {
  open: boolean;
  onClose: () => void;
  vooId: string;
}

export function ConfirmarEmbarqueDialog({ open, onClose, vooId }: Props) {
  const [codigo, setCodigo] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensagem, setSnackbarMensagem] = useState('');
  const [snackbarTipo, setSnackbarTipo] = useState<'success' | 'error'>('success');

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const handleConfirmar = async () => {
    try {
      await api.patch(`/reservas/${codigo}/embarque`, {});
      setSnackbarMensagem('Embarque confirmado com sucesso!');
      setSnackbarTipo('success');
      setSnackbarOpen(true);
      setTimeout(() => {
        onClose();
        setCodigo('');
      }, 2000);
    } catch (error) {
      setSnackbarMensagem('Erro ao confirmar embarque. Verifique o código.');
      setSnackbarTipo('error');
      setSnackbarOpen(true);
    }
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
          <Button variant="contained" onClick={handleConfirmar}>Confirmar</Button>
        </DialogActions>
      </Dialog>

      {createPortal(
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarTipo} sx={{ width: '100%' }}>
            {snackbarMensagem}
          </Alert>
        </Snackbar>,
        document.body
      )}
    </>
  );
}