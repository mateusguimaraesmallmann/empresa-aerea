import { SvgColor } from 'src/components/svg-color';
import FlightTakeoff from '@mui/icons-material/FlightTakeoff';

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
    path: '/cadastrar-voo',
    icon: <FlightTakeoff />,
  },
  {
    title: 'Funcionarios',
    path: '',
    icon: icon('ic-user'),
  }
];
