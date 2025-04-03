import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';

type Reserva = {
    dataHora: string;
    codigo: string;
    origem: string;
    destino: string;
    valorReais: number;
    milhasGastas: number;
    estado: string;
};

type VerReservaDialogProps = {
    open: boolean;
    onClose: () => void;
    reserva: Reserva | null;
};

export function VerReservaDialog({ open, onClose, reserva }: VerReservaDialogProps) {
    if (!reserva) return null;

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Informações da Reserva</DialogTitle>
            <DialogContent>
                <DialogContentText
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1, 
                        lineHeight: 1.8, 
                        width: '100%',
                        maxWidth: 500,
                    }}
                >
                    <Typography><strong>Data/Hora:</strong> {new Date(reserva.dataHora).toLocaleString('pt-BR')}</Typography>
                    <Typography><strong>Código:</strong> {reserva.codigo}</Typography>
                    <Typography><strong>Origem:</strong> {reserva.origem}</Typography>
                    <Typography><strong>Destino:</strong> {reserva.destino}</Typography>
                    <Typography><strong>Valor Gasto (R$):</strong> {reserva.valorReais.toFixed(2)}</Typography>
                    <Typography><strong>Milhas Gastas:</strong> {reserva.milhasGastas}</Typography>
                    <Typography><strong>Estado da Reserva:</strong> {reserva.estado}</Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fechar</Button>
            </DialogActions>
        </Dialog>
    );
}