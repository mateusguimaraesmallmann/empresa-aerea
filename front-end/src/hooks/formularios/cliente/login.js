import * as yup from 'yup';

const schemaLogin = yup.object().shape({
  email: yup.string().email('E-mail inválido').required('O e-mail é obrigatório!'),
  password: yup
    .string()
    .required('A senha é obrigatória!')
    .min(4, 'A senha deve ter no mínimo 4 caracteres')
    .max(4, 'A senha pode ter até 4 caracteres'),
});

export default schemaLogin;