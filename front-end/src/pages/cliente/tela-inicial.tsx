import { Helmet } from 'react-helmet-async';

import { TelaInicialView } from 'src/sections/cliente/r03-mostrar-tela-inicial-cliente/cliente/view/tela-inicial-view';

// ----------------------------------------------------------------------

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
