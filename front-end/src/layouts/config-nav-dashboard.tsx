import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
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
    icon: icon('ic-blog'),
  },
  {
    title: 'Consultar Reservas',
    path: '/',
    icon: icon('ic-blog'),
  },
  {
    title: 'Fazer Check-in',
    path: '/check-in',
    icon: icon('ic-disabled'),
  },
];
