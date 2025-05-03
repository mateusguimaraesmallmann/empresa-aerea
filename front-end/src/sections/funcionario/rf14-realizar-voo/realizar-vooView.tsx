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

type VooType = {
  codigo: string;
  origem: string;
  destino: string;
  estado: string;
};

type Props = {
  codigoVoo: string;
  onRealizacao: () => void;
  onVoltar: () => void;
};

export function RealizarVooView({ codigoVoo, onRealizacao, onVoltar }: Props) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensagem, setSnackbarMensagem] = useState('');
  const [snackbarTipo, setSnackbarTipo] = useState<'success' | 'error'>('success');

  const handleConfirmar = () => {
    try {
      onRealizacao();
      setSnackbarMensagem('Realização registrada com sucesso.');
      setSnackbarTipo('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMensagem('Erro ao registrar realização.');
      setSnackbarTipo('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open onClose={onVoltar} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'success.main' }}>✈️ Confirmar Realização</DialogTitle>
        <DialogContent>
          <Typography>
            Confirmar realização do voo <strong>{codigoVoo}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onVoltar}>Cancelar</Button>
          <Button onClick={handleConfirmar} variant="contained" color="success">
            Confirmar
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