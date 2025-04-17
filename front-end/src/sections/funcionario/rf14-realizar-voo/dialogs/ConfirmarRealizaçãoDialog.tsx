import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  voo: any;
};

export function ConfirmarRealizacaoDialog({ open, onClose, onConfirm, voo }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: 'success.main' }}>✈️ Confirmar Realização</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography>
            Confirmar realização do voo <strong>{voo?.codigo}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Origem: {voo?.origem} → Destino: {voo?.destino}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Todas as reservas embarcadas serão marcadas como realizadas
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Cancelar</Button>
        <Button onClick={onConfirm} variant="contained" color="success">
          Confirmar Realização
        </Button>
      </DialogActions>
    </Dialog>
  );
}