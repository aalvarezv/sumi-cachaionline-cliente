import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import Layout from '../../components/layout/Layout';
import Privado from '../../components/layout/Privado';
import MateriaForm from '../../components/forms/MateriaForm';


const Materias = () => {

    const { autenticado } = useContext(AuthContext);
        
    return ( 
        <Layout>
           <Privado>
             {autenticado 
             ?
                <div>
                    <h5 className="my-4 text-center">Administrar Materias</h5>
                    <MateriaForm/>
                </div>
             :
                null
             }
           </Privado>
        </Layout>
     );
}
 
export default Materias;