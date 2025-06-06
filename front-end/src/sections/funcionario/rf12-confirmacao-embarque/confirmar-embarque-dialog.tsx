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
  CircularProgress,
} from '@mui/material';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { useAuth } from 'src/context/AuthContext';

interface Props {
  open: boolean;
  onClose: () => void;
  vooId: string;
}

export function ConfirmarEmbarqueDialog({ open, onClose, vooId }: Props) {
  const { usuario } = useAuth();
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensagem, setSnackbarMensagem] = useState('');
  const [snackbarTipo, setSnackbarTipo] = useState<'success' | 'error'>('success');

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const handleConfirmar = async () => {
    if (!codigo) {
      setSnackbarMensagem('Por favor, informe o código da reserva');
      setSnackbarTipo('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      setLoading(true);


      await axios.patch(
        `/api/reservas/${codigo}/embarque`,
        { vooId },
        {
          headers: {
            Authorization: `Bearer ${usuario?.token}`,
          },
        }
      );


      setSnackbarMensagem('Embarque confirmado com sucesso!');
      setSnackbarTipo('success');
      setSnackbarOpen(true);


      setTimeout(() => {
        onClose();
        setCodigo('');
        setLoading(false);
      }, 2000);
    } catch (error: any) {
      setLoading(false);


      let errorMsg = 'Erro ao confirmar embarque';
      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMsg = 'Reserva não encontrada';
            break;
          case 400:
            errorMsg = error.response.data.message || 'Reserva não pertence a este voo';
            break;
          case 403:
            errorMsg = 'Reserva não está em estado de CHECK-IN';
            break;
          default:
            errorMsg = 'Erro inesperado ao confirmar embarque';
        }
      }

      setSnackbarMensagem(errorMsg);
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
            disabled={loading}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmar}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>

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