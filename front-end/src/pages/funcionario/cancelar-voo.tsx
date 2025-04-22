// pages/funcionario/cancelar-voo.tsx
import { useNavigate } from 'react-router-dom';
import { CancelarVooView } from 'src/sections/funcionario/rf13-cancelar-voo/CancelarVooView';

export default function CancelarVooPage() {
  const navigate = useNavigate();

  return (
    <>
      
        <title>Cancelar Voo</title>
      
      
      <CancelarVooView 
        onCancelamento={() => navigate('/funcionario/tela-inicial')}
        onVoltar={() => navigate(-1)}
      />
    </>
  );
}