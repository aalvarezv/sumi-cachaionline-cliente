import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import Layout from '../../components/layout/Layout';
import Privado from '../../components/layout/Privado';
import RolForm from '../../components/forms/RolForm';


const Roles = () => {

    const { autenticado } = useContext(AuthContext);
    
    return ( 
        <Layout>
           <Privado>
             {autenticado 
             ?
                <div>
                    <h5 className="my-4 text-center">Administrar Roles</h5>
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