import { Helmet } from 'react-helmet-async';
import { FazerCheckIn } from 'src/sections/cliente/r10-fazer-check-in/fazer-check-in';

// ----------------------------------------------------------------------

export default function FazerCheckInPage() {
  return (
    <>
      <Helmet>
        <title>Fazer Check-in</title>
      </Helmet>

      <FazerCheckIn />
    </>
  );
}
