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

import { Reserva } from 'src/sections/cliente/types/reserva';

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
                            <Typography><strong>Código:</strong></Typography>
                            <Typography color="text.secondary">{reserva.codigo}</Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography><strong>Origem:</strong></Typography>
                            <Typography color="text.secondary">{reserva.origem}</Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography><strong>Destino:</strong></Typography>
                            <Typography color="text.secondary">{reserva.destino}</Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography><strong>Valor Gasto:</strong></Typography>
                            <Typography color="text.secondary">
                                {new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                }).format(reserva.valorReais)}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography><strong>Milhas Gastas:</strong></Typography>
                            <Typography color="text.secondary">{reserva.milhasGastas}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography><strong>Estado da Reserva:</strong></Typography>
                            <Typography color="text.secondary">{reserva.estado}</Typography>
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
