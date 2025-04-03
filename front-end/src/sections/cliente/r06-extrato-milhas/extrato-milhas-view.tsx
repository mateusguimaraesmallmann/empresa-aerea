import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import axios from 'axios';
import { ExtratoMilhasTabela } from './extrato-milhas-tabela';
import { TransacaoMilhas } from './types';

export function ExtratoMilhasView() {
  const [transacoes, setTransacoes] = useState<TransacaoMilhas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const carregarExtrato = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/clientes/extrato-milhas', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTransacoes(response.data);
      } catch (err) {
        setError('Erro ao carregar extrato de milhas');
      } finally {
        setLoading(false);
      }
    };

    carregarExtrato();
  }, []);

  const filteredData = transacoes.filter((t) =>
    t.codigoReserva?.toLowerCase().includes(filter.toLowerCase()) ||
    t.descricao.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Extrato de Milhas</title>
      </Helmet>

      <DashboardContent>
        <Box mb={5}>
          <Typography variant="h4">Extrato de Milhas</Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Histórico completo de todas as suas transações de milhas
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center" mb={4}>
          <TextField
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Pesquisar transações..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" />
                </InputAdornment>
              ),
              endAdornment: filter && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setFilter('')}>
                    <Iconify icon="eva:close-fill" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ width: 400 }}
          />
        </Stack>

        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <ExtratoMilhasTabela transacoes={filteredData} />
        )}
      </DashboardContent>
    </>
  );
}