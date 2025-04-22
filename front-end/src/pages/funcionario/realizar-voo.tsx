
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { RealizarVooView } from 'src/sections/funcionario/rf14-realizar-voo/realizar-vooView';

export default function RealizarVooPage() {
  const { codigo } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Realizar Voo</title>
      </Helmet>

      <RealizarVooView 
        codigoVoo={codigo || ''}
        onRealizacao={() => navigate('/funcionario/tela-inicial')}
        onVoltar={() => navigate(-1)}
      />
    </>
  );
}