export type TipoUsuario = 'CLIENTE' | 'FUNCIONARIO';

export const usuariosMock = [
    {
      email: 'cliente@teste.com',
      senha: '1234',
      tipo: 'CLIENTE' as TipoUsuario,
      cpf: '12345678901'
    },
    {
      email: 'funcionario@teste.com',
      senha: '1234',
      tipo: 'FUNCIONARIO' as TipoUsuario,
      cpf: '99999999999',
    },
  ];