import {
    Box,
    Grid,
    Paper,
    Typography,
    Button,
    Divider,
    Snackbar,
    Alert,
  } from '@mui/material'
  import { useEffect, useState } from 'react'
  import { Helmet } from 'react-helmet-async'
  import { DashboardContent } from 'src/layouts/dashboard'
  
  export function FazerCheckIn() {
    const [voos, setVoos] = useState<any[]>([])
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState('')
  
    useEffect(() => {
      const todos = JSON.parse(localStorage.getItem('voos') || '[]')
      setVoos(todos)
    }, [])
  
    const agora = new Date()
    const daqui48h = new Date(agora.getTime() + 48 * 60 * 60 * 1000)
  
    const renderCard = (voo: any) => {
      const data = new Date(voo.dataHora)
      const dentroDe48h = data >= agora && data <= daqui48h
  
      return (
        <Grid item xs={12} md={6} key={voo.codigo}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              border: '1px solid #ccc',
              boxShadow: 2,
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              <strong>Voo {voo.codigo}</strong>
            </Typography>
  
            <Divider sx={{ mb: 2 }} />
  
            <Typography variant="body2" color="text.secondary">
              <strong>Origem:</strong> {voo.origem}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Destino:</strong> {voo.destino}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Data/Hora:</strong>{' '}
              {new Date(voo.dataHora).toLocaleString('pt-BR')}
            </Typography>
  
            <Divider sx={{ my: 2 }} />
  
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Preço:</strong> R$ {voo.preco}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Milhas:</strong> {voo.milhas}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Poltronas:</strong> {voo.poltronas}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Status:</strong> {voo.estado}
                </Typography>
              </Grid>
            </Grid>
  
            {dentroDe48h && (
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={() => fazerCheckIn(voo.codigo)}
                >
                  Fazer Check-in
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      )
    }
  
    const fazerCheckIn = (codigo: string) => {
      const atualizados = voos.map((v: any) =>
        v.codigo === codigo ? { ...v, estado: 'CHECK-IN' } : v
      )
      localStorage.setItem('voos', JSON.stringify(atualizados))
      setVoos(atualizados)
      setSnackbarMsg(`Check-in realizado com sucesso para o voo ${codigo}`)
      setSnackbarOpen(true)
    }
  
    const handleSnackbarClose = () => setSnackbarOpen(false)
  
    const voosConfirmados = voos.filter((v) => v.estado === 'CONFIRMADO')
  
    const voos48h = voosConfirmados.filter((v: any) => {
      const data = new Date(v.dataHora)
      return data >= agora && data <= daqui48h
    })
  
    const outrosVoos = voosConfirmados.filter(
      (v: any) => !voos48h.includes(v)
    )
  
    return (
      <>
        <Helmet>
          <title>Fazer Check-in</title>
        </Helmet>
  
        <DashboardContent>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" mb={3}>
              Fazer Check-in
            </Typography>
  
            <Typography variant="h6" mb={2}>
              Voos dentro de 48h
            </Typography>
  
            {voos48h.length === 0 ? (
              <Typography color="text.secondary" mb={4}>
                Nenhum voo disponível para check-in nas próximas 48h.
              </Typography>
            ) : (
              <Grid container spacing={3} mb={4}>
                {voos48h.map((voo) => renderCard(voo))}
              </Grid>
            )}
  
            <Typography variant="h6" mb={2}>
              Próximos voos
            </Typography>
  
            {outrosVoos.length === 0 ? (
              <Typography color="text.secondary">
                Nenhum outro voo confirmado encontrado.
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {outrosVoos.map((voo) => renderCard(voo))}
              </Grid>
            )}
          </Paper>
        </DashboardContent>
  
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{
              backgroundColor: '#d0f2d0',
              color: '#1e4620',
              width: '100%',
            }}
            elevation={6}
            variant="filled"
          >
            {snackbarMsg}
          </Alert>
        </Snackbar>
      </>
    )
  }
  