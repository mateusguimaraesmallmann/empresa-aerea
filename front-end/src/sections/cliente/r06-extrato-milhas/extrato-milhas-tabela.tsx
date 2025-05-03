import { useCallback, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Label } from 'src/components/label';

export type TransacaoMilhas = {
  id: string;
  dataHora: string;
  codigoReserva: string | null;
  valorReais: number | null;
  quantidadeMilhas: number;
  descricao: string;
  tipo: 'ENTRADA' | 'SAÍDA';
};

type Props = {
  transacoes: TransacaoMilhas[];
};

export function ExtratoMilhasTabela({ transacoes }: Props) {
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const formatarMoeda = useCallback((valor: number | null) => {
    if (!valor) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }, []);

  return (
    <Paper>
      <Scrollbar>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Data e Hora da Transação</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Código da Reserva</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Valor</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Quantidade de Milhas</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Tipo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transacoes
                .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((transacao) => (
                  <TableRow key={transacao.id}>
                    <TableCell>{new Date(transacao.dataHora).toLocaleString('pt-BR')}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {transacao.codigoReserva || (
                        <Typography variant="body2" color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatarMoeda(transacao.valorReais)}</TableCell>
                    <TableCell>
                      <Label color={transacao.tipo === 'ENTRADA' ? 'success' : 'error'}>
                        {transacao.quantidadeMilhas}
                      </Label>
                    </TableCell>
                    <TableCell>{transacao.descricao}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Iconify
                          icon={transacao.tipo === 'ENTRADA' ? 'eva:arrow-upward-fill' : 'eva:arrow-downward-fill'}
                          color={transacao.tipo === 'ENTRADA' ? '#2e7d32' : '#d32f2f'}
                        />
                        <Typography
                          variant="body2"
                          color={transacao.tipo === 'ENTRADA' ? 'success.main' : 'error.main'}
                        >
                          {transacao.tipo}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              {transacoes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                    <Typography>Nenhuma transação encontrada</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        page={page}
        component="div"
        count={transacoes.length}
        rowsPerPage={rowsPerPage}
        onPageChange={(_event, newPage) => setPage(newPage)}
        rowsPerPageOptions={[]}
        labelRowsPerPage=""
      />
    </Paper>
  );
}