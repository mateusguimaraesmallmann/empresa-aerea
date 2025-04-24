import { Helmet } from 'react-helmet-async';

import CadastrarVoo from 'src/sections/funcionario/rf15-cadastrar-voo/cadastrar-voo';

export default function Page() {
    return (
        <>
            <Helmet>
                <title>Cadastrar Voo</title>
            </Helmet>
            <CadastrarVoo />
        </>
    );
}