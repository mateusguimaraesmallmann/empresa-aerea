import { useState } from 'react';
import { Box, Button, Typography, Autocomplete, TextField, Snackbar, Alert } from '@mui/material';
import { voosMockados } from 'src/_mock/voos-mock'; // Importa o mock simplificado
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

  // Estados do Snackbar
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
      setSnackbarMessage("Nenhum voo encontrado.");
    } else {
      setSnackbarMessage(`${resultado.length} voo(s) encontrado(s).`);
    }
    setSnackbarOpen(true);
  };

  return (
    <Box maxWidth="lg" mx="auto" px={2}>
      <Typography variant="h4" mb={3}>
        Reserva de Voos
      </Typography>

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
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
          sx={{ whiteSpace: 'nowrap', height: 56 }}
        >
          Buscar
        </Button>
      </Box>

      {/* Renderiza a tabela de voos se a busca foi realizada */}
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
          severity="info"
          sx={{ backgroundColor: '#ADD8E6', color: 'black', width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}