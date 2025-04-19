import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { AlteracaoFuncionariosView } from 'src/sections/funcionario/r18-alteracao-funcionario/rf18-alteracao-funcionarios-view';
import { Funcionario } from 'src/sections/funcionario/types/funcionario';

export default function AlteracaoFuncionariosPage() {
  const [searchParams] = useSearchParams();
  const id = Number(searchParams.get('id'));
  const navigate = useNavigate();

  const funcionarios: Funcionario[] = JSON.parse(localStorage.getItem('funcionarios') || '[]');
  const funcionarioSelecionado = funcionarios.find((f) => f.id === Number(id)) || null;

  return (
    <>
      <Helmet>
        <title>Alterar Funcionário</title>
      </Helmet>

      <AlteracaoFuncionariosView
        aberto
        funcionario={funcionarioSelecionado}
        onFechar={() => navigate('/listar-funcionarios-view')}
        onAtualizar={() => navigate('/listar-funcionarios-view')}
      />
    </>
  );
}