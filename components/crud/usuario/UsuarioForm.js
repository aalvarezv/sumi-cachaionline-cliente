import React, { useState, useCallback, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { debounce, handleError } from '../../../helpers';
import  clienteAxios from '../../../config/axios';
import InputSearch from '../../ui/InputSearch';

const UsuarioForm = () => {

    const [filtro_busqueda, setFiltroBusqueda] = useState('');
    const [result_busqueda, setResultBusqueda] = useState([]);
    const [result_select, setResultSelect]     = useState(null);

    useEffect(() => {
       
        const buscarUsuario = async () => {
            console.log('consulta...',filtro_busqueda);
            const resp = await clienteAxios.get(`/api/usuarios/busqueda/${filtro_busqueda}`);
            setResultBusqueda(resp.data.usuarios);
        }
        //si tengo un filtro de búsqueda y no hay un usuario seleccionado, entonces busca.
        if(filtro_busqueda.trim() !== '' && !result_select){
            buscarUsuario();
        }else{
            setResultBusqueda([]);
        }

    }, [filtro_busqueda]);
    
    return ( 
    <Container>

        <InputSearch
            setFilter={setFiltroBusqueda}
            results={result_busqueda}
            setResultSelect={setResultSelect}
        />

        <Form>
            <Form.Group>
                <Form.Label>Rut</Form.Label>
                <Form.Control 
                    id="rut"
                    name="rut"
                    type="text" 
                    placeholder="RUT" 
                    autoComplete="off"
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                    id="nombre"
                    name="nombre"
                    type="text" 
                    placeholder="NOMBRE COMPLETO" 
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control 
                    id="email"
                    name="email"
                    type="email" 
                    placeholder="TU.EMAIL@GMAIL.COM" 
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Teléfono</Form.Label>
                <Form.Control 
                    id="telefono"
                    name="telefono"
                    type="tel" 
                    placeholder="(+56)945678323" 
                />
            </Form.Group>
            <Form.Group>
            <Form.Label>Rol</Form.Label>
                <Form.Control
                    id="rol"
                    name="rol"
                    as="select"
                >
                    <option>SELECCIONE UN ROL</option>
                    <option>ADMINISTRADOR</option>
                    <option>ALUMNO</option>
                    <option>PROFESOR</option>
                </Form.Control>
            </Form.Group>
            <Form.Check 
                id="inactivo"
                name="inactivo"
                type="checkbox"
                label="Inactivo"
                className="mb-3"
            />
            <Button 
                variant="info"
            >Crear</Button>
       </Form>
    </Container> );
}
 
export default UsuarioForm;