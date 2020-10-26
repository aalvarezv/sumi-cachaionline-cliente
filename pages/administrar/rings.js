import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import Layout from '../../components/layout/Layout';
import Privado from '../../components/layout/Privado';
import RingForm from '../../components/forms/RingForm';


const Rings = () => {

    const { autenticado } = useContext(AuthContext);
        
    return ( 
        <Layout>
           <Privado>
             {autenticado 
             ?
                <div>
                    <h3 className="mb-4 text-center">Administrar Rings</h3>
                    <RingForm/>
                </div>
             :
                null
             }
           </Privado>
        </Layout>
     );
}
 
export default Rings;