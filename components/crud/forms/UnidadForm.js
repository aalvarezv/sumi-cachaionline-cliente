import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import  clienteAxios from '../../../config/axios';
import InputSearch from '../../ui/InputSearch';
import InputSelectMateria from '../../ui/InputSelectMateria';


const UnidadForm = () => {

    const [filtro_busqueda, setFiltroBusqueda] = useState('');
    const [result_busqueda, setResultBusqueda] = useState([]);
    const [result_select, setResultSelect]     = useState(null);
    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        codigo_materia: '',
        inactivo: false
    });

    const buscarUnidad = async () => {
        const resp = await clienteAxios.get(`/api/unidades/busqueda/${filtro_busqueda}`);
        setResultBusqueda(resp.data.unidades);
    }

    useEffect(() => {

        if(filtro_busqueda.trim() !== '' && !result_select){
            buscarUnidad();
        }else{
            setResultBusqueda([]);
        }
        
        if(result_select){
            setFormulario({
                codigo: result_select.codigo,
                descripcion: result_select.descripcion,
                codigo_materia: result_select.codigo_materia,
                inactivo: result_select.inactivo
            });
        }else{
            setFormulario({
                codigo: '',
                descripcion: '',
                codigo_materia: '',
                inactivo: false
            });
        }

    }, [filtro_busqueda, result_select]);

    return ( 
    <Container>

        <InputSearch
            setFilter={setFiltroBusqueda}
            results={result_busqueda}
            setResultSelect={setResultSelect}
            id="codigo"
            label="descripcion"
        />

       <Form>
            <Form.Group>
                <Form.Label>Codigo</Form.Label>
                <Form.Control 
                    id="codigo"
                    name="codigo"
                    type="text" 
                    placeholder="CODIGO" 
                    autoComplete="off"
                    value={formulario.codigo}
                    onChange={e => setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.value,
                    })}
                    readOnly={result_select}
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
                    onChange={e => setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.value,
                    })} 
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Materia</Form.Label>
                <InputSelectMateria
                    id="codigo_materia"
                    name="codigo_materia"
                    as="select"
                    value={formulario.codigo_materia}
                    onChange={e => setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.value
                    })}
                />
            </Form.Group>
            <Form.Check 
                id="inactivo"
                name="inactivo"
                type="checkbox"
                label="Inactivo"
                className="mb-3"
                checked={formulario.inactivo}
                onChange={e => setFormulario({
                    ...formulario,
                    [e.target.name]: e.target.checked,
                })}
            />
            {result_select
            ?
                <Button 
                    variant="outline-info"
                >Actualizar</Button>
            :
                <Button 
                    variant="info"
                >Crear</Button>
            }
       </Form>
    </Container> );
}
 
export default UnidadForm;