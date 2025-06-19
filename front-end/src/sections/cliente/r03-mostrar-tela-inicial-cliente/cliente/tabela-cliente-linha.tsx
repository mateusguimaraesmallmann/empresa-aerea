import { useState } from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';
import { Reserva } from 'src/api/reserva';
import { VerReservaDialog } from '../../r04-ver-reserva/ver-reserva';

type TabelaClienteLinhaProps = {
  reserva: Reserva;
};

export function TabelaClienteLinha({ reserva }: TabelaClienteLinhaProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <TableRow hover>
        <TableCell align="right">
          <IconButton onClick={handleMenuOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList>
          <MenuItem onClick={handleDialogOpen}>
            <Iconify icon="ic:round-remove-red-eye" width={18} />
            Ver Reserva
          </MenuItem>
        </MenuList>
      </Popover>

      <VerReservaDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        reserva={reserva}
      />
    </>
  );
}

