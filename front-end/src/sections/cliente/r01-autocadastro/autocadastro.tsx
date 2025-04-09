import { useState, useEffect } from 'react';
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

// Define o tipo para representar os dados do cliente
type Cliente = {
  id: number;
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

// Simula o registro de cliente
async function registrarCliente(dados: Cliente): Promise<Cliente> {
  return new Promise((resolve) => setTimeout(() => resolve(dados), 1500));
}

// Busca endereço com base no CEP
async function buscarEndereco(cep: string): Promise<any> {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!response.ok) throw new Error('Erro ao buscar CEP');
  return response.json();
}

export function AutoCadastroView() {
  const router = useRouter();

  useEffect(() => {
    document.title = 'Autocadastro';
  }, []);

  // Estados dos campos do formulário
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

  // Gera uma senha aleatória de 4 dígitos
  const gerarSenha = () => Math.floor(1000 + Math.random() * 9000).toString();

  // Busca o endereço automaticamente
  const handleBuscarEndereco = async () => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    try {
      const data = await buscarEndereco(cepLimpo);
      setRuaNumero(`${data.logradouro}, `);
      setCidade(data.localidade);
      setUf(data.uf);
    } catch (err) {
      console.error('Erro ao buscar endereço:', err);
    }
  };

  // Valida se todos os campos obrigatórios foram preenchidos 
  const validarCampos = () => {
    const limparCPF = cpf.replace(/\D/g, '');
    const limparCEP = cep.replace(/\D/g, '');

    const novosErros: { [campo: string]: boolean } = {
      cpf: limparCPF.length !== 11,
      nome: !nome,
      email: !email,
      cep: limparCEP.length !== 8,
      ruaNumero: !ruaNumero,
      complemento: !complemento,
      cidade: !cidade,
      uf: !uf,
    };

    setErros(novosErros);
    return !Object.values(novosErros).includes(true);
  };

  // Lógica principal de cadastro do cliente
  const handleCadastro = async () => {
    if (!validarCampos()) return;

    const limparCPF = cpf.replace(/\D/g, '');
    const emailFormatado = email.toLowerCase();
    const senha = gerarSenha();

    // Recupera lista de clientes já cadastrados
    const clientesExistentes: Cliente[] = JSON.parse(localStorage.getItem('clientes') || '[]');

    // Verifica se CPF ou e-mail já existem
    const cpfExiste = clientesExistentes.some((c) => c.cpf === limparCPF);
    const emailExiste = clientesExistentes.some((c) => c.email.toLowerCase() === emailFormatado);

    if (cpfExiste || emailExiste) {
      setErroCadastro('Já existe um cliente com este CPF ou E-mail!');
      setTimeout(() => setErroCadastro(''), 4000);
      return;
    }

    // Gera ID automático com base no maior ID existente
    const novoId = clientesExistentes.length > 0
      ? Math.max(...clientesExistentes.map(c => c.id)) + 1
      : 1;

    const novoCliente: Cliente = {
      id: novoId,
      cpf: limparCPF,
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

    // Atualiza localStorage com o novo cliente
    const listaAtualizada = [...clientesExistentes, novoCliente];
    localStorage.setItem('clientes', JSON.stringify(listaAtualizada));

    setLoading(true);
    try {
      await registrarCliente(novoCliente);
      setSenhaGerada(senha);
      setAutocadastroSucesso(true);

      // Limpa campos após sucesso
      setCpf('');
      setNome('');
      setEmail('');
      setCep('');
      setRuaNumero('');
      setComplemento('');
      setCidade('');
      setUf('');
      setErros({});
    } catch (error) {
      console.error('Erro ao registrar cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  // Define as propriedades padrão para os campos obrigatórios
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
        {/* Campos do formulário com máscaras, validação e mensagens de erro */}

        {/* CPF com máscara */}
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
                {...propsObrigatorios}
                error={erros.cpf}
                helperText={erros.cpf ? 'O CPF é obrigatório e deve conter 11 dígitos!' : ''}
              />
            )}
          </InputMask>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Nome completo"
            fullWidth
            {...propsObrigatorios}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            error={erros.nome}
            helperText={erros.nome ? 'O nome é obrigatório!' : ''}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="E-mail"
            fullWidth
            {...propsObrigatorios}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={erros.email}
            helperText={erros.email ? 'O e-mail é obrigatório!' : ''}
          />
        </Grid>

        {/* CEP com máscara e preenchimento automático */}
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
                {...propsObrigatorios}
                error={erros.cep}
                helperText={erros.cep ? 'O CEP é obrigatório!' : ''}
              />
            )}
          </InputMask>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Rua e Número"
            fullWidth
            {...propsObrigatorios}
            value={ruaNumero}
            onChange={(e) => setRuaNumero(e.target.value)}
            error={erros.ruaNumero}
            helperText={erros.ruaNumero ? 'A rua e número são obrigatórios!' : ''}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Complemento"
            fullWidth
            {...propsObrigatorios}
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
            error={erros.complemento}
            helperText={erros.complemento ? 'O complemento é obrigatório!' : ''}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Cidade"
            fullWidth
            {...propsObrigatorios}
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            error={erros.cidade}
            helperText={erros.cidade ? 'A cidade é obrigatória!' : ''}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Estado"
            fullWidth
            {...propsObrigatorios}
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            error={erros.uf}
            helperText={erros.uf ? 'O estado é obrigatório!' : ''}
          />
        </Grid>

        {/* Mensagem de erro se CPF ou e-mail já existirem */}
        {erroCadastro && (
          <Grid item xs={12}>
            <Alert severity="error" variant="outlined" sx={{ mb: 2 }}>
              {erroCadastro}
            </Alert>
          </Grid>
        )}

        {/* Mensagem de sucesso com senha gerada */}
        {autocadastroSucesso && (
          <Grid item xs={12}>
            <Alert
              severity="success"
              variant="outlined"
              sx={{ mb: 2 }}
              onClose={() => setAutocadastroSucesso(false)}
            >
              Autocadastro realizado com sucesso! Sua senha é: <strong>{senhaGerada}</strong>
            </Alert>
          </Grid>
        )}

        {/* Botões de ação */}
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
              disabled={!autocadastroSucesso}
              onClick={() => router.push('/login')}
            >
              Ir para Login
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}