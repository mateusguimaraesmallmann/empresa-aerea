import { SvgColor } from 'src/components/svg-color';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navDataCliente = [
  {
    title: 'Tela Inicial',
    path: '/tela-inicial-cliente',
    icon: icon('ic-user'),
  },
  {
    title: 'Comprar Milhas',
    path: '/comprar-milhas',
    icon: icon('ic-cart'),
  },
  {
    title: 'Efetuar Reservas',
    path: '/efetuar-reserva',
    icon: <EventAvailableIcon />,
  },
  {
    title: 'Fazer Check-in',
    path: '/check-in',
    icon: <CheckCircleIcon />,
  },
];
