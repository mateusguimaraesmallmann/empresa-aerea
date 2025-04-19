import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Funcionario } from 'src/sections/funcionario/types/funcionario';
import { RemoverFuncionariosView } from 'src/sections/funcionario/rf19-remocao-funcionarios/remocao-funcionarios';

export default function RemocaoFuncionarioPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = Number(searchParams.get('id'));

    const lista: Funcionario[] = JSON.parse(localStorage.getItem('funcionarios') || '[]');
    const funcionario = lista.find((f) => f.id === id) || null;

    const handleFechar = () => {
        navigate('/listar-funcionarios');
    };

    const handleInativar = (funcionarioInativado: Funcionario) => {
        navigate('/listar-funcionarios');
    };

    return (
        <>
            <Helmet>
                <title>Remover Funcionário(a)</title>
            </Helmet>

            <RemoverFuncionariosView
                aberto
                funcionario={funcionario}
                onFechar={handleFechar}
                onInativar={handleInativar}
            />
        </>
    );
}