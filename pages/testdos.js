import React, { useContext, useState } from 'react';
//import ListSelectCursoModulos from '../components/ui/ListSelectCursoModulos';
import Layout from '../components/layout/Layout';
import AuthContext from '../context/auth/AuthContext';
import {Image,Form, Button, Row, Col, Container} from 'react-bootstrap';
//import InputSelectRol from '../components/ui/InputSelectRol';
//import TableRing from '../components/ui/TableRing';
import Privado from '../components/layout/Privado';
//import InputSelectModuloContenidoTemaConcepto from '../components/ui/InputSelectModuloContenidoTemaConcepto';
//import InputSelectModuloContenidoTema from '../components/ui/InputSelectModulosContenidoTema';
import InputSelectTipoDuracionPregunta from '../components/ui/InputSelectTipoDuracionPregunta';
import TableUsuarios from '../components/ui/TableUsuario';
import ContenidoForm from '../components/forms/ContenidoForm';
import TemaForm from '../components/forms/TemaForm';
import ConceptoForm from '../components/forms/ConceptoForm';
import TableInstitucion from '../components/ui/TableInstitucion';
import TableNivelAcademico from '../components/ui/TableNivelAcademico';
import TableRol from '../components/ui/TableRol';
import TableUsuario from '../components/ui/TableUsuario';
import TableMateria from '../components/ui/TableMateria';


const Testdos = () =>{

  const { autenticado } = useContext(AuthContext);

  return (
    <Layout>
    <Privado>
      <Container fluid>
      <TableInstitucion/>
      </Container>
    </Privado>
    </Layout>
  );
}

export default Testdos;