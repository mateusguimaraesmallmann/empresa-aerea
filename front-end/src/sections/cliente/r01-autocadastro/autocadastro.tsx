import { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import InputMask from 'react-input-mask';
import { useRouter } from 'src/routes/hooks';

type RegisterResponse = {
  id: string;
  email: string;
  senha: string;
};

export function AutoCadastroView() {
  const router = useRouter();

  useEffect(() => {
    document.title = 'Autocadastro';
  }, []);

  // Estados do formulário
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [ruaNumero, setRuaNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');

  const [senhaGerada, setSenhaGerada] = useState('');
  const [loading, setLoading] = useState(false);
  const [autocadastroSucesso, setAutocadastroSucesso] = useState(false);
  const [erroCadastro, setErroCadastro] = useState('');
  const [erros, setErros] = useState<{ [campo: string]: boolean }>({});

  // Busca endereço pelo CEP
  const handleBuscarEndereco = async () => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      setRuaNumero(response.data.logradouro || '');
      setCidade(response.data.localidade || '');
      setUf(response.data.uf || '');
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      setErroCadastro('CEP não encontrado');
      setTimeout(() => setErroCadastro(''), 4000);
    }
  };

  // Validação dos campos
  const validarCampos = () => {
    const novosErros = {
      cpf: cpf.replace(/\D/g, '').length !== 11,
      nome: nome.trim() === '',
      email: !/^\S+@\S+\.\S+$/.test(email),
      cep: cep.replace(/\D/g, '').length !== 8,
    };

    setErros(novosErros);
    return !Object.values(novosErros).some(Boolean);
  };

  // Envio do formulário
  const handleCadastro = async () => {
    if (!validarCampos()) return;

    setLoading(true);
    setErroCadastro('');

    try {
      const response = await axios.post<RegisterResponse>(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          cpf: cpf.replace(/\D/g, ''),
          nome,
          email,
          cep: cep.replace(/\D/g, ''),
        }
      );

      setSenhaGerada(response.data.senha);
      setAutocadastroSucesso(true);
      
      // Limpar campos
      setCpf('');
      setNome('');
      setEmail('');
      setCep('');
      setRuaNumero('');
      setComplemento('');
      setCidade('');
      setUf('');

    } catch (error: any) {
      if (error.response?.status === 409) {
        setErroCadastro('CPF ou e-mail já cadastrado');
      } else {
        setErroCadastro('Erro ao realizar cadastro. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Configuração de campos obrigatórios
  const propsObrigatorios = {
    required: true,
    InputLabelProps: { required: false },
  };

  return (
    <Box
      sx={{
        width: '900px',
        maxWidth: '1000px',
        mx: 'auto',
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: 'background.paper',
        mt: 20,
      }}
    >
      <Typography variant="h5" sx={{ mb: 4, textAlign: 'center' }}>
        Realize seu Autocadastro!
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <InputMask
            mask="999.999.999-99"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          >
            {(inputProps: any) => (
              <TextField
                {...inputProps}
                label="CPF"
                fullWidth
                error={erros.cpf}
                helperText={erros.cpf && 'CPF inválido (11 dígitos)'}
                {...propsObrigatorios}
              />
            )}
          </InputMask>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Nome completo"
            fullWidth
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            error={erros.nome}
            helperText={erros.nome && 'Nome é obrigatório'}
            {...propsObrigatorios}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="E-mail"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={erros.email}
            helperText={erros.email && 'E-mail inválido'}
            {...propsObrigatorios}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <InputMask
            mask="99999-999"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            onBlur={handleBuscarEndereco}
          >
            {(inputProps: any) => (
              <TextField
                {...inputProps}
                label="CEP"
                fullWidth
                error={erros.cep}
                helperText={erros.cep && 'CEP inválido'}
                {...propsObrigatorios}
              />
            )}
          </InputMask>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Rua e Número"
            fullWidth
            value={ruaNumero}
            onChange={(e) => setRuaNumero(e.target.value)}
            {...propsObrigatorios}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Complemento"
            fullWidth
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
            {...propsObrigatorios}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Cidade"
            fullWidth
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            {...propsObrigatorios}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Estado"
            fullWidth
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            {...propsObrigatorios}
          />
        </Grid>

        {erroCadastro && (
          <Grid item xs={12}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {erroCadastro}
            </Alert>
          </Grid>
        )}

        {autocadastroSucesso && (
          <Grid item xs={12}>
            <Alert
              severity="success"
              onClose={() => setAutocadastroSucesso(false)}
              sx={{ mb: 2 }}
            >
              Cadastro realizado! Sua senha é: <strong>{senhaGerada}</strong>
            </Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <LoadingButton
              size="large"
              variant="contained"
              loading={loading}
              onClick={handleCadastro}
            >
              Criar Conta
            </LoadingButton>
            <Button
              size="large"
              variant="outlined"
              onClick={() => router.push('/login')}
            >
              Voltar para Login
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}