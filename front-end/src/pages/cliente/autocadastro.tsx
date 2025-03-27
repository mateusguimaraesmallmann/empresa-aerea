/* Importa o componente de interface AutoCadastroView (onde está todo o formulário com os campos e lógica).
   E exporta como uma página, permitindo que essa tela seja acessada por uma rota do nosso sistema (/autocadastro).
*/

import { AutoCadastroView } from 'src/sections/cliente/r01-autocadastro/autocadastro';

export default function AutoCadastroPage() {
  return (
      <AutoCadastroView />
  );
}
