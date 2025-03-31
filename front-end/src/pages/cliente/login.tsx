import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SignInView } from 'src/sections/cliente/r02-efetuar-login-logout/auth';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>

      <SignInView />
    </>
  );
}
