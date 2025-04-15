import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { ConfirmarRealizacaoDialog } from './dialogs/ConfirmarRealizaçãoDialog';
import { useAuth } from 'src/context/AuthContext';

type Props = {
  voo: any;
  onRealizacaoSucesso: () => void;
};

export function RealizarVooActions({ voo, onRealizacaoSucesso }: Props) {
  const { auth } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);

  const handleRealizarVoo = async () => {
    try {
      const response = await fetch(`/api/funcionario/voos/${voo.codigo}/realizar`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.token}`
        }
      });
      
      if (response.ok) {
        onRealizacaoSucesso();
        setOpenDialog(false);
      }
    } catch (err) {
      console.error('Erro ao realizar voo:', err);
    }
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
    </>
  );
}