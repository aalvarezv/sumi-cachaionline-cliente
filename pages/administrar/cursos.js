import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import Layout from '../../components/layout/Layout';
import Privado from '../../components/layout/Privado';
import CursoForm from '../../components/crud/forms/CursoForm';


const Cursos = () => {

    const { autenticado } = useContext(AuthContext);
        
    return ( 
        <Layout>
           <Privado>
             {autenticado 
             ?
                <div>
                    <h3 className="mb-4 text-center">Administrar Cursos</h3>
                    <CursoForm/>
                </div>
             :
                null
             }
           </Privado>
        </Layout>
     );
}
 
export default Cursos;