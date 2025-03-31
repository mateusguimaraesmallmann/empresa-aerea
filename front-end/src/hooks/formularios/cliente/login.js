import * as yup from 'yup';

const schemaLogin = yup.object().shape({
  email: yup.string().email('E-mail inválido').required('O e-mail é obrigatório!'),
  password: yup
    .string()
    .required('A senha é obrigatória!')
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .max(8, 'A senha pode ter até 8 caracteres'),
});

export default schemaLogin;