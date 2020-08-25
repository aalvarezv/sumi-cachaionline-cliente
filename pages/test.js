import React from 'react';
import Layout from '../components/layout/Layout';
import UsuarioForm from '../components/crud/usuario/UsuarioForm';
import RolForm from '../components/crud/rol/RolForm';
//import MateriaForm from '../components/crud/materia/MateriaForm';
 import UnidadForm from '../components/crud/unidad/UnidadFrom';
 import NivelAcademicoForm from '../components/crud/nivel_academico/NivelAcademicoForm';
// import ModuloForm from '../components/crud/modulo/ModuloForm';
// import PreguntaForm from '../components/crud/pregunta/PreguntaForm';
// import AlternativaForm from '../components/crud/alternativa/AlternativaForm';
import InputSelectRol from '../components/ui/InputSelectRol';
import InputSelectModulo from '../components/ui/InputSelectModulo';
import InputSelectMateria from '../components/ui/InputSelectMateria';
import InputSelectUnidad from '../components/ui/InputSelectUnidad';
import InputSelectNivelAcademico from '../components/ui/InputSelectNivelAcademico';
import ModuloForm from '../components/crud/modulo/ModuloForm';

const Test = () => {
    return ( 
        <Layout>
        <div>
            <h1>Pagina de pruebas</h1>  
            <ModuloForm/>
        </div>
        </Layout>
    );
}
  
export default Test;