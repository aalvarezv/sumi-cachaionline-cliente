import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import Layout from '../../components/layout/Layout';
import Privado from '../../components/layout/Privado';
import NivelAcademicoForm from '../../components/forms/NivelAcademicoForm';


const NivelesAcademicos = () => {

    const { autenticado } = useContext(AuthContext);
        
    return ( 
        <Layout>
           <Privado>
             {autenticado 
             ?
                <div>
                    <h5 className="my-4 text-center">Administrar Niveles Académicos</h5>
                    <NivelAcademicoForm/>
                </div>
             :
                null
             }
           </Privado>
        </Layout>
     );
}
 
export default NivelesAcademicos;