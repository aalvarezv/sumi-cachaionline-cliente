import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import Layout from '../../components/layout/Layout';
import Privado from '../../components/layout/Privado';
import InstitucionForm from '../../components/forms/InstitucionForm';


const Instituciones = () => {

    const { autenticado } = useContext(AuthContext);
        
    return ( 
        <Layout>
           <Privado>
             {autenticado 
             ?
                <div>
                    <h5 className="my-4 text-center">Administrar Instituciones</h5>
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