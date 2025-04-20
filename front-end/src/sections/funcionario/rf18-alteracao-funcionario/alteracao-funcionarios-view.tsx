import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
    Alert
} from '@mui/material';
import { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { Funcionario } from '../types/funcionario';

type Props = {
    aberto: boolean;
    funcionario: Funcionario | null;
    onFechar: () => void;
    onAtualizar: () => void;
};

export function AlteracaoFuncionariosView({ aberto, funcionario, onFechar, onAtualizar }: Props) {
    const [dados, setDados] = useState<Omit<Funcionario, 'id' | 'senha' | 'cpf' | 'ativo'>>({
        nome: '',
        email: '',
        telefone: '',
    });

    const [erros, setErros] = useState<{ [campo: string]: boolean }>({});
    const [mostrarSucesso, setMostrarSucesso] = useState(false);

    useEffect(() => {
        if (funcionario) {
            setDados({
                nome: funcionario.nome,
                email: funcionario.email,
                telefone: funcionario.telefone,
            });
            setMostrarSucesso(false);
        }
    }, [funcionario]);

    const validarCampos = () => {
        const telefoneLimpo = dados.telefone.replace(/\D/g, '');

        const novosErros = {
            nome: !dados.nome,
            email: !dados.email,
            telefone: telefoneLimpo.length < 10,
        };

        setErros(novosErros);
        return !Object.values(novosErros).includes(true);
    };

    const handleAtualizar = () => {
        if (!funcionario || !validarCampos()) return;

        const funcionarios = JSON.parse(localStorage.getItem('funcionarios') || '[]') as Funcionario[];
        const index = funcionarios.findIndex((f) => f.id === funcionario.id);

        if (index !== -1) {
            const atualizado: Funcionario = {
                ...funcionario,
                nome: dados.nome,
                email: dados.email,
                telefone: dados.telefone,
            };

            funcionarios[index] = atualizado;
            localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
            setMostrarSucesso(true);

            setTimeout(() => {
                onAtualizar();
            }, 2500);
        }
    };

    return (
        <Dialog open={aberto} onClose={onFechar} fullWidth maxWidth="sm">
            <DialogTitle>Alterar Funcionário(a)</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>

                    {mostrarSucesso && (
                        <Alert severity="success">
                            Funcionário(a) atualizado(a) com sucesso!
                        </Alert>
                    )}

                    <TextField
                        label="Nome"
                        fullWidth
                        required
                        value={dados.nome}
                        onChange={(e) => setDados({ ...dados, nome: e.target.value })}
                        error={erros.nome}
                        helperText={erros.nome ? 'O nome é obrigatório.' : ''}
                    />

                    <TextField
                        label="CPF"
                        fullWidth
                        disabled
                        value={funcionario?.cpf ?? ''}
                    />

                    <TextField
                        label="E-mail"
                        fullWidth
                        required
                        value={dados.email}
                        onChange={(e) => setDados({ ...dados, email: e.target.value })}
                        error={erros.email}
                        helperText={erros.email ? 'Informe um e-mail válido.' : ''}
                    />

                    <InputMask
                        mask="(99) 99999-9999"
                        value={dados.telefone}
                        onChange={(e) => setDados({ ...dados, telefone: e.target.value })}
                    >
                        {(inputProps: any) => (
                            <TextField
                                {...inputProps}
                                label="Telefone"
                                fullWidth
                                required
                                error={erros.telefone}
                                helperText={erros.telefone ? 'Informe um telefone válido.' : ''}
                            />
                        )}
                    </InputMask>

                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onFechar}>Cancelar</Button>
                <Button variant="contained" onClick={handleAtualizar}>Salvar</Button>
            </DialogActions>
        </Dialog>
    );
}





