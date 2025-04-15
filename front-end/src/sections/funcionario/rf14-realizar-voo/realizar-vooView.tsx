import { RealizarVooActions } from 'src/sections/funcionario/rf14-realizar-voo/realizar-voo';


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