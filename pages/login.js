import React from 'react';
import Layout from '../components/layout/Layout';
import { Formulario, InputSubmit, Campo } from '../components/ui/Formulario';

const Login = () => {
    return ( 
        <Layout>
            <h1 css={`
                text-align: center;
                margin-top: 3rem;
            `}
            >Inciar Sesión</h1>
            <Formulario>
                <Campo>
                    <label 
                        for="usuario"
                    >
                        Usuario
                    </label>
                     <input 
                        type="text"
                        name="usuario"
                        placeholder="Usuario"
                     ></input>
                </Campo>
                <Campo>
                    <label 
                        for="clave"
                    >
                        Clave
                    </label>
                     <input 
                        type="text"
                        name="clave"
                        placeholder="Clave"
                     ></input>
                </Campo>
                <InputSubmit
                    type="submit"
                    value="ingresar"
                    primary
                />
            </Formulario>
           
        </Layout>
     );
}
 
export default Login;