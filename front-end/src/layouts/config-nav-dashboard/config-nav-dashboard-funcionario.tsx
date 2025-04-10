import { SvgColor } from 'src/components/svg-color';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navDataFuncionario = [
  {
    title: 'Tela Inicial',
    path: '/tela-inicial-funcionario',
    icon: icon('ic-user'),
  },
  {
    title: 'Cadastro de Voo',
    path: '',
    icon: <EventAvailableIcon />,
  },
  {
    title: 'Funcionarios',
    path: '',
    icon: icon('ic-user'),
  }
];
