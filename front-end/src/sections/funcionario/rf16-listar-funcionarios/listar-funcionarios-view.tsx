import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { DashboardContent } from 'src/layouts/dashboard';
import { Funcionario } from '../types/funcionario';
import { TabelaFuncionarios } from './tabela-funcionarios-view';
import { InserirFuncionariosView } from '../rf17-inserir-funcionarios/inserir-funcionarios-view';
import { RemoverFuncionariosView } from '../rf19-remocao-funcionarios/remocao-funcionarios';

export function ListarFuncionariosView() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [funcionarioRemovendo, setFuncionarioRemovendo] = useState<Funcionario | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const lista: Funcionario[] = JSON.parse(localStorage.getItem('funcionarios') || '[]');
    const ordenados = lista.sort((a, b) => a.nome.localeCompare(b.nome));
    setFuncionarios(ordenados);
  }, []);

  const handleInserirFuncionario = (novo: Funcionario) => {
    const atualizados = [...funcionarios, novo].sort((a, b) =>
      a.nome.localeCompare(b.nome)
    );
    setFuncionarios(atualizados);
  };

  const handleReativarFuncionario = (funcionario: Funcionario) => {
    const listaAtual: Funcionario[] = JSON.parse(localStorage.getItem('funcionarios') || '[]');
    const index = listaAtual.findIndex((f) => f.id === funcionario.id);

    if (index !== -1) {
      listaAtual[index].ativo = true;
      localStorage.setItem('funcionarios', JSON.stringify(listaAtual));
      const atualizados = listaAtual.sort((a, b) => a.nome.localeCompare(b.nome));
      setFuncionarios(atualizados);
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
          <Button variant="contained" onClick={() => navigate('/inserir-funcionario')}>
            Adicionar +
          </Button>
        </Box>

        <TabelaFuncionarios
          funcionarios={funcionarios}
          onRemover={(funcionario) => navigate(`/remover-funcionario?id=${funcionario.id}`)}
          onReativar={handleReativarFuncionario}
        />
      </DashboardContent>
    </>
  );
}