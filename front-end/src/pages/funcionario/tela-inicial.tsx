import { Helmet } from 'react-helmet-async';

import { TelaInicialView } from 'src/sections/funcionario/rf11-mostrar-tela-inicial-funcionario/view/tela-inicial-view';

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Tela inicial</title>
      </Helmet>

      <TelaInicialView />
    </>
  );
}