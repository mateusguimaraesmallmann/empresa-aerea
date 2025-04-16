import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from '@mui/material';


type Reserva = {
  codigo: string;
  status: string;
  voo: {
    id: string;
    origem: string;
    destino: string;
    // outros campos, se quiser adicionar
  };
};


type Props = {
  open: boolean;
  onClose: () => void;
  vooId: string;
};

export function ConfirmarEmbarqueDialog({ open, onClose, vooId }: Props) {
  const [codigo, setCodigo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState(false);

  const handleConfirmar = () => {
    const reservas: Reserva[] = JSON.parse(localStorage.getItem('reservas') || '[]');
    const reserva = reservas.find((r) => r.codigo === codigo);

    if (!reserva) {
      setMensagem('Reserva não encontrada.');
      setErro(true);
      return;
    }
    if (reserva.voo?.id !== vooId) {
      setMensagem('Esta reserva não pertence a este voo.');
      setErro(true);
      return;
    }
    
    if (reserva.status !== 'CHECK-IN') {
      setMensagem('A reserva precisa estar no estado CHECK-IN.');
      setErro(true);
      return;
    }
    
    reserva.status = 'EMBARCADO';
    localStorage.setItem('reservas', JSON.stringify(reservas));
    setMensagem('Embarque confirmado com sucesso!');
    setErro(false);
    setTimeout(() => {
      onClose();
      setCodigo('');
      setMensagem('');
    }, 2000);
  };

  return (
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

        {mensagem && (
          <Box mt={1}>
            <Typography color={erro ? 'error' : 'success.main'}>{mensagem}</Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleConfirmar}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
