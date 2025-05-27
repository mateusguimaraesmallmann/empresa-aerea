import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import { useState } from 'react';
import api from 'src/api/api';
import { Voo } from 'src/api/voo';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  voo: Voo;
}

export function ConfirmarRealizacaoDialog({ open, onClose, onConfirm, voo }: Props) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensagem, setSnackbarMensagem] = useState('');
  const [snackbarTipo, setSnackbarTipo] = useState<'success' | 'error'>('success');

  const handleConfirmar = async () => {
    try {
      await api.patch(`/voos/${voo.codigo}/realizar`, {});
      setSnackbarMensagem('Voo marcado como realizado com sucesso.');
      setSnackbarTipo('success');
      setSnackbarOpen(true);
      if (onConfirm) onConfirm();
      onClose();
    } catch (error) {
      setSnackbarMensagem('Erro ao marcar voo como realizado.');
      setSnackbarTipo('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'success.main' }}>✈️ Confirmar Realização</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography>Confirmar realização do voo <strong>{voo?.codigo}</strong>?</Typography>
            <Typography variant="body2" color="text.secondary">
              Origem: {voo?.origem?.nome} → Destino: {voo?.destino?.nome}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Todas as reservas embarcadas serão marcadas como realizadas
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">Cancelar</Button>
          <Button onClick={handleConfirmar} variant="contained" color="success">Confirmar Realização</Button>
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