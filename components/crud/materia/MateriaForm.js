import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Container, Form, Button } from 'react-bootstrap';
import AuthContext from '../../../context/auth/AuthContext';
import  clienteAxios from '../../../config/axios';
import InputSearch from '../../ui/InputSearch';
import InputSelectRol from '../../ui/InputSelectRol';



const MateriaForm = () => {

    const { autenticado } = useContext(AuthContext);
    const router = useRouter();

    const [filtro_busqueda, setFiltroBusqueda] = useState('');
    const [result_busqueda, setResultBusqueda] = useState([]);
    const [result_select, setResultSelect]     = useState(null);
    const [formulario, setFormulario] = useState({
        codigo: '',
        nombre: '',
        descripcion: '',
        imagen: '',
        inactivo: false
    });

    const busquedaMateria = async () => {
        const resp = await clienteAxios.get(`/api/materias/busqueda/${filtro_busqueda}`);
        setResultBusqueda(resp.data.materias);
    }

    useEffect(() => {

        if(filtro_busqueda.trim() !== '' && !result_select){
            busquedaMateria();
        }else{
            setResultBusqueda([]);
        }

        if(result_select){
            setFormulario({
                codigo: result_select.codigo,
                nombre: result_select.nombre,
                descripcion: result_select.descripcion,
                imagen: result_select.imagen,
                inactivo: result_select.inactivo
            });
        }else{
            setFormulario({
                codigo: '',
                nombre: '',
                descripcion: '',
                imagen: '',
                inactivo: false
            });
        }

    }, [filtro_busqueda, result_select])

    if(!autenticado){
        router.push('/login');
        return null;
    }

    return ( 
        <Container>
            <InputSearch
                setFilter={setFiltroBusqueda}
                results={result_busqueda}
                setResultSelect={setResultSelect}
                id="codigo"
                label="nombre"
            />
        <Form>
                <Form.Group>
                    <Form.Label>Codigo</Form.Label>
                    <Form.Control 
                        id="codigo"
                        name="codigo"
                        type="text" 
                        placeholder="CODIGO"
                        value={formulario.codigo}
                        onChange={e => {
                            setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value
                            })
                        }}
                        readOnly={result_select}  
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        id="nombre"
                        name="nombre"
                        type="text" 
                        placeholder="NOMBRE MATERIA" 
                        value={formulario.nombre}
                        onChange={e => {
                            setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value
                            })
                        }} 
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control 
                        id="descripcion"
                        name="descripcion"
                        type="text" 
                        placeholder="DESCRIPCIÓN"
                        value={formulario.descripcion}
                        onChange={e => {
                            setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value
                            })
                        }}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.File 
                        id="Imagen" 
                        label="Imagen" 
                        
                    />
                </Form.Group>        
                <Form.Check 
                        id="inactivo"
                        name="inactivo"
                        type="checkbox"
                        label="Inactivo"
                        className="mb-3"
                        checked={formulario.inactivo}
                        onChange={e => {
                            setFormulario({
                            ...formulario,
                            [e.target.name]: e.target.checked
                            });
                        }}
                />
                {result_select
                ?
                    <Button variant="outline-info">Actualizar</Button>
                :
                    <Button variant="info">Crear</Button>
                }
            </Form>
        </Container> );
}
 
export default MateriaForm;