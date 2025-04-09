import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Autocomplete,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { DashboardContent } from 'src/layouts/dashboard';
import { voosMockados } from 'src/_mock/voos-mock';
import { TabelaVoos, Voo } from './tabela-voos';
import { DetalhesReserva } from './detalhes-reservas';

// Gera as opções para o Autocomplete a partir das origens e destinos dos voos
const todosAeroportos = voosMockados
  .map((v) => [v.origem, v.destino])
  .flat()
  .filter((valor, indice, self) => self.indexOf(valor) === indice);

export function ReservaView() {
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [voosFiltrados, setVoosFiltrados] = useState<Voo[]>([]);
  const [vooSelecionado, setVooSelecionado] = useState<Voo | null>(null);
  const [buscaRealizada, setBuscaRealizada] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const buscarVoos = () => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const resultado = voosMockados.filter((voo) => {
      const dataVoo = new Date(voo.dataHora);
      dataVoo.setHours(0, 0, 0, 0);

      const dataValida = dataVoo >= hoje;
      const origemMatch = origem
        ? voo.origem.toLowerCase().includes(origem.trim().toLowerCase())
        : true;
      const destinoMatch = destino
        ? voo.destino.toLowerCase().includes(destino.trim().toLowerCase())
        : true;

      return dataValida && origemMatch && destinoMatch;
    });

    setVoosFiltrados(resultado);
    setBuscaRealizada(true);

    if (resultado.length === 0) {
      setSnackbarMessage('Nenhum voo encontrado.');
    } else {
      setSnackbarMessage(`${resultado.length} voo(s) encontrado(s).`);
    }
    setSnackbarOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Efetuar Reserva</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
          <Typography variant="h4" flexGrow={1}>
            Reserva de Voos
          </Typography>
        </Box>

        <Box display="flex" gap={2} mb={3} flexWrap="wrap" alignItems="center">
          <Autocomplete
            sx={{ flex: 1, minWidth: 420 }}
            options={todosAeroportos}
            value={origem}
            onChange={(_, value) => setOrigem(value || '')}
            renderInput={(params) => <TextField {...params} label="Aeroporto Origem" fullWidth />}
          />

          <Autocomplete
            sx={{ flex: 1, minWidth: 420 }}
            options={todosAeroportos}
            value={destino}
            onChange={(_, value) => setDestino(value || '')}
            renderInput={(params) => <TextField {...params} label="Aeroporto Destino" fullWidth />}
          />

          <Button
            variant="contained"
            onClick={buscarVoos}
            size="medium"
            sx={{ height: 36, minWidth: 110 }} 
          >
            Buscar
          </Button>
        </Box>

        {!vooSelecionado && buscaRealizada && (
          <TabelaVoos voos={voosFiltrados} onSelecionar={setVooSelecionado} />
        )}

        {vooSelecionado && <DetalhesReserva voo={vooSelecionado} />}

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={voosFiltrados.length === 0 ? 'error' : 'success'}
            sx={{
              backgroundColor: voosFiltrados.length === 0 ? '#fddede' : '#d0f2d0',
              color: voosFiltrados.length === 0 ? '#611a15' : '#1e4620',
              width: '100%',
            }}
            elevation={6}
            variant="filled"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </DashboardContent>
    </>
  );
}
