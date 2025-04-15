import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { Voo, voosMockados } from 'src/_mock/voos-mock';
import { TabelaVoosFuncionario } from '../tabela-voos-funcionario';

export function TelaInicialView() {
  const [voos, setVoos] = useState<Voo[]>([]);

  useEffect(() => {
    const agora = new Date();
    const daqui48h = new Date(agora.getTime() + 48 * 60 * 60 * 1000);

    const voosFiltrados = voosMockados.filter((voo) => {
      const dataVoo = new Date(voo.dataHora);
      return dataVoo > agora && dataVoo <= daqui48h;
    });

    setVoos(voosFiltrados);
  }, []);

  return (
    <>
      <Helmet>
        <title>Tela inicial Funcionario</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
          <Typography variant="h4" flexGrow={1}>
            Olá, Funcionario!
          </Typography>
        </Box>

        <TabelaVoosFuncionario voos={voos} />
        
      </DashboardContent>
    </>
  );
}