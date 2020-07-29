import React, { useContext, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Formulario, InputSubmit, Campo } from '../components/ui/Formulario';
import AuthContext from '../context/auth/AuthContext';

import { toast } from 'react-toastify';


const Login = () => {

    const { notificacion, iniciarSesion } = useContext(AuthContext);


    const notify = () => {
       
        toast.warning("Alerta!")
        toast.success("Exito!")
        toast.info("Info!")
    };

    const handleSubmit = e => {
        e.preventDefault();
        iniciarSesion({
            rut: '162323695',
            clave: '123456'
        })

    }

    return ( 
        <Layout>
            <h1 css={`
                text-align: center;
                margin-top: 5rem;
            `}
            >Inciar Sesión</h1>
            <Formulario
                onSubmit={handleSubmit}
            >
                <Campo>
                    <label 
                        htmlFor="usuario"
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
                        htmlFor="clave"
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
                <p css={`
                    color: teal;
                    font-weight: 700;
                    text-align: center;
                `}>Olvide mi clave</p>
                <div>
                    <button onClick={notify}>Notify !</button>
                </div>
            </Formulario>
        </Layout>
     );
}
 
export default Login;