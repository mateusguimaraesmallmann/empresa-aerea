import React from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, Button, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Iconify } from 'src/components/iconify';
import { Funcionario } from '../types/funcionario';

type Props = {
  funcionarios: Funcionario[];
  onRemover: (func: Funcionario) => void;
  onReativar: (func: Funcionario) => void;
  onEditar: (func: Funcionario) => void;
};

function formatarCPF(cpf: string): string {
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

export function TabelaFuncionarios({ funcionarios, onRemover, onReativar, onEditar }: Props) {
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>CPF</TableCell>
            <TableCell>E-mail</TableCell>
            <TableCell>Telefone</TableCell>
            <TableCell align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {funcionarios.map(func => (
            <TableRow
              key={func.id}
              sx={{ opacity: func.ativo ? 1 : 0.5, color: func.ativo ? 'inherit' : 'gray' }}
            >
              <TableCell>{func.nome}</TableCell>
              <TableCell>{formatarCPF(func.cpf)}</TableCell>
              <TableCell>{func.email}</TableCell>
              <TableCell>{func.telefone}</TableCell>
              <TableCell>
                <Box display="flex" gap={1}>
                  {func.ativo ? (
                    <Button
                      size="small"
                      startIcon={<Iconify icon="mdi:pencil" width={18} />}
                      onClick={() => onEditar(func)}
                    >Editar</Button>
                  ) : (
                    <Button
                      size="small"
                      startIcon={<Iconify icon="mdi:refresh" width={18} />}
                      onClick={() => onReativar(func)}
                    >Reativar</Button>
                  )}
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Iconify icon="mdi:delete" width={18} />}
                    onClick={() => onRemover(func)}
                    disabled={!func.ativo}
                  >Desativar</Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}