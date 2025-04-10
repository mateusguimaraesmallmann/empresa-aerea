export type TipoUsuario = 'CLIENTE' | 'FUNCIONARIO';

export const usuariosMock = [
    {
      email: 'cliente@teste.com',
      senha: '1234',
      tipo: 'CLIENTE' as TipoUsuario,
    },
    {
      email: 'funcionario@teste.com',
      senha: '1234',
      tipo: 'FUNCIONARIO' as TipoUsuario,
    },
  ];