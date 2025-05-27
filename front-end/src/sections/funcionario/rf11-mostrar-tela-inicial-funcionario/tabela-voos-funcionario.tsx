import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Popover,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  MenuList,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Voo, atualizarEstadoVoo } from 'src/api/voo';
import api from 'src/api/api';
import { ConfirmarEmbarqueDialog } from 'src/sections/funcionario/rf12-confirmacao-embarque/confirmar-embarque-dialog';
import { CancelarVooDialog } from '../rf13-cancelar-voo/dialogo-cancelamento';
import { ConfirmarRealizacaoDialog } from '../rf14-realizar-voo/dialogs/ConfirmarRealizaçãoDialog';

interface Props {
  voos: Voo[];
}

export function TabelaVoosFuncionario({ voos }: Props) {
  const [page, setPage] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [vooSelecionado, setVooSelecionado] = useState<Voo | null>(null);
  const [modalEmbarqueAberto, setModalEmbarqueAberto] = useState(false);
  const [modalCancelamentoAberto, setModalCancelamentoAberto] = useState(false);
  const [modalRealizacaoAberto, setModalRealizacaoAberto] = useState(false);
  const [listaVoos, setListaVoos] = useState<Voo[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensagem, setSnackbarMensagem] = useState('');
  const [snackbarTipo, setSnackbarTipo] = useState<'success' | 'error'>('success');

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

  const atualizarListaVoos = async () => {
    try {
      const response = await api.get<Voo[]>('/voos');
      setListaVoos(response.data);
    } catch (error) {
      mostrarSnackbar('Erro ao atualizar lista de voos.', 'error');
    }
  };

  const mostrarSnackbar = (mensagem: string, tipo: 'success' | 'error') => {
    setSnackbarMensagem(mensagem);
    setSnackbarTipo(tipo);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const getCorEstado = (estado: string) => {
    switch (estado) {
      case 'CRIADA':
        return { bg: '#d0f2d0', color: '#1e4620' };
      case 'RESERVADA':
        return { bg: '#fff3cd', color: '#7a4f01' };
      case 'EMBARCADA':
        return { bg: '#cfe2ff', color: '#084298' };
      case 'REALIZADA':
        return { bg: '#d4edda', color: '#155724' };
      case 'CANCELADO VOO':
        return { bg: '#f8d7da', color: '#664d03' };
      case 'CANCELADO':
        return { bg: '#f8d7da', color: '#842029' };
      case 'CONFIRMADO':
        return { bg: '#cff4fc', color: '#055160' };
      default:
        return { bg: '#eee', color: '#000' };
    }
  };

  const cancelarVoo = async (codigoVoo: string) => {
    try {
      await atualizarEstadoVoo(codigoVoo, 'CANCELADO');
      mostrarSnackbar('Voo cancelado com sucesso.', 'success');
      atualizarListaVoos();
    } catch (error) {
      mostrarSnackbar('Erro ao cancelar voo.', 'error');
    }
  };

  const realizarVoo = async (codigoVoo: string) => {
    try {
      await atualizarEstadoVoo(codigoVoo, 'REALIZADO');
      mostrarSnackbar('Voo realizado com sucesso.', 'success');
      atualizarListaVoos();
    } catch (error) {
      mostrarSnackbar('Erro ao realizar voo.', 'error');
    }
  };

  return (
    <>
      <Card>
        <Toolbar sx={{ height: 96, display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3 }}>
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
                  .map((voo) => {
                    const { bg, color } = getCorEstado(voo.estado);
                    return (
                      <TableRow key={voo.id}>
                        <TableCell>{voo.codigo}</TableCell>
                        <TableCell>{new Date(voo.dataHora).toLocaleString('pt-BR')}</TableCell>
                        <TableCell>{voo.origem.nome}</TableCell>
                        <TableCell>{voo.destino.nome}</TableCell>
                        <TableCell>
                          <Chip
                            label={voo.estado}
                            size="small"
                            sx={{ fontWeight: 'bold', borderRadius: 1, backgroundColor: bg, color }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={(e) => handleOpenPopover(e, voo)}>
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
                cancelarVoo(vooSelecionado.codigo);
                setModalCancelamentoAberto(false);
              }}
              voo={vooSelecionado}
            />

            <ConfirmarRealizacaoDialog
              open={modalRealizacaoAberto}
              onClose={() => setModalRealizacaoAberto(false)}
              onConfirm={() => {
                realizarVoo(vooSelecionado.codigo);
                setModalRealizacaoAberto(false);
              }}
              voo={vooSelecionado}
            />
          </>
        )}
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarTipo} sx={{ width: '100%' }}>
          {snackbarMensagem}
        </Alert>
      </Snackbar>
    </>
  );
}