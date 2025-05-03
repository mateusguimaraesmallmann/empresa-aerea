import { useState, useEffect } from 'react';
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
import { Chip } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Voo } from 'src/_mock/voos-mock';
import { ConfirmarEmbarqueDialog } from 'src/sections/funcionario/rf12-confirmacao-embarque/confirmar-embarque-dialog';
import { CancelarVooDialog } from '../rf13-cancelar-voo/dialogo-cancelamento';
import { ConfirmarRealizacaoDialog } from '../rf14-realizar-voo/dialogs/ConfirmarRealizaçãoDialog';

type Props = {
  voos: Voo[];
};

export function TabelaVoosFuncionario({ voos }: Props) {
  const [page, setPage] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [vooSelecionado, setVooSelecionado] = useState<Voo | null>(null);
  const [modalEmbarqueAberto, setModalEmbarqueAberto] = useState(false);
  const [modalCancelamentoAberto, setModalCancelamentoAberto] = useState(false);
  const [modalRealizacaoAberto, setModalRealizacaoAberto] = useState(false);
  const [listaVoos, setListaVoos] = useState<Voo[]>([]);

  const rowsPerPage = 5;

  useEffect(() => {
    setListaVoos(voos);
  }, [voos]);

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

  const atualizarListaVoos = () => {
    const voosSalvos = JSON.parse(localStorage.getItem('voos') || '[]');
    setListaVoos(voosSalvos);
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
                <TableCell>Código do Voo</TableCell>
                <TableCell>Data e Hora</TableCell>
                <TableCell>Origem</TableCell>
                <TableCell>Destino</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...listaVoos]
                .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((voo) => (
                  <TableRow key={voo.id}>
                    <TableCell>{voo.codigo}</TableCell>
                    <TableCell>{new Date(voo.dataHora).toLocaleString('pt-BR')}</TableCell>
                    <TableCell>{voo.origem}</TableCell>
                    <TableCell>{voo.destino}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          voo.estado === 'CRIADA'
                            ? 'CRIADA'
                            : voo.estado === 'RESERVADA'
                            ? 'Reservada'
                            : voo.estado === 'EMBARCADA'
                            ? 'Embarcada'
                            : voo.estado === 'REALIZADA'
                            ? 'Realizada'
                            : voo.estado === 'CANCELADO VOO'
                            ? 'Cancelado Voo'
                            : voo.estado === 'CONFIRMADO'
                            ? 'Confirmado'
                            : voo.estado === 'CANCELADO'
                            ? 'Cancelado'
                            : voo.estado
                        }
                        size="small"
                        sx={{
                          fontWeight: 'bold',
                          borderRadius: 1,
                          backgroundColor:
                            voo.estado === 'CRIADA'
                              ? '#d0f2d0'
                              : voo.estado === 'RESERVADA'
                              ? '#fff3cd'
                              : voo.estado === 'EMBARCADA'
                              ? '#cfe2ff'
                              : voo.estado === 'REALIZADA'
                              ? '#d4edda'
                              : voo.estado === 'CANCELADO VOO' || voo.estado === 'CANCELADO'
                              ? '#f8d7da'
                              : voo.estado === 'CONFIRMADO'
                              ? '#cff4fc'
                              : '#eee',
                          color:
                            voo.estado === 'CRIADA'
                              ? '#1e4620'
                              : voo.estado === 'RESERVADA'
                              ? '#7a4f01'
                              : voo.estado === 'EMBARCADA'
                              ? '#084298'
                              : voo.estado === 'REALIZADA'
                              ? '#155724'
                              : voo.estado === 'CANCELADO VOO'
                              ? '#664d03'
                              : voo.estado === 'CANCELADO'
                              ? '#842029'
                              : voo.estado === 'CONFIRMADO'
                              ? '#055160'
                              : '#000',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(e) => handleOpenPopover(e, voo)}>
                        <Iconify icon="eva:more-vertical-fill" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

              {listaVoos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
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
        count={listaVoos.length}
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
              setModalEmbarqueAberto(true);
              handleClosePopover();
            }}
          >
            <Iconify icon="mdi:check-bold" width={18} /> Confirmar Embarque
          </MenuItem>
          <MenuItem
            onClick={() => {
              setModalCancelamentoAberto(true);
              handleClosePopover();
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" width={18} /> Cancelar Voo
          </MenuItem>
          <MenuItem
            onClick={() => {
              setModalRealizacaoAberto(true);
              handleClosePopover();
            }}
          >
            <Iconify icon="mdi:airplane" width={18} /> Marcar como Realizado
          </MenuItem>
        </MenuList>
      </Popover>

      {vooSelecionado && (
        <>
          <ConfirmarEmbarqueDialog
            open={modalEmbarqueAberto}
            onClose={() => setModalEmbarqueAberto(false)}
            vooId={vooSelecionado.id}
          />

          <CancelarVooDialog
            open={modalCancelamentoAberto}
            onClose={() => setModalCancelamentoAberto(false)}
            onConfirm={() => {
              const voosSalvos = JSON.parse(localStorage.getItem('voos') || '[]');
              const atualizados = voosSalvos.map((v: Voo) =>
                v.id === vooSelecionado.id ? { ...v, estado: 'CANCELADO' } : v
              );
              localStorage.setItem('voos', JSON.stringify(atualizados));
              setModalCancelamentoAberto(false);
              atualizarListaVoos();
            }}
            voo={vooSelecionado}
          />

          <ConfirmarRealizacaoDialog
            open={modalRealizacaoAberto}
            onClose={() => setModalRealizacaoAberto(false)}
            onConfirm={() => {
              const voosSalvos = JSON.parse(localStorage.getItem('voos') || '[]');
              const atualizados = voosSalvos.map((v: Voo) =>
                v.id === vooSelecionado.id ? { ...v, estado: 'REALIZADA' } : v
              );
              localStorage.setItem('voos', JSON.stringify(atualizados));
              setModalRealizacaoAberto(false);
              atualizarListaVoos();
            }}
            voo={vooSelecionado}
          />
        </>
      )}
    </Card>
  );
}