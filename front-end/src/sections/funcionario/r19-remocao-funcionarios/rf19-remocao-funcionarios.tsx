import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';
import { Funcionario } from '../types/funcionario';

type Props = {
    aberto: boolean;
    funcionario: Funcionario | null;
    onFechar: () => void;
    onInativar: (funcionarioAtualizado: Funcionario) => void;
};

export function RemoverFuncionariosView({
    aberto,
    funcionario,
    onFechar,
    onInativar,
}: Props) {
    const handleConfirmarInativacao = () => {
        if (!funcionario) return;

        const lista: Funcionario[] = JSON.parse(localStorage.getItem('funcionarios') || '[]');
        const index = lista.findIndex((f) => f.id === funcionario.id);

        if (index !== -1) {
            lista[index].ativo = false;
            localStorage.setItem('funcionarios', JSON.stringify(lista));
            onInativar(lista[index]);
        }

        onFechar();
    };

    return (
        <Dialog open={aberto} onClose={onFechar}>
            <DialogTitle>Confirmar Remoção</DialogTitle>
            <DialogContent>
                <Typography>
                    Deseja realmente <strong>inativar</strong> o(a) funcionário(a){' '}
                    <strong>{funcionario?.nome}</strong>?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onFechar}>Cancelar</Button>
                <Button color="error" variant="contained" onClick={handleConfirmarInativacao}>
                    Inativar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
