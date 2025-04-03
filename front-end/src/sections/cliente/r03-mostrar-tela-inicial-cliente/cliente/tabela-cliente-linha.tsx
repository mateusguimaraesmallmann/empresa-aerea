import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';
import { VerReservaDialog } from '../../r04-ver-reserva/ver-reserva';

// ----------------------------------------------------------------------

export type UserProps = {
  id: string;
  name: string;
  role: string;
  status: string;
  company: string;
  avatarUrl: string;
  isVerified: boolean;
};

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
};

type Reserva = {
  dataHora: string;
  codigo: string;
  origem: string;
  destino: string;
  valorReais: number;
  milhasGastas: number;
  estado: string;
};

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
    try {
      setDialogOpen(true);
      handleMenuClose();
    } catch (error) {
      console.error('Erro ao abrir o diálogo:', error);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        {/* Outras células da tabela */}
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
        disableEnforceFocus
      >
        <MenuList>
          <MenuItem onClick={handleDialogOpen}>
            <Iconify icon="ic:round-remove-red-eye" width={18} />
            Ver Reserva
          </MenuItem>
          {/* Outros itens do menu */}
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
