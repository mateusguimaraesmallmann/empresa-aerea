import { useState } from 'react';

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
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Box from '@mui/material/Box';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Label } from 'src/components/label';

type Reserva = {
  id: string;
  dataHora: string;
  origem: string;
  destino: string;
  codigo: string;
  status: string;
  statusVoo: string;
};

type Props = {
  reservas: Reserva[];
  milhas: number;
};

export function TabelaReservasCliente({ reservas, milhas }: Props) {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);

  const rowsPerPage = 5;

  const filteredData = reservas
    .filter((r) => r.codigo.toLowerCase().includes(filter.toLowerCase()))
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
    setSelectedReserva(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Card>
      <Toolbar
        sx={{
          height: 96,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: (theme) => theme.spacing(0, 1, 0, 3),
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <OutlinedInput
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Consultar reserva..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ maxWidth: 320 }}
          />

          <OutlinedInput
            value={`Saldo atual em Milhas: ${milhas}`}
            readOnly
            sx={{
              minWidth: 300,          
              maxWidth: 500,          
              flexShrink: 0,           
              fontWeight: 'bold',
              '& .MuiInputBase-input': {
                color: 'text.primary',
                whiteSpace: 'nowrap', // evita quebra de linha
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
              '& .Mui-disabled': {
                WebkitTextFillColor: 'unset',
              },
            }}
            inputProps={{
              style: { fontSize: '1rem' },
            }}
          />
        </Box>
      </Toolbar>

      <Scrollbar>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data e Hora</TableCell>
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
                .map((reserva) => (
                  <TableRow key={reserva.id}>
                    <TableCell>{reserva.dataHora}</TableCell>
                    <TableCell>{reserva.origem}</TableCell>
                    <TableCell>{reserva.destino}</TableCell>
                    <TableCell align="center">{reserva.codigo}</TableCell>
                    <TableCell>
                      <Label color={reserva.status === 'Cancelada' ? 'error' : 'success'}>
                        {reserva.status}
                      </Label>
                    </TableCell>
                    <TableCell>
                      <Label
                        color={
                          reserva.statusVoo === 'Realizado'
                            ? 'info'
                            : reserva.statusVoo === 'Cancelado'
                              ? 'error'
                              : 'warning'
                        }
                      >
                        {reserva.statusVoo}
                      </Label>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(e) => handleOpenPopover(e, reserva)}>
                        <Iconify icon="eva:more-vertical-fill" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

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
          <MenuItem onClick={handleClosePopover}>
            <Iconify icon="ic:round-remove-red-eye" width={18} />
            Ver Reserva
          </MenuItem>
          <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" width={18} />
            Cancelar
          </MenuItem>
        </MenuList>
      </Popover>
    </Card>
  );
}

