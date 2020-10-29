import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import Layout from '../../components/layout/Layout';
import Privado from '../../components/layout/Privado';
import ModuloForm from '../../components/forms/ModuloForm';


const Modulos = () => {

    const { autenticado } = useContext(AuthContext);

    return ( 
        <Layout>
           <Privado>
             {autenticado 
             ?
                <div>
                    <h5 className="my-4 text-center">Administrar Módulos</h5>
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