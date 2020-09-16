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
                    <h3 className="mb-4 text-center">Administrar Materias</h3>
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