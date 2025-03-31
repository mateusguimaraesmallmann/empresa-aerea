// front-end/src/sections/reserva/components/tabela-voos.tsx
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Paper, Typography } from '@mui/material';

export type Voo = {
  id: string;
  origem: string;
  destino: string;
  dataHora: string;
  preco: number;
};

type Props = {
  voos: Voo[];
  onSelecionar: (voo: Voo) => void;
};

export function TabelaVoos({ voos, onSelecionar }: Props) {
  if (voos.length === 0) {
    return <Typography>Nenhum voo encontrado.</Typography>;
  }

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Origem</TableCell>
            <TableCell>Destino</TableCell>
            <TableCell>Data/Hora</TableCell>
            <TableCell>Preço (R$)</TableCell>
            <TableCell>Ação</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {voos.map((voo) => (
            <TableRow key={voo.id}>
              <TableCell>{voo.origem}</TableCell>
              <TableCell>{voo.destino}</TableCell>
              <TableCell>{new Date(voo.dataHora).toLocaleString('pt-BR')}</TableCell>
              <TableCell>{voo.preco.toFixed(2)}</TableCell>
              <TableCell>
                <Button variant="contained" onClick={() => onSelecionar(voo)}>
                  Selecionar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
