import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import Layout from '../../components/layout/Layout';
import Privado from '../../components/layout/Privado';
import UsuarioForm from '../../components/forms/UsuarioForm';


const Usuarios = () => {

    const { autenticado } = useContext(AuthContext);
        
    return ( 
        <Layout>
           <Privado>
             {autenticado 
             ?
                <div>
                    <h5 className="my-4 text-center">Administrar Usuarios</h5>
                    <UsuarioForm/>
                </div>
             :
                null
             }
           </Privado> 
        </Layout>
     );
}
 
export default Usuarios;