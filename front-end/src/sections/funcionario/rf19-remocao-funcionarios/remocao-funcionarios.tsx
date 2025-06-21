import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { Funcionario } from '../types/funcionario';

type Props = {
  aberto: boolean;
  funcionario: Funcionario | null;
  onFechar: () => void;
  onInativar: (funcionarioAtualizado: Funcionario) => void;
};

export function RemoverFuncionariosView({
  aberto,
  funcionario,
  onFechar,
  onInativar,
}: Props) {
  const [carregando, setCarregando] = useState(false);
  const [erroGeral, setErroGeral] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleConfirmarInativacao = async () => {
    if (!funcionario) return;

    setErroGeral('');
    setCarregando(true);

    try {
      
      const resp = await axios.patch<Funcionario>(
        `/api/funcionarios/${funcionario.cpf}/inativar`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      setSucesso(true);
     
      setTimeout(() => {
        onInativar(resp.data);
        onFechar();
      }, 1500);
    } catch (err) {
      setErroGeral(
        axios.isAxiosError(err)
          ? err.response?.data?.message || 'Erro ao inativar funcionário'
          : 'Erro inesperado'
      );
      setCarregando(false);
    }
  };

  return (
    <Dialog open={aberto} onClose={onFechar} fullWidth maxWidth="xs">
      <DialogTitle>Confirmar Remoção</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {erroGeral && <Alert severity="error">{erroGeral}</Alert>}
          {sucesso && (
            <Alert severity="success">
              Funcionário(a) inativado(a) com sucesso!
            </Alert>
          )}
          <Typography>
            Deseja realmente <strong>inativar</strong> o(a) funcionário(a){' '}
            <strong>{funcionario?.nome}</strong>?
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onFechar} disabled={carregando || sucesso}>
          Cancelar
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={handleConfirmarInativacao}
          disabled={carregando || sucesso}
          startIcon={carregando ? <CircularProgress size={20} /> : null}
        >
          {carregando ? 'Inativando...' : 'Inativar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
