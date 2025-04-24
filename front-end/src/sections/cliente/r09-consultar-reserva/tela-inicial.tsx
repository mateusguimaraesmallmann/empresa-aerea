import {
    Box,
    Button,
    Grid,
    Paper,
    TextField,
    Typography,
  } from '@mui/material'
  import SearchIcon from '@mui/icons-material/Search'
  import { useState } from 'react'
  import { CancelarReservaDialog } from 'src/sections/cliente/r08-cancelar-reserva/cancelar-reserva'
  
  export default function TelaInicialCliente() {
    const [codigo, setCodigo] = useState('')
    const [reserva, setReserva] = useState<any | null>(null)
    const [cancelarAberto, setCancelarAberto] = useState(false)
  
    const buscarReserva = () => {
      const mock = {
        codigo,
        dataHora: '2025-04-25T15:30:00',
        origem: 'São Paulo',
        destino: 'Rio de Janeiro',
        valorReais: 350,
        milhasGastas: 5000,
        estado: 'CONFIRMADO',
      }
      setReserva(mock)
    }
  
    const dentroDe48h = (data: string) => {
      const dif = (new Date(data).getTime() - new Date().getTime()) / (1000 * 60 * 60)
      return dif > 0 && dif <= 48
    }
  
    return (
      <Box p={4}>
        <Box display="flex" gap={2} mb={4}>
          <TextField
            label="Código da Reserva"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={buscarReserva}
          >
            Buscar
          </Button>
        </Box>
  
        {reserva && (
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" mb={3}>Detalhes da Reserva</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}><strong>Data/Hora:</strong> {new Date(reserva.dataHora).toLocaleString('pt-BR')}</Grid>
              <Grid item xs={6}><strong>Código:</strong> {reserva.codigo}</Grid>
              <Grid item xs={6}><strong>Origem:</strong> {reserva.origem}</Grid>
              <Grid item xs={6}><strong>Destino:</strong> {reserva.destino}</Grid>
              <Grid item xs={6}><strong>Valor Gasto:</strong> R$ {reserva.valorReais}</Grid>
              <Grid item xs={6}><strong>Milhas Gastas:</strong> {reserva.milhasGastas}</Grid>
              <Grid item xs={12}><strong>Status:</strong> {reserva.estado}</Grid>
            </Grid>
  
            <Box display="flex" gap={2} mt={4}>
              {dentroDe48h(reserva.dataHora) && (
                <Button variant="contained" color="primary">
                  Fazer Check-in
                </Button>
              )}
              <Button variant="outlined" color="error" onClick={() => setCancelarAberto(true)}>
                Cancelar Reserva
              </Button>
            </Box>
          </Paper>
        )}
  
        {reserva && (
          <CancelarReservaDialog
            open={cancelarAberto}
            onClose={() => setCancelarAberto(false)}
            reserva={reserva}
            onReservaCancelada={() => {
              setCancelarAberto(false)
              setReserva(null)
            }}
          />
        )}
      </Box>
    )
  }
  