import React, { useContext } from 'react';
import ListSelectCursoModulos from '../components/ui/ListSelectCursoModulos';
import Layout from '../components/layout/Layout';
import AuthContext from '../context/auth/AuthContext';
import {InputGroup, Form, Button, FormControl, Row, Col} from 'react-bootstrap';
import InputSelectRol from '../components/ui/InputSelectRol';
import TableRing from '../components/ui/TableRing';
import Privado from '../components/layout/Privado';


const Test = () => {

    const { autenticado } = useContext(AuthContext);
        
        return ( 
            <Layout>
            <Privado>
                {autenticado 
                ?
                    <div>
                        <h3 className="mb-4 text-center">Administrar Cursos</h3>
                        <TableRing/>
                    </div>
                :
                    null
                }
            </Privado>
            </Layout>
        );
}
 
export default Test;