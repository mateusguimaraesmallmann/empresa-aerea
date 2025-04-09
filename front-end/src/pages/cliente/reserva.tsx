import { Helmet } from 'react-helmet-async';

import { ReservaView  } from 'src/sections/cliente/r07-efetuar-reserva/reserva-view';

// ----------------------------------------------------------------------

export default function ReservaPage() {
  return (
    <>
      <Helmet>
        <title>Efetuar Reserva</title>
      </Helmet>

      <ReservaView />
    </>
  );
}
