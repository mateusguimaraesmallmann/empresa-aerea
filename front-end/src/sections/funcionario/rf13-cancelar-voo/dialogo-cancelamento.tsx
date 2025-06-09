import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import api from 'src/api/api';
import { Voo } from 'src/api/voo';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  voo: Voo;
}

export function CancelarVooDialog({ open, onClose, onConfirm, voo }: Props) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensagem, setSnackbarMensagem] = useState('');
  const [snackbarTipo, setSnackbarTipo] = useState<'success' | 'error'>('success');

  const handleConfirmar = async () => {
    try {
      await api.patch(`/voos/${voo.codigo}/cancelar`, 'CANCELADO', {
        headers: { 'Content-Type': 'application/json' }
      });      
      setSnackbarMensagem('Voo cancelado com sucesso.');
      setSnackbarTipo('success');
      setSnackbarOpen(true);
      if (onConfirm) onConfirm();
      onClose();
    } catch (error) {
      setSnackbarMensagem('Erro ao cancelar voo.');
      setSnackbarTipo('error');
      setSnackbarOpen(true);
    }
  };  

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'error.main' }}>⚠️ Cancelar Voo</DialogTitle>
        <DialogContent>
          <Typography>Confirma o cancelamento do voo <strong>{voo?.codigo}</strong>?</Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Origem: {voo?.origem?.nome} → Destino: {voo?.destino?.nome}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">Voltar</Button>
          <Button onClick={handleConfirmar} variant="contained" color="error">
            Confirmar Cancelamento
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarTipo} sx={{ width: '100%' }}>
          {snackbarMensagem}
        </Alert>
      </Snackbar>
    </>
  );
}