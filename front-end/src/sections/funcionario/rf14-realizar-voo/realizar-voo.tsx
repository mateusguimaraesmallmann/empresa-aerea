import { useState } from 'react';
import { IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { atualizarEstadoVoo, Voo } from 'src/api/voo';
import { ConfirmarRealizacaoDialog } from './dialogs/ConfirmarRealizaçãoDialog';

type Props = {
  voo: Voo;
  onRealizacaoSucesso: () => void;
};

export function RealizarVooActions({ voo, onRealizacaoSucesso }: Props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMensagem, setSnackbarMensagem] = useState('');
  const [snackbarTipo, setSnackbarTipo] = useState<'success' | 'error'>('success');

  const handleRealizarVoo = async () => {
    try {
      await atualizarEstadoVoo(voo.codigo, 'REALIZADO');
      setSnackbarMensagem('Voo realizado com sucesso.');
      setSnackbarTipo('success');
      setSnackbarOpen(true);
      setOpenDialog(false);
      onRealizacaoSucesso();
    } catch (error) {
      setSnackbarMensagem('Erro ao realizar voo.');
      setSnackbarTipo('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Tooltip title="Registrar realização do voo">
        <IconButton
          onClick={() => setOpenDialog(true)}
          disabled={voo.estado !== 'CONFIRMADO'}
          color="success"
        >
          <Iconify icon="mdi:airplane-check" />
        </IconButton>
      </Tooltip>

      <ConfirmarRealizacaoDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleRealizarVoo}
        voo={voo}
      />

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