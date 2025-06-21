import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Stack, Alert, CircularProgress
} from '@mui/material';
import { Funcionario } from '../types/funcionario';
import { reativarFuncionario } from '../../../api/funcionario/funcionario';

type Props = {
  aberto: boolean;
  funcionario: Funcionario | null;
  onFechar: () => void;
  onReativar: (funcionarioAtualizado: Funcionario) => void;
};

export function ReativarFuncionariosView({
  aberto, funcionario, onFechar, onReativar
}: Props) {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleReativar = async () => {
    if (!funcionario) return;

    setCarregando(true);
    setErro('');

    try {
      const atualizado = await reativarFuncionario(funcionario.cpf);
      setSucesso(true);
      setTimeout(() => {
        onReativar(atualizado);
        onFechar();
      }, 1500);
    } catch (err) {
      setErro('Erro ao reativar funcionário');
      setCarregando(false);
    }
  };

  return (
    <Dialog open={aberto} onClose={onFechar} fullWidth maxWidth="xs">
      <DialogTitle>Reativar Funcionário</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {erro && <Alert severity="error">{erro}</Alert>}
          {sucesso && <Alert severity="success">Funcionário reativado com sucesso!</Alert>}
          <Typography>
            Deseja realmente <strong>reativar</strong> o(a) funcionário(a) <strong>{funcionario?.nome}</strong>?
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onFechar} disabled={carregando || sucesso}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleReativar}
          disabled={carregando || sucesso}
          startIcon={carregando ? <CircularProgress size={20} /> : null}
        >
          {carregando ? 'Reativando...' : 'Reativar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}