import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Alert, Stack, CircularProgress
} from '@mui/material';
import InputMask from 'react-input-mask';
import axios from 'axios';
import { Funcionario } from '../types/funcionario';
import { atualizarFuncionario } from '../../../api/funcionario/funcionario';


type Props = {
  aberto: boolean;
  funcionario: Funcionario | null;
  onFechar: () => void;
  onAtualizado: () => void;
};

export function AlteracaoFuncionariosView({
  aberto, funcionario, onFechar, onAtualizado
}: Props) {
  const [dados, setDados] = useState<Omit<Funcionario, 'id' | 'senha' | 'cpf' | 'ativo'>>({
    nome: '',
    email: '',
    telefone: '',
  });
  const [erros, setErros] = useState<Partial<Record<keyof typeof dados, string>>>({});
  const [erroGeral, setErroGeral] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (funcionario) {
      setDados({
        nome: funcionario.nome,
        email: funcionario.email,
        telefone: funcionario.telefone,
      });
      setErros({});
      setErroGeral('');
      setSucesso(false);
    }
  }, [funcionario]);

  const validarCampos = (): boolean => {
    const novosErros: typeof erros = {};
    const telLimpo = dados.telefone.replace(/\D/g, '');

    if (!dados.nome.trim()) {
      novosErros.nome = 'Nome obrigatório';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
      novosErros.email = 'E‑mail inválido';
    }
    if (telLimpo.length < 10) {
      novosErros.telefone = 'Telefone incompleto';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleAtualizar = async () => {
    if (!funcionario) return;
    setErroGeral('');
    if (!validarCampos()) return;

    setCarregando(true);
    try {
      await atualizarFuncionario(funcionario.cpf, {
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone.replace(/\D/g, ''),
        ativo: funcionario.ativo ?? true
      });      
      
      setSucesso(true);
      
      setTimeout(() => {
        onAtualizado();
        onFechar();
      }, 1500);
    } catch (err) {
      setErroGeral(
        axios.isAxiosError(err)
          ? err.response?.data?.message || 'Erro ao atualizar'
          : 'Erro inesperado'
      );
    } finally {
      setCarregando(false);
    }
  };

  const commonProps = {
    fullWidth: true,
    required: true,
    InputLabelProps: { required: false }
  };

  return (
    <Dialog open={aberto} onClose={onFechar} fullWidth maxWidth="sm">
      <DialogTitle>Alterar Funcionário</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {erroGeral && <Alert severity="error">{erroGeral}</Alert>}
          {sucesso && <Alert severity="success">Atualização realizada!</Alert>}

          <TextField
            label="Nome"
            value={dados.nome}
            onChange={e => setDados({ ...dados, nome: e.target.value })}
            error={!!erros.nome}
            helperText={erros.nome}
            {...commonProps}
          />

          <TextField
            label="CPF"
            value={funcionario?.cpf ?? ''}
            disabled
            fullWidth
          />

          <TextField
            label="E‑mail"
            type="email"
            value={dados.email}
            onChange={e => setDados({ ...dados, email: e.target.value })}
            error={!!erros.email}
            helperText={erros.email}
            {...commonProps}
          />

          <InputMask
            mask="(99) 99999-9999"
            value={dados.telefone}
            onChange={e => setDados({ ...dados, telefone: e.target.value })}
          >
            {(inputProps: any) => (
              <TextField
                {...inputProps}
                label="Telefone"
                error={!!erros.telefone}
                helperText={erros.telefone}
                {...commonProps}
              />
            )}
          </InputMask>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onFechar} disabled={carregando}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleAtualizar}
          disabled={carregando}
          startIcon={carregando ? <CircularProgress size={20} /> : null}
        >
          {carregando ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
