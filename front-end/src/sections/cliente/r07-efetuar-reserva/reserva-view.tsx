import { useState, useEffect } from 'react';
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
import { buscarTodosVoos } from 'src/api/voo'; 
import { TabelaVoos, Voo } from './tabela-voos';
import { DetalhesReserva } from './detalhes-reservas';

export function ReservaView() {
  const [voosSalvos, setVoosSalvos] = useState<Voo[]>([]);
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [voosFiltrados, setVoosFiltrados] = useState<Voo[]>([]);
  const [vooSelecionado, setVooSelecionado] = useState<Voo | null>(null);
  const [buscaRealizada, setBuscaRealizada] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Busca voos do backend
  useEffect(() => {
    buscarTodosVoos().then(setVoosSalvos).catch(() => {
      setVoosSalvos([]);
      setSnackbarMessage('Erro ao buscar voos do sistema.');
      setSnackbarOpen(true);
    });
  }, []);

  // Preenche a lista de aeroportos
  const todosAeroportos = [
    ...new Set(
      voosSalvos
        .map((v) => [
          typeof v.origem === 'string'
            ? v.origem
            : v.origem.nome || v.origem.codigoAeroporto,
          typeof v.destino === 'string'
            ? v.destino
            : v.destino.nome || v.destino.codigoAeroporto,
        ])
        .flat()
        .filter(Boolean)
    ),
  ];

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const buscarVoos = () => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const resultado = voosSalvos.filter((voo) => {
      const dataVoo = new Date(voo.dataHora);
      dataVoo.setHours(0, 0, 0, 0);

      const dataValida = dataVoo >= hoje;
      const origemMatch = origem
        ? (
            typeof voo.origem === 'string'
              ? voo.origem
              : voo.origem.nome || voo.origem.codigoAeroporto
          )
            .toLowerCase()
            .includes(origem.trim().toLowerCase())
        : true;
      const destinoMatch = destino
        ? (
            typeof voo.destino === 'string'
              ? voo.destino
              : voo.destino.nome || voo.destino.codigoAeroporto
          )
            .toLowerCase()
            .includes(destino.trim().toLowerCase())
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
            renderInput={(params) => (
              <TextField {...params} label="Aeroporto Origem" fullWidth />
            )}
          />

          <Autocomplete
            sx={{ flex: 1, minWidth: 420 }}
            options={todosAeroportos}
            value={destino}
            onChange={(_, value) => setDestino(value || '')}
            renderInput={(params) => (
              <TextField {...params} label="Aeroporto Destino" fullWidth />
            )}
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

        {vooSelecionado && (
          <DetalhesReserva
            voo={vooSelecionado}
            onReservaFinalizada={() => {
              setVooSelecionado(null);
              setOrigem('');
              setDestino('');
              setBuscaRealizada(false);
              setVoosFiltrados([]);
            }}
          />
        )}

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
