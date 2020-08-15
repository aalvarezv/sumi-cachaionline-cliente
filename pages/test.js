import React from 'react';
import UsuarioForm from '../components/crud/usuario/UsuarioForm';
import Layout from '../components/layout/Layout';

const Test = () => {
    return ( 
        <Layout>
        <div>
            <h1>Pagina de pruebas</h1> 
            <UsuarioForm/>  
        </div>
        </Layout>
    );
}
 
export default Test;