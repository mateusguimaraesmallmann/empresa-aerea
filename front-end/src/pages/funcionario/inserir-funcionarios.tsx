import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import { InserirFuncionariosView } from 'src/sections/funcionario/rf17-inserir-funcionarios';
import { Funcionario } from 'src/sections/funcionario/types/funcionario';

export default function InserirFuncionarioPage() {
  const navigate = useNavigate();

  const handleInserir = (novoFuncionario: Funcionario) => {
    navigate('/listar-funcionarios');
  };

  return (
    <>
      <Helmet>
        <title>Inserir Funcionário</title>
      </Helmet>

      <InserirFuncionariosView
        aberto
        onFechar={() => navigate('/listar-funcionarios')}
        onSucesso={handleInserir}
      />
    </>
  );
}
