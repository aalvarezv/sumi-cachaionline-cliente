import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import Layout from '../../components/layout/Layout';
import Privado from '../../components/layout/Privado';
import RolForm from '../../components/crud/forms/RolForm';


const Roles = () => {

    const { autenticado } = useContext(AuthContext);
    
    return ( 
        <Layout>
           <Privado>
             {autenticado 
             ?
                <div>
                    <h3 className="mb-4 text-center">Administrar Roles</h3>
                    <RolForm/>
                </div>
             :
                null
             }
           </Privado>
        </Layout>
     );
}
 
export default Roles;