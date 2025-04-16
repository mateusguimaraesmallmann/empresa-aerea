import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

type Funcionario = {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
};

type Props = {
  funcionarios: Funcionario[];
};

// Formata o CPF para exibição 
function formatarCPF(cpf: string): string {
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

export function TabelaFuncionarios({ funcionarios }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>CPF</TableCell>
            <TableCell>E-mail</TableCell>
            <TableCell>Telefone</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {funcionarios.map((funcionario, index) => (
            <TableRow key={index}>
              <TableCell>{funcionario.nome}</TableCell>
              <TableCell>{formatarCPF(funcionario.cpf)}</TableCell>
              <TableCell>{funcionario.email}</TableCell>
              <TableCell>{funcionario.telefone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}