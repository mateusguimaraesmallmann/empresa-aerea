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
import { useRouter } from 'src/routes/hooks';
import { Voo, voosMockados } from 'src/_mock/voos-mock';
import Button from '@mui/material/Button/Button';
import { ConfirmarEmbarqueDialog } from 'src/sections/funcionario/rf12-confirmacao-embarque/confirmar-embarque-dialog';

type Props = {
    voos: Voo[];
};

export function TabelaVoosFuncionario({ voos }: Props) {
    const [page, setPage] = useState(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [vooSelecionado, setVooSelecionado] = useState<Voo | null>(null);
    const rowsPerPage = 5;
    const [modalAberto, setModalAberto] = useState(false);
  
    const handleOpenPopover = (event: React.MouseEvent<HTMLElement>, voo: Voo) => {
        setAnchorEl(event.currentTarget);
        setVooSelecionado(voo);
    };
    
    const handleClosePopover = () => {
        setAnchorEl(null);
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
            px: 3,
          }}
        >
        
        <Typography variant="h6">Voos nas próximas 48 horas</Typography>
        </Toolbar>
  
        <Scrollbar>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data e Hora</TableCell>
                  <TableCell>Origem</TableCell>
                  <TableCell>Destino</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                    {voos
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((voo) => (
                        <TableRow key={voo.id}>
                            <TableCell>{new Date(voo.dataHora).toLocaleString('pt-BR')}</TableCell>
                            <TableCell>{voo.origem}</TableCell>
                            <TableCell>{voo.destino}</TableCell>
                            <TableCell align="right">
                            <IconButton onClick={(e) => handleOpenPopover(e, voo)}>
                                <Iconify icon="eva:more-vertical-fill" />
                            </IconButton>
                            </TableCell>
                        </TableRow>
                        ))}

                        {vooSelecionado && (
                        <ConfirmarEmbarqueDialog
                        open={modalAberto}
                        onClose={() => setModalAberto(false)}
                        vooId={vooSelecionado.id}
                        />
                        )}

                    {voos.length === 0 && (
                        <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                            <Typography>Nenhum voo disponível</Typography>
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
            count={voos.length}
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
            <MenuList sx={{ p: 1, width: 200 }}>
            <MenuItem
                    onClick={() => {
                    setModalAberto(true);
                    handleClosePopover(); 
                    }}>
                    <Iconify icon="mdi:check-bold" width={18} />
                     Confirmar Embarque
                </MenuItem>
                <MenuItem>
                    <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                    Cancelar Voo
                </MenuItem>
                <MenuItem>
                    <Iconify icon="mdi:airplane" width={18} />
                    Marcar como Realizado
                </MenuItem>
            </MenuList>
        </Popover>
      </Card>
      
    );
  }