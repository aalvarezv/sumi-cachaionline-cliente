import React, { useContext } from 'react';
import ListSelectCursoModulos from '../components/ui/ListSelectCursoModulos';
import Layout from '../components/layout/Layout';
import AuthContext from '../context/auth/AuthContext';


const Test = () => {

    const { autenticado } = useContext(AuthContext);
    
    return (   
       
        <Layout>
            {autenticado &&  
            <ListSelectCursoModulos 
                codigo_curso={'1'}
            />}
        </Layout>
        
    
    );
}
 
export default Test;