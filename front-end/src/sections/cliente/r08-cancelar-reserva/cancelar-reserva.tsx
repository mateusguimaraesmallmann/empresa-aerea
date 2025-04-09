import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box,
    Grid,
} from '@mui/material';

import { Reserva } from 'src/sections/cliente/types/reserva';

type CancelarReservaDialogProps = {
    open: boolean;
    onClose: () => void;
    reserva: Reserva | null;
    onReservaCancelada: () => void;
};

export function CancelarReservaDialog({
    open,
    onClose,
    reserva,
    onReservaCancelada,
}: CancelarReservaDialogProps) {
    if (!reserva) return null;

    const podeCancelar = ['CRIADA', 'CHECK-IN'].includes(reserva.estado);

    const cancelarReserva = () => {
        const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');

        const atualizadas = reservas.map((r: any) =>
            r.codigo === reserva.codigo
                ? {
                    ...r,
                    status: 'CANCELADA',
                    dataHoraCancelamento: new Date().toISOString(),
                }
                : r
        );

        localStorage.setItem('reservas', JSON.stringify(atualizadas));

        // Reembolsar milhas
        const milhasAtual = Number(localStorage.getItem('milhas')) || 0;
        localStorage.setItem('milhas', JSON.stringify(milhasAtual + reserva.milhasGastas));

        // Registrar transação de milhas
        const transacoes = JSON.parse(localStorage.getItem('transacoes') || '[]');
        transacoes.push({
            id: crypto.randomUUID(),
            dataHora: new Date().toISOString(),
            descricao: 'Milhas devolvidas por cancelamento',
            tipo: 'ENTRADA',
            quantidadeMilhas: reserva.milhasGastas,
            codigoReserva: reserva.codigo,
            valorReais: null,
        });
        localStorage.setItem('transacoes', JSON.stringify(transacoes));

        onReservaCancelada();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Cancelar Reserva</DialogTitle>
            <DialogContent>
                <Box mt={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography>
                                <strong>Código:</strong>
                            </Typography>
                            <Typography color="text.secondary">{reserva.codigo}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>
                                <strong>Status:</strong>
                            </Typography>
                            <Typography color="text.secondary">{reserva.estado}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>
                                <strong>Milhas Gastas:</strong>
                            </Typography>
                            <Typography color="text.secondary">{reserva.milhasGastas}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>
                                <strong>Valor Pago:</strong>
                            </Typography>
                            <Typography color="text.secondary">
                                {new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                }).format(reserva.valorReais)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                {!podeCancelar && (
                    <Typography mt={3}>
                        Esta reserva não pode ser cancelada pois já foi concluída ou está em outro estado.
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fechar</Button>
                <Button
                    onClick={cancelarReserva}
                    color="error"
                    variant="contained"
                    disabled={!podeCancelar}
                >
                    Cancelar Reserva
                </Button>
            </DialogActions>
        </Dialog>
    );
}

