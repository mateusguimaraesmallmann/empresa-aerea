import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useNavigate } from 'react-router-dom';
import { Funcionario } from '../types/funcionario';

type Props = {
  funcionarios: Funcionario[];
  onRemover: (funcionario: Funcionario) => void;
  onReativar: (funcionario: Funcionario) => void;
};

// Formata o CPF para exibição 
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
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {funcionarios.map((funcionario, index) => (
            <TableRow
              key={index}
              sx={{
                opacity: funcionario.ativo ? 1 : 0.5,
                color: funcionario.ativo ? 'inherit' : 'gray',
              }}
            >
              <TableCell>{funcionario.nome}</TableCell>
              <TableCell>{formatarCPF(funcionario.cpf)}</TableCell>
              <TableCell>{funcionario.email}</TableCell>
              <TableCell>{funcionario.telefone}</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  {funcionario.ativo ? (
                    <Button
                      size="small"
                      color="primary"
                      startIcon={<Iconify icon="mdi:pencil" width={18} />}
                      onClick={() => navigate(`/alterar-funcionario?id=${funcionario.id}`)}
                    >
                      Alterar
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      color="primary"
                      startIcon={<Iconify icon="mdi:refresh" width={18} />}
                      onClick={() => onReativar(funcionario)}
                    >
                      Reativar
                    </Button>
                  )}

                  <Button
                    size="small"
                    color="error"
                    startIcon={<Iconify icon="mdi:delete" width={18} />}
                    onClick={() => onRemover(funcionario)}
                    sx={{ ml: 1 }}
                    disabled={!funcionario.ativo} // Desativado se inativo
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