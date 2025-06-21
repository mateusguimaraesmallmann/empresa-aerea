import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RemoverFuncionariosView } from 'src/sections/funcionario/rf19-remocao-funcionarios/remocao-funcionarios';
import { Funcionario } from '../../sections/funcionario/types/funcionario';

export default function RemocaoFuncionarioPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const idParam = searchParams.get('id');
  const id = idParam ? parseInt(idParam, 10) : null;

  const lista: Funcionario[] = JSON.parse(localStorage.getItem('funcionarios') || '[]');
  const funcionario = id !== null ? lista.find((f) => Number(f.id) === id) || null : null;

  const handleFechar = () => navigate('/listar-funcionarios');
  const handleInativar = (funcionarioInativado: Funcionario) => navigate('/listar-funcionarios');

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