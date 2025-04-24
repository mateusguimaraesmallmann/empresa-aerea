import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Autocomplete,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { voosMockados, Voo } from 'src/_mock/voos-mock';
import { DashboardContent } from 'src/layouts/dashboard';

const schema = yup.object({
  dataHora: yup.string().required('Data e hora são obrigatórias'),
  origem: yup.string().required('Origem é obrigatória'),
  destino: yup.string().required('Destino é obrigatória'),
  valorReais: yup
    .string()
    .required('Valor da passagem é obrigatório')
    .matches(/^\d+(,\d{2})?$/, 'Formato inválido'),
  poltronas: yup
    .number()
    .typeError('Digite um número válido.')
    .required('Quantidade de poltronas é obrigatória'),
});

const todosAeroportos = voosMockados
  .map((v) => [v.origem, v.destino])
  .flat()
  .filter((valor, indice, self) => self.indexOf(valor) === indice);

export default function CadastrarVoo() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarTipo, setSnackbarTipo] = useState<'success' | 'error'>('success');
  const [milhasGeradas, setMilhasGeradas] = useState(0);
  const [botaoDesabilitado, setBotaoDesabilitado] = useState(false);
  const [codigoGerado, setCodigoGerado] = useState('');
  const [idGerado, setIdGerado] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const valorReais = watch('valorReais');

  useEffect(() => {
    gerarIdECodigo();
  }, []);

  useEffect(() => {
    if (snackbarOpen) gerarIdECodigo();
  }, [snackbarOpen]);

  const gerarIdECodigo = () => {
    const voosSalvos = JSON.parse(localStorage.getItem('voos') || '[]');
    const proximoNumero = voosSalvos.length + 1;
    const novoId = proximoNumero.toString();
    const novoCodigo = `TADS${proximoNumero.toString().padStart(4, '0')}`;
    setIdGerado(novoId);
    setCodigoGerado(novoCodigo);
  };

  useEffect(() => {
    const valor = parseFloat(valorReais?.replace(',', '.') || '0');
    setMilhasGeradas(Math.floor(valor / 5));
  }, [valorReais]);

  const onSubmit = async (data: any) => {
    const valor = parseFloat(data.valorReais.replace(',', '.'));

    const voo = {
      id: idGerado,
      codigo: codigoGerado,
      dataHora: dayjs(data.dataHora).format('YYYY-MM-DDTHH:mm:ss'),
      origem: data.origem,
      destino: data.destino,
      preco: valor,
      poltronas: data.poltronas,
      poltronasOcupadas: 0,
      milhas: Math.floor(valor / 5),
      estado: 'CONFIRMADO',
    };

    const voosSalvos = JSON.parse(localStorage.getItem('voos') || '[]');
    voosSalvos.push(voo);
    localStorage.setItem('voos', JSON.stringify(voosSalvos));

    setSnackbarMessage(`Voo ${codigoGerado} cadastrado com sucesso!`);
    setSnackbarTipo('success');
    setSnackbarOpen(true);
    reset();
    setMilhasGeradas(0);
    setBotaoDesabilitado(true);

    setTimeout(() => setBotaoDesabilitado(false), 2000);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const aplicarMascaraValor = (value: string) => {
    const apenasNumeros = value.replace(/\D/g, '');
    const comVirgula = (parseInt(apenasNumeros || '0', 10) / 100).toFixed(2);
    return comVirgula.replace('.', ',');
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Cadastrar Voo
        </Typography>
      </Box>

      <Box
        sx={{
          backgroundColor: 'white',
          p: 3,
          borderRadius: 2,
          width: '100%',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Código do Voo"
                fullWidth
                value={codigoGerado}
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Data e Hora"
                type="datetime-local"
                fullWidth
                {...register('dataHora')}
                error={!!errors.dataHora}
                helperText={errors.dataHora?.message}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="origem"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={todosAeroportos}
                    onChange={(_, value) => field.onChange(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Aeroporto de Origem"
                        fullWidth
                        error={!!errors.origem}
                        helperText={errors.origem?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="destino"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={todosAeroportos}
                    onChange={(_, value) => field.onChange(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Aeroporto de Destino"
                        fullWidth
                        error={!!errors.destino}
                        helperText={errors.destino?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Valor da Passagem"
                fullWidth
                {...register('valorReais')}
                value={
                  valorReais
                    ? new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(parseFloat(valorReais.replace(',', '.')))
                    : ''
                }
                onChange={(e) => setValue('valorReais', aplicarMascaraValor(e.target.value))}
                error={!!errors.valorReais}
                helperText={errors.valorReais?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Milhas Geradas"
                fullWidth
                value={milhasGeradas}
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantidade de Poltronas"
                fullWidth
                {...register('poltronas')}
                error={!!errors.poltronas}
                helperText={errors.poltronas?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField label="Estado do Voo" fullWidth value="CONFIRMADO" disabled />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button type="submit" variant="contained" disabled={botaoDesabilitado}>
                  Cadastrar Voo
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarTipo}
            sx={{
              backgroundColor: snackbarTipo === 'error' ? '#fddede' : '#d0f2d0',
              color: snackbarTipo === 'error' ? '#611a15' : '#1e4620',
              width: '100%',
            }}
            elevation={6}
            variant="filled"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </DashboardContent>
  );
}