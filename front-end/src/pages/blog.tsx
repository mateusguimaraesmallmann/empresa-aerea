import { Helmet } from 'react-helmet-async';

import { BlogView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Efetuar Reserva</title>
      </Helmet>

      <BlogView />
    </>
  );
}
