import { Helmet } from 'react-helmet-async';

import  { ExtratoMilhasView } from 'src/sections/cliente/r06-extrato-milhas/extrato-milhas-view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Extrato de milhas</title>
      </Helmet>

      <ExtratoMilhasView />
    </>
  );
}
