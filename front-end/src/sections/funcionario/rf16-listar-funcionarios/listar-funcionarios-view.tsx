import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { DashboardContent } from 'src/layouts/dashboard';
import { TabelaFuncionarios } from './tabela-funcionarios-view';
import { InserirFuncionariosView } from '../r17-inserir-funcionarios/inserir-funcionarios-view';

// Tipo do funcionário
type Funcionario = {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
};

export function ListarFuncionariosView() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [abrirModal, setAbrirModal] = useState(false);

  // Carrega do localStorage
  useEffect(() => {
    const lista = JSON.parse(localStorage.getItem('funcionarios') || '[]');
    const ordenados = lista.sort((a: Funcionario, b: Funcionario) =>
      a.nome.localeCompare(b.nome)
    );
    setFuncionarios(ordenados);
  }, []);

  // Insere novo e atualiza a lista local
  const handleInserirFuncionario = (novo: Funcionario) => {
    const atualizados = [...funcionarios, novo].sort((a, b) =>
      a.nome.localeCompare(b.nome)
    );
    setFuncionarios(atualizados);
  };

  return (
    <>
      <Helmet>
        <title>Listagem de Funcionários</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Listagem de Funcionários</Typography>
          <Button variant="contained" onClick={() => setAbrirModal(true)}>
            Adicionar novo
          </Button>
        </Box>

        <TabelaFuncionarios funcionarios={funcionarios} />

        <InserirFuncionariosView
          aberto={abrirModal}
          onFechar={() => setAbrirModal(false)}
          onInserir={handleInserirFuncionario}
        />
      </DashboardContent>
    </>
  );
}