import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import Layout from '../../components/layout/Layout';
import Privado from '../../components/layout/Privado';
import ModuloForm from '../../components/crud/forms/ModuloForm';


const Modulos = () => {

    const { autenticado } = useContext(AuthContext);

    return ( 
        <Layout>
           <Privado>
             {autenticado 
             ?
                <div>
                    <h3 className="mb-4 text-center">Administrar Módulos</h3>
                    <ModuloForm/>
                </div>
             :
                null
             }
           </Privado>
        </Layout>
     );
}
 
export default Modulos;