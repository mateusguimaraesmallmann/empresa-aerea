import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Typography, Button, Alert } from '@mui/material';
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
      await api.delete(`/funcionarios/${func.cpf}`);
      setFuncionarios(prev => prev.filter(f => f.cpf !== func.cpf));
    } catch (e) {
      console.error('Erro ao remover:', e);
      setErroCarregamento('Falha ao remover funcionário');
    }
  };
  
  const handleReativar = async (func: Funcionario) => {
    try {
      const dto = {
        cpf: func.cpf,
        nome: func.nome,
        email: func.email,
        telefone: func.telefone
      };
      await api.put(`/funcionarios/${func.cpf}`, dto);
      setFuncionarios(prev =>
        prev.map(f => f.cpf === func.cpf ? { ...f, ativo: true } : f)
      );
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

        {!carregando && (
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
      </DashboardContent>
    </>
  );
}