import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
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
  onCancelamento: () => void;
  onVoltar: () => void;
};

export function CancelarVooView({ onCancelamento, onVoltar }: Props) {
  const { codigo } = useParams();
  const [voo, setVoo] = useState<VooType | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensagem, setSnackbarMensagem] = useState('');
  const [snackbarTipo, setSnackbarTipo] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const buscarVoo = async () => {
      try {
        const response = await fetch(`/api/voos/${codigo}`);
        const data = await response.json();
        setVoo(data);
      } catch (error) {
        setSnackbarMensagem('Erro ao buscar voo.');
        setSnackbarTipo('error');
        setSnackbarOpen(true);
      } finally {
        setCarregando(false);
      }
    };

    buscarVoo();
  }, [codigo]);

  const handleConfirmarCancelamento = async () => {
    try {
      const response = await fetch(`/api/voos/${codigo}/cancelar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: 'CANCELADO' })
      });      
  
      if (response.ok) {
        setSnackbarMensagem('Voo cancelado com sucesso.');
        setSnackbarTipo('success');
        setSnackbarOpen(true);
        onCancelamento();
      } else {
        throw new Error();
      }
    } catch (error) {
      setSnackbarMensagem('Erro ao cancelar voo.');
      setSnackbarTipo('error');
      setSnackbarOpen(true);
    }
  };  

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (carregando) return <CircularProgress />;

  return (
    <>
      <Dialog open onClose={onVoltar} maxWidth="sm" fullWidth>
        <DialogTitle color="error">Cancelar Voo {codigo}</DialogTitle>
        <DialogContent>
          {voo ? (
            <>
              <Typography gutterBottom>
                Origem: {voo.origem} → Destino: {voo.destino}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Estado atual: {voo.estado}
              </Typography>
            </>
          ) : (
            <Typography color="error">Voo não encontrado</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onVoltar} variant="outlined">Voltar</Button>
          <Button
            onClick={handleConfirmarCancelamento}
            color="error"
            variant="contained"
            disabled={!voo || voo.estado !== 'CONFIRMADO'}
          >
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