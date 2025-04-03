import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'

import { Reserva } from 'src/sections/cliente/types/reserva';

export default function ConsultarReserva() {
  const [codigo, setCodigo] = useState('')
  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null)

  const buscarReserva = () => {
    const reservas: Reserva[] = JSON.parse(localStorage.getItem('reservas') || '[]')
    const encontrada = reservas.find((r) => r.codigo === codigo)
    setReservaSelecionada(encontrada || null)
  }

  const fecharModal = () => {
    setReservaSelecionada(null)
  }

  const vooDentroDe48h = (dataHora: string) => {
    const agora = new Date()
    const voo = new Date(dataHora)
    const diffHoras = (voo.getTime() - agora.getTime()) / 1000 / 60 / 60
    return diffHoras <= 48 && diffHoras > 0
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Digite o código da reserva"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={buscarReserva}>
          Consultar
        </Button>
      </div>

      {reservaSelecionada && (
        <Dialog open onClose={fecharModal} maxWidth="sm" fullWidth>
          <DialogTitle>Dados da Reserva</DialogTitle>
          <DialogContent dividers>
            <Typography><strong>Código:</strong> {reservaSelecionada.codigo}</Typography>
            <Typography><strong>Data/Hora:</strong> {reservaSelecionada.dataHora}</Typography>
            <Typography><strong>Origem:</strong> {reservaSelecionada.origem}</Typography>
            <Typography><strong>Destino:</strong> {reservaSelecionada.destino}</Typography>
            <Typography><strong>Valor Gasto:</strong> R$ {reservaSelecionada.valorReais}</Typography>
            <Typography><strong>Milhas Gastas:</strong> {reservaSelecionada.milhasGastas}</Typography>
            <Typography><strong>Status:</strong> {reservaSelecionada.estado}</Typography>
          </DialogContent>
          <DialogActions>
            {vooDentroDe48h(reservaSelecionada.dataHora) && (
              <Button variant="contained" color="primary">
                Fazer Check-in
              </Button>
            )}
            <Button variant="contained" color="error">
              Cancelar Reserva
            </Button>
            <Button onClick={fecharModal}>Fechar</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}
