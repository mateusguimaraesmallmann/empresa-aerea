import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress } from '@mui/material';


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

  useEffect(() => {
    const buscarVoo = async () => {
      try {
        const response = await fetch(`/api/voos/${codigo}`);
        const data = await response.json();
        setVoo(data);
      } catch (error) {
        console.error('Erro ao buscar voo:', error);
      } finally {
        setCarregando(false);
      }
    };
    
    buscarVoo();
  }, [codigo]);

  const handleConfirmarCancelamento = async () => {
    try {
      await fetch(`/api/funcionario/voos/${codigo}/cancelar`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onCancelamento();
    } catch (error) {
      console.error('Erro ao cancelar voo:', error);
    }
  };

  if (carregando) return <CircularProgress />;

  return (
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
  );
}