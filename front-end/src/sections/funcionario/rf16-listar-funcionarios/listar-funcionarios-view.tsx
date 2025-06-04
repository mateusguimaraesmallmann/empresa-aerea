import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Typography, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DashboardContent } from 'src/layouts/dashboard';
import { Funcionario } from '../types/funcionario';
import { TabelaFuncionarios } from './tabela-funcionarios-view';
import axios from 'axios';

export function ListarFuncionariosView() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [erroCarregamento, setErroCarregamento] = useState('');
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarFuncionarios = async () => {
      try {
        const response = await axios.get<Funcionario[]>('/api/funcionarios', {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          }
        });

        const dadosOrdenados = response.data.sort((a: Funcionario, b: Funcionario) => 
          a.nome.localeCompare(b.nome)
        );
        
        setFuncionarios(dadosOrdenados);
      } catch (erro) {
        setErroCarregamento('Falha ao carregar funcionários');
        console.error("Erro ao carregar:", erro);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarFuncionarios();
  }, []);

  const handleRemover = async (cpf: string) => {
    try {
      await axios.delete(`/api/funcionarios/${cpf}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFuncionarios(prev => prev.filter(f => f.cpf !== cpf));
    } catch (erro) {
      console.error("Erro ao remover:", erro);
      setErroCarregamento('Falha ao remover funcionário');
    }
  };

  const handleReativarFuncionario = async (cpf: string) => {
    try {
      await axios.patch(`/api/funcionarios/${cpf}/reativar`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
      
      setFuncionarios(prev => prev.map(f => 
        f.cpf === cpf ? { ...f, ativo: true } : f
      ));
    } catch (erro) {
      console.error("Erro ao reativar:", erro);
      setErroCarregamento('Falha ao reativar funcionário');
    }
  };

  return (
    <>
      <Helmet>
        <title>Listagem de Funcionários</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Listagem de Funcionários</Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/inserir-funcionario')}
            disabled={carregando}
          >
            Adicionar +
          </Button>
        </Box>

        {erroCarregamento && (
          <Alert severity="error" sx={{ mb: 2 }}>{erroCarregamento}</Alert>
        )}

        {carregando ? (
          <Typography variant="body1">Carregando funcionários...</Typography>
        ) : (
          <TabelaFuncionarios
            funcionarios={funcionarios}
            onRemover={(funcionario) => handleRemover(funcionario.cpf)}
            onReativar={(funcionario) => handleReativarFuncionario(funcionario.cpf)}
          />
        )}
      </DashboardContent>
    </>
  );
}