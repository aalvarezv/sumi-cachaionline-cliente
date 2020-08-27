import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import  clienteAxios from '../../../config/axios';
import InputSearch from '../../ui/InputSearch';
import InputSelectUnidad from '../../ui/InputSelectUnidad';
import InputSelectNivelAcademico from '../../ui/InputSelectNivelAcademico';

const ModuloForm = () => {

    const [filtro_busqueda, setFiltroBusqueda] = useState('');
    const [result_busqueda, setResultBusqueda] = useState([]);
    const [result_select, setResultSelect]     = useState(null);
    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        codigo_unidad: '',
        codigo_nivel_academico: '',
        inactivo: false
    });

    const buscarModulo = async () => {
        const resp = await clienteAxios.get(`/api/modulos/busqueda/${filtro_busqueda}`);
        setResultBusqueda(resp.data.modulos);
    }

    useEffect(() => {
        
        if(filtro_busqueda.trim() !== '' && !result_select){
            buscarModulo();
        }else{
            setResultBusqueda([]);
        }

        //cuando se selecciona o cambia el result_select
        if(result_select){
            setFormulario({
                codigo: result_select.codigo,
                descripcion: result_select.descripcion,
                codigo_unidad: result_select.codigo_unidad,
                codigo_nivel_academico: result_select.codigo_nivel_academico,
                inactivo: result_select.inactivo
            });
        }else{
            setFormulario({
                codigo: '',
                descripcion: '',
                codigo_unidad: '',
                codigo_nivel_academico: '',
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
                <Form.Label>Unidad</Form.Label>
                <InputSelectUnidad
                    id="codigo_unidad"
                    name="codigo_unidad"
                    as="select"
                    value={formulario.codigo_unidad}
                    onChange={e => setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.value
                    })}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Nivel Academico</Form.Label>
                <InputSelectNivelAcademico
                    id="codigo_nivel_academico"
                    name="codigo_nivel_academico"
                    as="select"
                    value={formulario.codigo_nivel_academico}
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
 
export default ModuloForm;