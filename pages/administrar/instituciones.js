import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import Layout from '../../components/layout/Layout';
import Privado from '../../components/layout/Privado';
import InstitucionForm from '../../components/crud/forms/InstitucionForm';


const Instituciones = () => {

    const { autenticado } = useContext(AuthContext);
        
    return ( 
        <Layout>
           <Privado>
             {autenticado 
             ?
                <div>
                    <h3 className="mb-4 text-center">Administrar Instituciones</h3>
                    <InstitucionForm/>
                </div>
             :
                null
             }
           </Privado>
        </Layout>
     );
}
 
export default Instituciones;