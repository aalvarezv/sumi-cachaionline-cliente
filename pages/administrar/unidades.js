import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import Layout from '../../components/layout/Layout';
import Privado from '../../components/layout/Privado';
import UnidadForm from '../../components/forms/UnidadForm';


const Unidades = () => {

    const { autenticado } = useContext(AuthContext);
        
    return ( 
        <Layout>
           <Privado>
             {autenticado 
             ?
                <div>
                    <h5 className="my-4 text-center">Administrar Unidades</h5>
                    <UnidadForm/>
                </div>
             :
                null
             }
           </Privado>
        </Layout>
     );
}
 
export default Unidades;