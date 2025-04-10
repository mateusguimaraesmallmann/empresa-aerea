
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  voo: any;
};

export function CancelarVooDialog({ open, onClose, onConfirm, voo }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: 'error.main' }}>⚠️ Cancelar Voo</DialogTitle>
      <DialogContent>
        <Typography>
          Confirma o cancelamento do voo <strong>{voo?.codigo}</strong>?
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Origem: {voo?.origem} → Destino: {voo?.destino}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Voltar</Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Confirmar Cancelamento
        </Button>
      </DialogActions>
    </Dialog>
  );
}