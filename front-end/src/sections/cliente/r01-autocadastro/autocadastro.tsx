import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { useRouter } from 'src/routes/hooks';

// Define o tipo dos dados do cliente
type Cliente = {
  cpf: string;
  nome: string;
  email: string;
  cep: string;
  ruaNumero: string;
  complemento: string;
  cidade: string;
  uf: string;
  milhas: number;
  senha: string;
};

// Simula o cadastro de cliente (simula uma chamada ao backend)
async function registrarCliente(dados: Cliente): Promise<Cliente> {
  return new Promise((resolve) => setTimeout(() => resolve(dados), 1500));
}

// Consulta o endereço baseado no CEP
async function buscarEndereco(cep: string): Promise<any> {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!response.ok) throw new Error('Erro ao buscar CEP');
  return response.json();
}

export function AutoCadastroView() {
  const router = useRouter(); // Para redirecionar para outra página

  useEffect(() => {
    document.title = 'Autocadastro';
  }, []);

  // Campos do formulário
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
  const [autocadastroSucesso, setAutocadastroSucesso] = useState(false); // Indica se o cadastro foi concluído

  // Gera uma senha numérica aleatória com 4 dígitos
  const gerarSenha = () => Math.floor(1000 + Math.random() * 9000).toString();

  // Consulta o endereço com base no CEP informado e preenche os campos relacionados
  const handleBuscarEndereco = async () => {
    if (cep.length !== 8) return;
    try {
      const data = await buscarEndereco(cep);
      setRuaNumero(`${data.logradouro}, `);
      setCidade(data.localidade);
      setUf(data.uf);
    } catch (err) {
      console.error('Erro ao buscar endereço:', err);
    }
  };

  // Verifica se todos os campos estão preenchidos
  const camposPreenchidos = () =>
    cpf && nome && email && cep && ruaNumero && complemento && cidade && uf;
  
  const handleCadastro = async () => {
    if (!camposPreenchidos()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const senha = gerarSenha();
    setSenhaGerada(senha); // Armazena senha para exibir depois

    // Cria objeto com dados do cliente
    const dadosCliente: Cliente = {
      cpf,
      nome,
      email,
      cep,
      ruaNumero,
      complemento,
      cidade,
      uf,
      milhas: 0,
      senha,
    };

    localStorage.setItem('cliente_autocadastro', JSON.stringify(dadosCliente)); // Armazena localmente

    setLoading(true); // Ativa o estado de 'carregamento'
    try {
      await registrarCliente(dadosCliente); // Simula envio
      setAutocadastroSucesso(true); // Ativa alerta de sucesso
    } catch (error) {
      console.error('Erro ao registrar cliente:', error);
    } finally {
      setLoading(false); // Finaliza carregamento
    }
  };

  // Props padrão para os campos obrigatórios
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
          <TextField label="CPF" fullWidth {...propsObrigatorios} value={cpf} onChange={(e) => setCpf(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Nome completo" fullWidth {...propsObrigatorios} value={nome} onChange={(e) => setNome(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="E-mail" fullWidth {...propsObrigatorios} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="CEP" fullWidth {...propsObrigatorios} value={cep} onChange={(e) => setCep(e.target.value)} onBlur={handleBuscarEndereco} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Rua e Número" fullWidth {...propsObrigatorios} value={ruaNumero} onChange={(e) => setRuaNumero(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Complemento" fullWidth {...propsObrigatorios} value={complemento} onChange={(e) => setComplemento(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Cidade" fullWidth {...propsObrigatorios} value={cidade} onChange={(e) => setCidade(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Estado" fullWidth {...propsObrigatorios} value={uf} onChange={(e) => setUf(e.target.value)} />
        </Grid>

        {autocadastroSucesso && (
          <Grid item xs={12}>
            <Alert severity="success" variant="outlined" sx={{ mb: 2 }}>
              Autocadastro realizado com sucesso! Sua senha é: <strong>{senhaGerada}</strong>
            </Alert>
          </Grid>
        )}

        <Grid item xs={12}>
        <Stack direction="row" spacing={2} justifyContent="center">
            <LoadingButton
              size="large"
              color="inherit"
              variant="contained"
              loading={loading}
              onClick={handleCadastro}
            >
              Criar Conta
            </LoadingButton>
            <Button
              size="large"
              color="inherit"
              variant="contained"
              disabled={!autocadastroSucesso} // Só habilita após sucesso
              onClick={() => router.push('/sign-in')}
            >
              Ir para Login
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
