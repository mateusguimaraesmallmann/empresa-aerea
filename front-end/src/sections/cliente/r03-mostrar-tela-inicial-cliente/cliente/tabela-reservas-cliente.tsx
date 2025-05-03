import { useEffect, useState } from 'react';

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
import { Reserva, getReservasDoLocalStorageAdaptadas } from 'src/sections/cliente/types/reserva';
import { VerReservaDialog } from '../../r04-ver-reserva/ver-reserva';
import { CancelarReservaDialog } from '../../r08-cancelar-reserva/cancelar-reserva';

type Props = {
  reservas: Reserva[];
  milhas: number;
  onAtualizarReservas: () => void;
};

type VooLocalStorage = {
  id: string;
  estado: string;
};

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
  const [reservasAtualizadas, setReservasAtualizadas] = useState<Reserva[]>([]);

  const rowsPerPage = 5;
  const router = useRouter();

  const getEstadoVoo = (vooId: string): string => {
    const voos = JSON.parse(localStorage.getItem('voos') || '[]') as VooLocalStorage[];
    const voo = voos.find((v) => v.id === vooId);
    return voo?.estado || 'DESCONHECIDO';
  };

  useEffect(() => {
    const atualizarReservas = () => {
      const adaptadas = getReservasDoLocalStorageAdaptadas().map((reserva) => ({
        ...reserva,
        estadoVoo: getEstadoVoo(reserva.id),
      }));
      setReservasAtualizadas(adaptadas);
    };

    atualizarReservas();
    window.addEventListener('storage', atualizarReservas);
    return () => window.removeEventListener('storage', atualizarReservas);
  }, [reservas]);

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

  const filteredData = reservasAtualizadas
    .filter((r) => !buscaAtiva || r.codigo.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) =>
      orderBy === 'asc'
        ? new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
        : new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
    );

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
    setReservasAtualizadas(getReservasDoLocalStorageAdaptadas());
    onAtualizarReservas();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  function getLabelInfo(estado: string): { color: 'success' | 'error' | 'info' | 'warning'; texto: string } {
    switch (estado) {
      case 'CRIADA':
        return { color: 'success', texto: 'CRIADA' };
      case 'CHECK-IN':
        return { color: 'info', texto: 'CHECK-IN' };
      case 'CANCELADA':
        return { color: 'error', texto: 'CANCELADA' };
      case 'CANCELADO':
        return { color: 'error', texto: 'CANCELADO' };
      case 'CANCELADA VOO':
        return { color: 'error', texto: 'CANCELADA PELO VOO' };
      case 'EMBARCADA':
        return { color: 'info', texto: 'EMBARCADA' };
      case 'EMBARCADO':
        return { color: 'info', texto: 'EMBARCADO' };
      case 'REALIZADA':
        return { color: 'success', texto: 'REALIZADA' };
      case 'NÃO REALIZADA':
        return { color: 'error', texto: 'NÃO REALIZADA' };
      case 'CONFIRMADO':
        return { color: 'info', texto: 'CONFIRMADO' };
      default:
        return { color: 'info', texto: estado };
    }
  }

  return (
    <Card>
      <Toolbar sx={{ height: 'auto', p: (theme) => theme.spacing(2, 3) }}>
        <Box width="100%">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box display="flex" gap={2} alignItems="center">
                <TextField
                  label="Código da Reserva"
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
                <TableCell>Data e Hora do Voo</TableCell>
                <TableCell>Aeroporto Origem</TableCell>
                <TableCell>Aeroporto Destino</TableCell>
                <TableCell align="center">Código da Reserva</TableCell>
                <TableCell>Status da Reserva</TableCell>
                <TableCell>Status do Voo</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((reserva) => {
                  const labelReserva = getLabelInfo(reserva.estado);
                  const labelVoo = getLabelInfo(getEstadoVoo(reserva.id));
                  return (
                    <TableRow key={`${reserva.codigo}-${reserva.dataHora}`}>
                      <TableCell>{new Date(reserva.dataHora).toLocaleString('pt-BR')}</TableCell>
                      <TableCell>{reserva.origem}</TableCell>
                      <TableCell>{reserva.destino}</TableCell>
                      <TableCell align="center">{reserva.codigo}</TableCell>
                      <TableCell>
                        <Label color={labelReserva.color}>{labelReserva.texto}</Label>
                      </TableCell>
                      <TableCell>
                        <Label color={labelVoo.color}>{labelVoo.texto}</Label>
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
                  <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
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
          <MenuItem onClick={handleOpenDialogCancelar} sx={{ color: 'error.main' }}>
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



