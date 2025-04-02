import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

function ComprarMilhasView() {
  const [milhas, setMilhas] = useState(0);
  const [mensagem, setMensagem] = useState('');

  const valorPorMilha = 5;

  const handleCompra = () => {
    const valorTotal = milhas * valorPorMilha;
    const dataHora = new Date().toLocaleString();

    const transacao = {
      dataHora,
      milhas,
      valor: valorTotal.toFixed(2),
      descricao: 'COMPRA DE MILHAS',
    };

    console.log('Transação registrada:', transacao);
    setMensagem('Compra realizada com sucesso!');
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} width="100%" maxWidth={400}>
      <Typography variant="h5">Comprar Milhas</Typography>

      <TextField
        label="Quantidade de Milhas"
        type="number"
        value={milhas}
        onChange={(e) => setMilhas(Number(e.target.value))}
        fullWidth
      />

      <Typography>
        Valor total: R$ {(milhas * valorPorMilha).toFixed(2)}
      </Typography>

      <Button variant="contained" color="primary" onClick={handleCompra}>
        Confirmar Compra
      </Button>

      {mensagem && <Typography color="green">{mensagem}</Typography>}
    </Box>
  );
}

export default ComprarMilhasView;
