import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Paper,
  Typography,
} from '@mui/material';

export type Voo = {
  codigo: string;
  origem: any;
  destino: any;
  dataHora: string;
  preco: number;
  estado: string;
};

type Props = {
  voos: Voo[];
  onSelecionar: (voo: Voo) => void;
};

export function TabelaVoos({ voos, onSelecionar }: Props) {
  if (voos.length === 0) {
    return <Typography>Nenhum voo encontrado.</Typography>;
  }

  // Função para mostrar nome/código do aeroporto
  const renderAeroporto = (aeroporto: any) => {
    if (!aeroporto) return '-';
    if (typeof aeroporto === 'string') return aeroporto;
    if (typeof aeroporto === 'object') {
      // Mostra nome, se não existir mostra códigoAeroporto
      return aeroporto.nome || aeroporto.codigoAeroporto || '-';
    }
    return '-';
  };

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Origem</TableCell>
            <TableCell>Destino</TableCell>
            <TableCell>Data/Hora</TableCell>
            <TableCell>Preço</TableCell>
            <TableCell>Ação</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {voos.map((voo) => (
            <TableRow key={voo.codigo}>
              <TableCell>{voo.codigo}</TableCell>
              <TableCell>{renderAeroporto(voo.origem)}</TableCell>
              <TableCell>{renderAeroporto(voo.destino)}</TableCell>
              <TableCell>{new Date(voo.dataHora).toLocaleString('pt-BR')}</TableCell>
              <TableCell>
                {typeof voo.preco === 'number'
                  ? new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(voo.preco)
                  : 'Preço inválido'}
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => {
                    console.log('Selecionado:', voo);
                    onSelecionar(voo);
                  }}
                >
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
