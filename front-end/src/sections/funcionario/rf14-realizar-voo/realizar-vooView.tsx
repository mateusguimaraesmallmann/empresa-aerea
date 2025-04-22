import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

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
  voo?: VooType; 
  atualizarListaVoos?: () => void; 
};

export function RealizarVooView({ codigoVoo, onRealizacao, onVoltar }: Props) {
  return (
    <Dialog open={true} onClose={onVoltar} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: 'success.main' }}>✈️ Confirmar Realização</DialogTitle>
      <DialogContent>
        <Typography>
          Confirmar realização do voo <strong>{codigoVoo}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onVoltar}>Cancelar</Button>
        <Button 
          onClick={onRealizacao}
          variant="contained"
          color="success"
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}