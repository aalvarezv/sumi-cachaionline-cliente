import * as Yup from 'yup';


const LoginSchema = Yup.object().shape({
    rut: Yup.string()
    .min(8, 'El RUT es muy corto')
    .max(9, 'El RUT es muy largo')
    .required('Requerido'),
    clave: Yup.string()
    .required('Requerida')
});

export default LoginSchema;