import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert
} from '@mui/material';
import { useState } from 'react';
import InputMask from 'react-input-mask';

// Tipo do funcionário
type Funcionario = {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
};

type Props = {
  aberto: boolean;
  onFechar: () => void;
  onInserir: (funcionario: Funcionario) => void;
};

export function InserirFuncionariosView({ aberto, onFechar, onInserir }: Props) {
  const [dados, setDados] = useState<Omit<Funcionario, 'id' | 'senha'>>({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
  });

  const [senhaGerada, setSenhaGerada] = useState('');
  const [erroCadastro, setErroCadastro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [erros, setErros] = useState<{ [campo: string]: boolean }>({});

  const gerarSenha = () => Math.floor(1000 + Math.random() * 9000).toString();

  const validarCampos = () => {
    const cpfLimpo = dados.cpf.replace(/\D/g, '');
    const telefoneLimpo = dados.telefone.replace(/\D/g, '');

    const novosErros: { [campo: string]: boolean } = {
      nome: !dados.nome,
      cpf: cpfLimpo.length !== 11,
      email: !dados.email,
      telefone: telefoneLimpo.length < 10,
    };

    setErros(novosErros);
    return !Object.values(novosErros).includes(true);
  };

  const handleSubmit = () => {
    if (!validarCampos()) return;

    const funcionariosExistentes: Funcionario[] = JSON.parse(localStorage.getItem('funcionarios') || '[]');

    const cpfLimpo = dados.cpf.replace(/\D/g, '');
    const emailFormatado = dados.email.toLowerCase();

    const cpfExiste = funcionariosExistentes.some((f) => f.cpf.replace(/\D/g, '') === cpfLimpo);
    const emailExiste = funcionariosExistentes.some((f) => f.email.toLowerCase() === emailFormatado);

    if (cpfExiste || emailExiste) {
      setErroCadastro('Já existe um funcionário com este CPF ou E-mail!');
      setTimeout(() => setErroCadastro(''), 4000);
      return;
    }

    const novoId = funcionariosExistentes.length > 0
      ? Math.max(...funcionariosExistentes.map(f => f.id)) + 1
      : 1;

    const senha = gerarSenha();
    const novoFuncionario: Funcionario = {
      id: novoId,
      nome: dados.nome,
      cpf: cpfLimpo,
      email: emailFormatado,
      telefone: dados.telefone,
      senha,
    };

    console.log(`Senha enviada para ${dados.email}: ${senha}`);

    const atualizados = [...funcionariosExistentes, novoFuncionario];
    localStorage.setItem('funcionarios', JSON.stringify(atualizados));

    onInserir(novoFuncionario);
    setSenhaGerada(senha);
    setSucesso(true);
    setDados({ nome: '', cpf: '', email: '', telefone: '' });
    setErros({});
  };

  const handleFechar = () => {
    setSenhaGerada('');
    setErroCadastro('');
    setSucesso(false);
    setErros({});
    onFechar();
  };

  const propsObrigatorios = {
    required: true,
    InputLabelProps: { required: false },
  };

  return (
    <Dialog open={aberto} onClose={handleFechar} fullWidth maxWidth="sm">
      <DialogTitle>Inserir novo Funcionário</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Nome"
            fullWidth
            {...propsObrigatorios}
            value={dados.nome}
            onChange={(e) => setDados({ ...dados, nome: e.target.value })}
            error={erros.nome}
            helperText={erros.nome ? 'O nome é obrigatório.' : ''}
          />

          <InputMask
            mask="999.999.999-99"
            value={dados.cpf}
            onChange={(e) => setDados({ ...dados, cpf: e.target.value })}
          >
            {(inputProps: any) => (
              <TextField
                {...inputProps}
                label="CPF"
                fullWidth
                {...propsObrigatorios}
                error={erros.cpf}
                helperText={erros.cpf ? 'Informe um CPF válido com 11 dígitos.' : ''}
              />
            )}
          </InputMask>

          <TextField
            label="E-mail"
            fullWidth
            {...propsObrigatorios}
            value={dados.email}
            onChange={(e) => setDados({ ...dados, email: e.target.value })}
            error={erros.email}
            helperText={erros.email ? 'O e-mail é obrigatório.' : ''}
          />

          <InputMask
            mask="(99) 99999-9999"
            value={dados.telefone}
            onChange={(e) => setDados({ ...dados, telefone: e.target.value })}
          >
            {(inputProps: any) => (
              <TextField
                {...inputProps}
                label="Telefone"
                fullWidth
                {...propsObrigatorios}
                error={erros.telefone}
                helperText={erros.telefone ? 'Informe um telefone válido.' : ''}
              />
            )}
          </InputMask>

          {erroCadastro && (
            <Alert severity="error">{erroCadastro}</Alert>
          )}

          {sucesso && (
            <Alert severity="success">
              Funcionário inserido com sucesso! Sua senha é: <strong>{senhaGerada}</strong>
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleFechar}>Fechar</Button>
        <Button variant="contained" onClick={handleSubmit}>Inserir</Button>
      </DialogActions>
    </Dialog>
  );
}