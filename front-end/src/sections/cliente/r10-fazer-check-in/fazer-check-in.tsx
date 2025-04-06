import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Snackbar,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Grid,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { DashboardContent } from 'src/layouts/dashboard';
import { ReservaStorage } from 'src/sections/cliente/types/reserva';

// Função para buscar reservas dentro das próximas 48 horas
function getReservasProximas48h(): ReservaStorage[] {
    const reservas = JSON.parse(localStorage.getItem('reservas') || '[]') as ReservaStorage[];
    const agora = new Date();
    const daqui48h = new Date(agora.getTime() + 48 * 60 * 60 * 1000);

    return reservas.filter((r) => {
        const dataVoo = new Date(r.voo.dataHora);
        return dataVoo >= agora && dataVoo <= daqui48h && r.status !== 'CHECK-IN' && r.status !== 'CANCELADA';
    });
}

export function FazerCheckIn() {
    const [reservas, setReservas] = useState<ReservaStorage[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');

    useEffect(() => {
        setReservas(getReservasProximas48h());
    }, []);

    const fazerCheckIn = (codigo: string) => {
        const atualizadas = reservas.map((reserva) =>
            reserva.codigo === codigo ? { ...reserva, status: 'CHECK-IN' } : reserva
        );
        setReservas(atualizadas);
        localStorage.setItem('reservas', JSON.stringify(atualizadas));
        setSnackbarMsg('Check-in realizado com sucesso!');
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <Helmet>
                <title>Fazer Check-in</title>
            </Helmet>

            <DashboardContent>
                <Box display="flex" alignItems="center" mb={5}>
                    <Typography variant="h4" flexGrow={1}>
                        Fazer Check-in
                    </Typography>
                </Box>

                {reservas.length === 0 ? (
                    <Typography>Nenhuma reserva disponível para check-in nas próximas 48h.</Typography>
                ) : (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Origem</strong></TableCell>
                                            <TableCell><strong>Destino</strong></TableCell>
                                            <TableCell><strong>Data/Hora</strong></TableCell>
                                            <TableCell><strong>Código da Reserva</strong></TableCell>
                                            <TableCell><strong>Ações</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {reservas.map((reserva) => (
                                            <TableRow key={reserva.codigo}>
                                                <TableCell>{reserva.voo.origem}</TableCell>
                                                <TableCell>{reserva.voo.destino}</TableCell>
                                                <TableCell>{new Date(reserva.voo.dataHora).toLocaleString()}</TableCell>
                                                <TableCell>{reserva.codigo}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => fazerCheckIn(reserva.codigo)}
                                                    >
                                                        Fazer Check-in
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                )}

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
            </DashboardContent>
        </>
    );
}


