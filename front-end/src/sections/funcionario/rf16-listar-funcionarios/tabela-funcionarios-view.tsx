import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Button,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Iconify } from 'src/components/iconify';
import { Funcionario } from '../types/funcionario';

type Props = {
  funcionarios: Funcionario[];
  onRemover: (funcionario: Funcionario) => void;
  onReativar: (funcionario: Funcionario) => void;
};

function formatarCPF(cpf: string): string {
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

export function TabelaFuncionarios({ funcionarios, onRemover, onReativar }: Props) {
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
          {funcionarios.map((funcionario) => (
            <TableRow
              key={funcionario.id}
              sx={{
                opacity: funcionario.ativo ? 1 : 0.5,
                color: funcionario.ativo ? 'inherit' : 'gray'
              }}
            >
              <TableCell>{funcionario.nome}</TableCell>
              <TableCell>{formatarCPF(funcionario.cpf)}</TableCell>
              <TableCell>{funcionario.email}</TableCell>
              <TableCell>{funcionario.telefone}</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  {funcionario.ativo ? (
                    <Button
                      size="small"
                      aria-label="Editar"
                      startIcon={<Iconify icon="mdi:pencil" width={18} />}
                      onClick={() => navigate(`/alterar-funcionario?id=${funcionario.id}`)}
                    >
                      Editar
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      aria-label="Reativar"
                      startIcon={<Iconify icon="mdi:refresh" width={18} />}
                      onClick={() => onReativar(funcionario)}
                    >
                      Reativar
                    </Button>
                  )}

                  <Button
                    size="small"
                    color="error"
                    aria-label="Remover"
                    startIcon={<Iconify icon="mdi:delete" width={18} />}
                    onClick={() => onRemover(funcionario)}
                    disabled={!funcionario.ativo}
                  >
                    Remover
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
