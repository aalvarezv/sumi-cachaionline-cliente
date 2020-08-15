import React from 'react';
import UsuarioForm from '../components/crud/usuario/UsuarioForm';
import Layout from '../components/layout/Layout';
import RolForm from '../components/crud/rol/RolForm';
import MateriaForm from '../components/crud/materia/MateriaForm';
import UnidadForm from '../components/crud/unidad/UnidadFrom';
import NivelAcademicoForm from '../components/crud/nivel_academico/NivelAcademicoForm';
import ModuloForm from '../components/crud/modulo/ModuloForm';
import PreguntaForm from '../components/crud/pregunta/PreguntaForm';
import AlternativaForm from '../components/crud/alternativa/AlternativaForm';


const Test = () => {
    return ( 
        <Layout>
        <div>
            <h1>Pagina de pruebas</h1>  
            <AlternativaForm/>
        </div>
        </Layout>
    );
}
 
export default Test;