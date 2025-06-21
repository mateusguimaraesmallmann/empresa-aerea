import { useEffect, useState } from 'react';
import {
  Helmet
} from 'react-helmet-async';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  LinearProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from 'src/api/api';
import { DashboardContent } from 'src/layouts/dashboard';
import { Funcionario } from '../types/funcionario';
import { TabelaFuncionarios } from './tabela-funcionarios-view';
import { AlteracaoFuncionariosView } from '../rf18-alteracao-funcionario/alteracao-funcionarios-view';

export function ListarFuncionariosView() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [erroCarregamento, setErroCarregamento] = useState<string>('');
  const [carregando, setCarregando] = useState<boolean>(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<Funcionario | null>(null);
  const [mensagemSnackbar, setMensagemSnackbar] = useState<string | null>(null);

  const navigate = useNavigate();

  const carregarFuncionarios = async () => {
    try {
      const response = await api.get<Funcionario[]>('/funcionarios');
      const ordenados = response.data.sort((a, b) => a.nome.localeCompare(b.nome));
      setFuncionarios(ordenados);
    } catch (e) {
      setErroCarregamento('Falha ao carregar funcionários');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const handleRemover = async (func: Funcionario) => {
    try {
      await api.patch(`/funcionarios/${func.cpf}/inativar`);
      setFuncionarios(prev =>
        prev.map(f => f.cpf === func.cpf ? { ...f, ativo: false } : f)
      );
      setMensagemSnackbar(`Funcionário(a) ${func.nome} inativado(a).`);
    } catch (e) {
      console.error('Erro ao inativar:', e);
      setErroCarregamento('Falha ao inativar funcionário');
    }
  };

  const handleReativar = async (func: Funcionario) => {
    try {
      const dto = {
        cpf: func.cpf,
        nome: func.nome,
        email: func.email,
        telefone: func.telefone,
        ativo: true,
      };
      await api.put(`/funcionarios/${func.cpf}`, dto);
      setFuncionarios(prev =>
        prev.map(f => f.cpf === func.cpf ? { ...f, ativo: true } : f)
      );
      setMensagemSnackbar(`Funcionário(a) ${func.nome} reativado(a).`);
    } catch (e) {
      console.error('Erro ao reativar:', e);
      setErroCarregamento('Falha ao reativar funcionário');
    }
  };

  return (
    <>
      <Helmet><title>Listagem de Funcionários</title></Helmet>
      <DashboardContent>
        <Box display="flex" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Listagem de Funcionários</Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/inserir-funcionario')}
            disabled={carregando}
          >Adicionar +</Button>
        </Box>

        {erroCarregamento && <Alert severity="error">{erroCarregamento}</Alert>}

        {carregando ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <LinearProgress
              sx={{
                width: '40%',
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#000000',
                },
                borderRadius: 2
              }}
            />
          </Box>
        ) : (
          <TabelaFuncionarios
            funcionarios={funcionarios}
            onRemover={handleRemover}
            onReativar={handleReativar}
            onEditar={(func) => {
              setFuncionarioSelecionado(func);
              setModalAberto(true);
            }}
          />
        )}

        <AlteracaoFuncionariosView
          aberto={modalAberto}
          funcionario={funcionarioSelecionado}
          onFechar={() => setModalAberto(false)}
          onAtualizado={carregarFuncionarios}
        />

        <Snackbar
          open={!!mensagemSnackbar}
          autoHideDuration={4000}
          onClose={() => setMensagemSnackbar(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setMensagemSnackbar(null)}
            severity="success"
            sx={{ width: '100%', backgroundColor: '#D0F2D0', color: '#1E4620' }}
          >
            {mensagemSnackbar}
          </Alert>
        </Snackbar>
      </DashboardContent>
    </>
  );
}