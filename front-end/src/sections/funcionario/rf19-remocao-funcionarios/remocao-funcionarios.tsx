import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Stack,
    Alert,
  } from '@mui/material';
  import { useState } from 'react';
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
    const [mostrarSucesso, setMostrarSucesso] = useState(false);
  
    const handleConfirmarInativacao = () => {
      if (!funcionario) return;
  
      const lista: Funcionario[] = JSON.parse(localStorage.getItem('funcionarios') || '[]');
      const index = lista.findIndex((f) => f.id === funcionario.id);
  
      if (index !== -1) {
        lista[index].ativo = false;
        localStorage.setItem('funcionarios', JSON.stringify(lista));
        setMostrarSucesso(true);
  
        setTimeout(() => {
          onInativar(lista[index]);
          setMostrarSucesso(false);
          onFechar();
        }, 2000);
      } else {
        onFechar();
      }
    };
  
    return (
      <Dialog open={aberto} onClose={onFechar}>
        <DialogTitle>Confirmar Remoção</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {mostrarSucesso && (
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
          <Button onClick={onFechar} disabled={mostrarSucesso}>
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmarInativacao}
            disabled={mostrarSucesso}
          >
            Remover
          </Button>
        </DialogActions>
      </Dialog>
    );
  }  