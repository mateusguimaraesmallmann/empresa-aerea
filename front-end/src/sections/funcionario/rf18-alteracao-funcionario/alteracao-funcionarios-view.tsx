
import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Alert, Stack, CircularProgress
} from '@mui/material';
import InputMask from 'react-input-mask';
import api from 'src/api/api';
import { Funcionario } from '../types/funcionario';

type Props = {
  aberto: boolean;
  funcionario: Funcionario | null;
  onFechar: () => void;
  onAtualizado: () => void;
};

export function AlteracaoFuncionariosView({
  aberto, funcionario, onFechar, onAtualizado
}: Props) {
  // estado só com os campos editáveis
  const [dados, setDados] = useState<{
    nome: string;
    email: string;
    telefone: string;
  }>({ nome: '', email: '', telefone: '' });

  const [erros, setErros] = useState<Partial<Record<keyof typeof dados, string>>>({});
  const [erroGeral, setErroGeral] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // sempre que mudar o `funcionario` abrindo o modal, preenche o form
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

  // validação simples
  const validarCampos = (): boolean => {
    const ne: typeof erros = {};
    if (!dados.nome.trim()) ne.nome = 'Nome obrigatório';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) ne.email = 'E‑mail inválido';
    if (dados.telefone.replace(/\D/g, '').length < 10)
      ne.telefone = 'Telefone incompleto';
    setErros(ne);
    return Object.keys(ne).length === 0;
  };

  const handleAtualizar = async () => {
    if (!funcionario) return;
    setErroGeral('');
    if (!validarCampos()) return;

    setCarregando(true);
    try {
      await api.put(
        `/funcionarios/${funcionario.cpf}`,
        {
          nome: dados.nome,
          email: dados.email,
          telefone: dados.telefone.replace(/\D/g, '')
        }
      );

      setSucesso(true);
      // espera 1.5s para mostrar o alerta de sucesso
      setTimeout(() => {
        onAtualizado();
        onFechar();
      }, 1500);

    } catch (err: any) {
      setErroGeral(
        err.response?.data?.message
          ? String(err.response.data.message)
          : 'Erro ao atualizar'
      );
    } finally {
      setCarregando(false);
    }
  };

  const commonProps = {
    fullWidth: true,
    InputLabelProps: { required: false },
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
            {...commonProps}
            value={dados.nome}
            onChange={e => setDados({ ...dados, nome: e.target.value })}
            error={!!erros.nome}
            helperText={erros.nome}
          />

          <TextField
            label="CPF"
            {...commonProps}
            value={funcionario?.cpf ?? ''}
            disabled
          />

          <TextField
            label="E‑mail"
            type="email"
            {...commonProps}
            value={dados.email}
            onChange={e => setDados({ ...dados, email: e.target.value })}
            error={!!erros.email}
            helperText={erros.email}
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
                {...commonProps}
                error={!!erros.telefone}
                helperText={erros.telefone}
              />
            )}
          </InputMask>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onFechar} disabled={carregando}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleAtualizar}
          disabled={carregando}
          startIcon={carregando ? <CircularProgress size={20}/> : null}
        >
          {carregando ? 'Salvando…' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
