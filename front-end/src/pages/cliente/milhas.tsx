import { Helmet } from 'react-helmet-async';

import { MilhasView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Milhas</title>
      </Helmet>

      <MilhasView />
    </>
  );
}
