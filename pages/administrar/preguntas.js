import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import Layout from '../../components/layout/Layout';
import Privado from '../../components/layout/Privado';
import PreguntaForm from '../../components/forms/PreguntaForm';


const Cursos = () => {

    const { autenticado } = useContext(AuthContext);
        
    return ( 
        <Layout>
           <Privado>
             {autenticado 
             ?
                <div>
                    <h3 className="mb-4 text-center">Administrar Preguntas</h3>
                    <PreguntaForm/>
                </div>
             :
                null
             }
           </Privado>
        </Layout>
     );
}
 
export default Cursos;