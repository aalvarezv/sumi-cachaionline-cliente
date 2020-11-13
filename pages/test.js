import React, { useContext } from 'react';
//import ListSelectCursoModulos from '../components/ui/ListSelectCursoModulos';
import Layout from '../components/layout/Layout';
import AuthContext from '../context/auth/AuthContext';
import {InputGroup, Form, Button, FormControl, Row, Col, div} from 'react-bootstrap';
//import InputSelectRol from '../components/ui/InputSelectRol';
//import TableRing from '../components/ui/TableRing';
//import Privado from '../components/layout/Privado';
//import InputSelectModuloContenidoTemaConcepto from '../components/ui/InputSelectModuloContenidoTemaConcepto';
//import InputSelectModuloContenidoTema from '../components/ui/InputSelectModulosContenidoTema';
import InputSelectTipoDuracionPregunta from '../components/ui/InputSelectTipoDuracionPregunta';
import TableUsuarios from '../components/ui/TableUsuario';


const Test = () => {

    const { autenticado } = useContext(AuthContext);
        
        
        return ( 
            <Layout>
            
                {autenticado 
                ?
                    
                        
                        <TableUsuarios/>
                    
                :
                    null
                }
            </Layout>
            
        );
}

export default Test;