import { useState, useMemo } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Popover from '@mui/material/Popover';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Box from '@mui/material/Box';
import { TextField, Button, Grid } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Label } from 'src/components/label';
import { useRouter } from 'src/routes/hooks';
import { Reserva } from 'src/api/reserva';
import { VerReservaDialog } from '../../r04-ver-reserva/ver-reserva';
import { CancelarReservaDialog } from '../../r08-cancelar-reserva/cancelar-reserva';

type Props = {
  reservas: Reserva[];
  milhas: number;
  onAtualizarReservas: () => void;
};

function getLabelInfo(estado: string): { color: 'success' | 'error' | 'info' | 'warning'; texto: string } {
  switch (estado) {
    case 'CRIADA':
      return { color: 'success', texto: 'Criada' };
    case 'CHECK_IN':
      return { color: 'info', texto: 'Check-in' };
    case 'CANCELADA':
      return { color: 'error', texto: 'Cancelada' };
    case 'CANCELADA_VOO':
      return { color: 'error', texto: 'Cancelada pelo Voo' };
    case 'EMBARCADA':
      return { color: 'info', texto: 'Embarcada' };
    case 'REALIZADA':
      return { color: 'success', texto: 'Realizada' };
    case 'NAO_REALIZADA':
      return { color: 'error', texto: 'Não Realizada' };
    default:
      return { color: 'info', texto: estado };
  }
}

function podeFazerCheckIn(reserva: Reserva): boolean {
  const agora = new Date();
  const em48h = new Date(agora.getTime() + 48 * 60 * 60 * 1000);
  const dataVoo = new Date(reserva.dataHora);

  return (
    (reserva.estado === 'CRIADA' || reserva.estado === 'CHECK_IN') &&
    dataVoo >= agora &&
    dataVoo <= em48h
  );
}

export function TabelaReservasCliente({ reservas, milhas, onAtualizarReservas }: Props) {
  const [page, setPage] = useState(0);
  const [orderBy] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState('');
  const [codigoBusca, setCodigoBusca] = useState('');
  const [buscaAtiva, setBuscaAtiva] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogCancelarOpen, setDialogCancelarOpen] = useState(false);

  const rowsPerPage = 5;
  const router = useRouter();

  const filteredData = useMemo(() => {
    const data = reservas
      .filter((r) => !buscaAtiva || r.codigo.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) =>
        orderBy === 'asc'
          ? new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
          : new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
      );
    return data;
  }, [reservas, filter, buscaAtiva, orderBy]);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>, reserva: Reserva) => {
    setAnchorEl(event.currentTarget);
    setSelectedReserva(reserva);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = () => {
    handleClosePopover();
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleOpenDialogCancelar = () => {
    handleClosePopover();
    setDialogCancelarOpen(true);
  };

  const handleCloseDialogCancelar = () => {
    setDialogCancelarOpen(false);
  };

  const handleReservaCancelada = () => {
    onAtualizarReservas();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleBuscarReserva = () => {
    setFilter(codigoBusca.trim());
    setBuscaAtiva(true);
    setPage(0);
  };

  const handleLimparBusca = () => {
    setFilter('');
    setCodigoBusca('');
    setBuscaAtiva(false);
    setPage(0);
  };

  return (
    <Card>
      <Toolbar sx={{ height: 'auto', p: (theme) => theme.spacing(2, 3) }}>
        <Box width="100%">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box display="flex" gap={2} alignItems="center">
                <TextField
                  label="Consultar reserva"
                  value={codigoBusca}
                  onChange={(e) => setCodigoBusca(e.target.value)}
                  size="small"
                  fullWidth
                />
                <Button variant="contained" onClick={handleBuscarReserva} sx={{ height: 36, minWidth: 110 }}>
                  Buscar
                </Button>
                <Button variant="text" onClick={handleLimparBusca} sx={{ height: 36, minWidth: 110 }}>
                  Limpar
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} display="flex" justifyContent="flex-end" alignItems="center">
              <Typography fontSize="1rem">Saldo atual em Milhas: {milhas}</Typography>
            </Grid>
          </Grid>
        </Box>
      </Toolbar>

      <Scrollbar>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data e Hora</TableCell>
                <TableCell align="center">Código da Reserva</TableCell>
                <TableCell align="center">Código do Voo</TableCell>
                <TableCell align="center">Qtd. Passagens</TableCell>
                <TableCell align="center">Milhas Utilizadas</TableCell>
                <TableCell align="center">Valor Pago</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((reserva) => {
                  const labelReserva = getLabelInfo(reserva.estado);
                  return (
                    <TableRow key={`${reserva.codigo}-${reserva.dataHora}`}>
                      <TableCell>{new Date(reserva.dataHora).toLocaleString('pt-BR')}</TableCell>
                      <TableCell align="center">{reserva.codigo}</TableCell>
                      <TableCell align="center">{reserva.codigoVoo}</TableCell>
                      <TableCell align="center">{reserva.quantidadePassagens}</TableCell>
                      <TableCell align="center">{reserva.milhasUtilizadas}</TableCell>
                      <TableCell align="center">
                        {reserva.valorPagoEmDinheiro?.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </TableCell>
                      <TableCell>
                        <Label color={labelReserva.color}>{labelReserva.texto}</Label>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={(e) => handleOpenPopover(e, reserva)}>
                          <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}

              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                    <Typography>Nenhuma reserva encontrada</Typography>
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
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[]}
        labelRowsPerPage=""
      />

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList sx={{ p: 1, width: 160 }}>
          <MenuItem onClick={handleOpenDialog}>
            <Iconify icon="ic:round-remove-red-eye" width={18} />
            Ver Reserva
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedReserva) {
                router.push('/check-in');
                handleClosePopover();
              }
            }}
            disabled={!selectedReserva || !podeFazerCheckIn(selectedReserva)}
          >
            <Iconify icon="material-symbols:flight-takeoff-rounded" width={18} />
            Fazer Check-in
          </MenuItem>
          <MenuItem onClick={handleOpenDialogCancelar}>
            <Iconify icon="solar:trash-bin-trash-bold" width={18} />
            Cancelar
          </MenuItem>
        </MenuList>
      </Popover>

      <VerReservaDialog open={dialogOpen} onClose={handleCloseDialog} reserva={selectedReserva} />

      <CancelarReservaDialog
        open={dialogCancelarOpen}
        onClose={handleCloseDialogCancelar}
        reserva={selectedReserva}
        onReservaCancelada={handleReservaCancelada}
      />
    </Card>
  );
}




