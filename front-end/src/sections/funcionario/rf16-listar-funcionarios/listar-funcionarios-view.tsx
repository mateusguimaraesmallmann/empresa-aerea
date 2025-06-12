
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Typography, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from 'src/api/api';
import { DashboardContent } from 'src/layouts/dashboard';
import { Funcionario } from '../types/funcionario';
import { TabelaFuncionarios } from './tabela-funcionarios-view';

export function ListarFuncionariosView() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [erroCarregamento, setErroCarregamento] = useState<string>('');
  const [carregando, setCarregando] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarFuncionarios = async () => {
      console.log('🔍 carregando funcionários...');
      try {
        const response = await api.get<Funcionario[]>('/funcionarios');
        console.log('✔ resposta:', response.data);
        const ordenados = response.data.sort((a, b) =>
          a.nome.localeCompare(b.nome)
        );
        setFuncionarios(ordenados);
      } catch (e) {
        console.error('Erro ao carregar:', e);
        setErroCarregamento('Falha ao carregar funcionários');
      } finally {
        setCarregando(false);
      }
    };
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

        {erroCarregamento && <Alert severity="error" sx={{ mb: 2 }}>{erroCarregamento}</Alert>}

        {carregando
          ? <Typography>Carregando funcionários...</Typography>
          : <TabelaFuncionarios
              funcionarios={funcionarios}
              onRemover={handleRemover}
              onReativar={handleReativar}
            />
        }
      </DashboardContent>
    </>
  );
}