import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
} from '@mui/material';

import { Reserva } from 'src/api/reserva';

type VerReservaDialogProps = {
    open: boolean;
    onClose: () => void;
    reserva: Reserva | null;
};

export function VerReservaDialog({ open, onClose, reserva }: VerReservaDialogProps) {
    if (!reserva) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Informações da Reserva</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography><strong>Data/Hora:</strong></Typography>
                            <Typography color="text.secondary">
                                {new Date(reserva.dataHora).toLocaleString('pt-BR')}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><strong>Código da Reserva:</strong></Typography>
                            <Typography color="text.secondary">{reserva.codigo}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><strong>Código do Voo:</strong></Typography>
                            <Typography color="text.secondary">{reserva.codigoVoo}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><strong>Qtd. Passagens:</strong></Typography>
                            <Typography color="text.secondary">{reserva.quantidadePassagens}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><strong>Milhas Utilizadas:</strong></Typography>
                            <Typography color="text.secondary">{reserva.milhasUtilizadas}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><strong>Valor Pago:</strong></Typography>
                            <Typography color="text.secondary">
                                {new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                }).format(reserva.valorPagoEmDinheiro)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography><strong>Estado da Reserva:</strong></Typography>
                            <Typography color="text.secondary">{reserva.estado}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="caption" color="text.disabled">
                                Cliente: {reserva.clienteCpf}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fechar</Button>
            </DialogActions>
        </Dialog>
    );
}
