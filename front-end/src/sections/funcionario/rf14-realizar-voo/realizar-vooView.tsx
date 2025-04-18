import { TableCell, TableRow, Box } from '@mui/material';
import { RealizarVooActions } from 'src/sections/funcionario/rf14-realizar-voo/realizar-voo';

type Props = {
  voo: any,
  atualizarListaVoos: () => void;
}

export function RealizarVooView({ voo, atualizarListaVoos }: Props) {

  return (
    <TableRow key={voo.codigo}>
      ...
      <TableCell>
        <Box display="flex" gap={1}>
          <RealizarVooActions
            voo={voo}
            onRealizacaoSucesso={() => atualizarListaVoos()}
          />

        </Box>
      </TableCell>
    </TableRow>
  )
}