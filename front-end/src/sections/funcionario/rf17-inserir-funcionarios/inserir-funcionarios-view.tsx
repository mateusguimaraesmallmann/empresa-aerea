import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Alert, Stack, CircularProgress
} from '@mui/material';
import InputMask from 'react-input-mask';
import axios from 'axios';
import { Funcionario } from '../types/funcionario';

type Props = {
  aberto: boolean;
  onFechar: () => void;
  onSucesso: (funcionario: Funcionario) => void;
};

export function InserirFuncionariosView({ aberto, onFechar, onSucesso }: Props) {

  const [dados, setDados] = useState<Omit<Funcionario, 'id' | 'senha'>>({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    ativo: true,
  });

  const [erros, setErros] = useState<Partial<Record<keyof typeof dados, string>>>({});
  const [erroGeral, setErroGeral] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [senhaGerada, setSenhaGerada] = useState('');

  const limparErros = () => {
    setErros({});
    setErroGeral('');
  };

  const validarCampos = (): boolean => {
    const novosErros: typeof erros = {};
    const cpfLimpo = dados.cpf.replace(/\D/g, '');
    const telLimpo = dados.telefone.replace(/\D/g, '');

    if (!dados.nome.trim()) {
      novosErros.nome = 'Nome obrigatório';
    }
    if (cpfLimpo.length !== 11) {
      novosErros.cpf = 'CPF deve ter 11 dígitos';
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

  const handleSubmit = async () => {
    limparErros();
    if (!validarCampos()) return;

    setCarregando(true);
    try {
      const payload = {
        ...dados,
        cpf: dados.cpf.replace(/\D/g, ''),
        telefone: dados.telefone.replace(/\D/g, '')
      };

      const resp = await axios.post<Funcionario>('http://localhost:3000/api/funcionarios', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setSenhaGerada(resp.data.senha || '');
      setTimeout(() => {
        onSucesso(resp.data);
        handleFechar();
        setCarregando(false); 
      }, 5000);      

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data;
    
        if (typeof responseData === 'string') {
          setErroGeral(responseData);
        }

        else if (typeof responseData === 'object' && responseData?.message) {
          setErroGeral(responseData.message);
        } else {
          setErroGeral('Erro ao cadastrar');
        }
      } else {
        setErroGeral('Erro inesperado');
      }
      setCarregando(false); 
    }    
  };
    
  const handleFechar = () => {
    limparErros();
    setSenhaGerada('');
    setDados({ nome: '', cpf: '', email: '', telefone: '', ativo: true });
    onFechar();
  };

  const commonFieldProps = {
    fullWidth: true,
    required: true,
    InputLabelProps: { required: false }
  };

  return (
    <Dialog open={aberto} onClose={handleFechar} fullWidth maxWidth="sm">
      <DialogTitle>Cadastrar Funcionário</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {erroGeral && <Alert severity="error">{erroGeral}</Alert>}
          {senhaGerada && (
            <Alert severity="success" sx={{ mb: 1 }}>
              Funcionário cadastrado com sucesso!<br />
              <strong>Senha gerada: {senhaGerada}</strong>
            </Alert>
          )}

          <TextField
            label="Nome"
            {...commonFieldProps}
            value={dados.nome}
            onChange={e => setDados({ ...dados, nome: e.target.value })}
            error={!!erros.nome}
            helperText={erros.nome}
          />

          <InputMask
            mask="999.999.999-99"
            value={dados.cpf}
            onChange={e => setDados({ ...dados, cpf: e.target.value })}
          >
            {(inputProps: any) => (
              <TextField
                {...inputProps}
                label="CPF"
                {...commonFieldProps}
                error={!!erros.cpf}
                helperText={erros.cpf}
              />
            )}
          </InputMask>

          <TextField
            label="E‑mail"
            type="email"
            {...commonFieldProps}
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
                {...commonFieldProps}
                error={!!erros.telefone}
                helperText={erros.telefone}
              />
            )}
          </InputMask>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleFechar} disabled={carregando}>
          {senhaGerada ? 'Fechar' : 'Cancelar'}
        </Button>
        {!senhaGerada && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={carregando}
            startIcon={carregando ? <CircularProgress size={20}/> : null}
          >
            {carregando ? 'Enviando...' : 'Cadastrar'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}