import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { DashboardContent } from 'src/layouts/dashboard';
import { Funcionario } from '../types/funcionario';
import { TabelaFuncionarios } from './tabela-funcionarios-view';
import { InserirFuncionariosView } from '../r17-inserir-funcionarios/inserir-funcionarios-view';
import { RemoverFuncionariosView } from '../r19-remocao-funcionarios/rf19-remocao-funcionarios';
import { AlteracaoFuncionariosView } from '../r18-alteracao-funcionario/rf18-alteracao-funcionarios-view';

export function ListarFuncionariosView() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [abrirModal, setAbrirModal] = useState(false);

  const [funcionarioRemovendo, setFuncionarioRemovendo] = useState<Funcionario | null>(null);

  // Carrega do localStorage
  useEffect(() => {
    const lista: Funcionario[] = JSON.parse(localStorage.getItem('funcionarios') || '[]');
    const ativos = lista.filter((f) => f.ativo); // ✅ Apenas ativos
    const ordenados = ativos.sort((a, b) => a.nome.localeCompare(b.nome));
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
            Adicionar +
          </Button>
        </Box>

        <TabelaFuncionarios
          funcionarios={funcionarios}
          onRemover={(funcionario) => setFuncionarioRemovendo(funcionario)}
        />

        <InserirFuncionariosView
          aberto={abrirModal}
          onFechar={() => setAbrirModal(false)}
          onInserir={handleInserirFuncionario}
        />

        <RemoverFuncionariosView
          aberto={!!funcionarioRemovendo}
          funcionario={funcionarioRemovendo}
          onFechar={() => setFuncionarioRemovendo(null)}
          onInativar={(funcionarioInativado) => {
            const atualizados = funcionarios.map((f) =>
              f.id === funcionarioInativado.id ? funcionarioInativado : f
            );
            localStorage.setItem('funcionarios', JSON.stringify(atualizados));
            setFuncionarios(atualizados.filter((f) => f.ativo));
            setFuncionarioRemovendo(null);
          }}
        />
      </DashboardContent>
    </>
  );
}