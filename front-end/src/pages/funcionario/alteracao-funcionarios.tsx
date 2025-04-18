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

  const handleAtualizar = (atualizado: Funcionario) => {
    const novaLista = funcionarios.map((f) => (f.id === atualizado.id ? atualizado : f));
    localStorage.setItem('funcionarios', JSON.stringify(novaLista));
    navigate('/listar-funcionarios-view');
  };

  return (
    <>
      <Helmet>
        <title>Editar Funcionário</title>
      </Helmet>

      <AlteracaoFuncionariosView
        aberto
        funcionario={funcionarioSelecionado}
        onFechar={() => navigate('/listar-funcionarios-view')}
        onAtualizar={handleAtualizar}
      />
    </>
  );
}