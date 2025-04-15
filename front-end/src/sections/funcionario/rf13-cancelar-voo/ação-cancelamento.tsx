import { useState } from 'react';
import { IconButton } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { CancelarVooDialog } from './dialogo-cancelamento';

type Props = {
  voo: any;
  onCancelamentoSucesso: () => void;
};

export function VooCancelamentoActions({ voo, onCancelamentoSucesso }: Props) {
  const [openDialog, setOpenDialog] = useState(false);

  const handleCancelar = async () => {
    try {
      const response = await fetch(`/api/funcionario/voos/${voo.codigo}/cancelar`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        onCancelamentoSucesso();
        setOpenDialog(false);
      }
    } catch (err) {
      console.error('Erro ao cancelar voo:', err);
    }
  };

  return (
    <>
      <IconButton
        onClick={() => setOpenDialog(true)}
        disabled={voo.estado !== 'CONFIRMADO'}
        color="error"
      >
        <Iconify icon="solar:trash-bin-trash-bold" />
      </IconButton>

      <CancelarVooDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleCancelar}
        voo={voo}
      />
    </>
  );
}