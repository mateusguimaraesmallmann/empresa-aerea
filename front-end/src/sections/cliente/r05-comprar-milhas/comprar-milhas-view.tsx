import { useState } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard/main'; 

function ComprarMilhasView() {
  const [milhas, setMilhas] = useState(0);
  const [mensagem, setMensagem] = useState('');

  const valorPorMilha = 5;

  const handleCompra = () => {
    const valorTotal = milhas * valorPorMilha;
    const dataHora = new Date().toLocaleString();
  
    const novaTransacao = {
      dataHora,
      milhas,
      valor: valorTotal.toFixed(2),
      descricao: 'COMPRA DE MILHAS',
    };
  
    const historico = JSON.parse(localStorage.getItem('comprasMilhas') || '[]');
  
    
    historico.push(novaTransacao);
  
    
    localStorage.setItem('comprasMilhas', JSON.stringify(historico));
  
    
    console.log('Compra registrada:', novaTransacao);
    console.log('Histórico de compras:', historico);
  
    setMensagem('Compra registrada com sucesso!');
  };
  

  return (
    <DashboardContent>
  <Typography variant="h4" gutterBottom>
    Comprar Milhas
  </Typography>

  <Box p={2}>
    <Grid container spacing={3} maxWidth={500}>
      {/* Campo de milhas */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Quantidade de Milhas"
          type="number"
          fullWidth
          value={milhas}
          onChange={(e) => setMilhas(Number(e.target.value))}
        />
      </Grid>

      {/* Valor total */}
      <Grid item xs={12}>
        <Typography variant="subtitle1">
          Valor total: R$ {(milhas * valorPorMilha).toFixed(2)}
        </Typography>
      </Grid>

      {/* Botão */}
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleCompra}>
          Confirmar Compra
        </Button>
      </Grid>

      {/* Mensagem */}
      {mensagem && (
        <Grid item xs={12}>
          <Typography color="success.main">{mensagem}</Typography>
        </Grid>
      )}
    </Grid>
  </Box>
</DashboardContent>
  );
}
export default ComprarMilhasView;
