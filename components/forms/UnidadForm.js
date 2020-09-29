import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import ToastMultiline from '../ui/ToastMultiline';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import {handleError } from '../../helpers';
import  clienteAxios from '../../config/axios';
import InputSearch from '../ui/InputSearch';
import InputSelectMateria from '../ui/InputSelectMateria';
import ButtonBack from '../ui/ButtonBack';


const UnidadForm = () => {

    const router = useRouter();
    const [filtro_busqueda, setFiltroBusqueda] = useState('');
    const [result_busqueda, setResultBusqueda] = useState([]);
    const [result_select, setResultSelect]     = useState(null);
    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        codigo_materia: '',
        inactivo: false
    });
    
    const [errores, setErrores] = useState({});

    const buscarUnidad = async () => {
        try{
            const resp = await clienteAxios.get(`/api/unidades/busqueda/${filtro_busqueda}`);
            setResultBusqueda(resp.data.unidades);
        }catch(e){
            handleError(e);
        }
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
            reseteaFormulario();
        }
        setErrores({});

    }, [filtro_busqueda, result_select]);

    //carga la materia en el formulario si existe en la url.
    useEffect(() => {
        if(router.query.materia){
            setFormulario({
                ...formulario,
                codigo_materia: router.query.materia
            });
        }
    }, []);

    const validarFormulario = () => {
        
        let errors = {}

        if(formulario.descripcion.trim() === ''){
            errors = {
                ...errors,
                descripcion: 'Requerido'
            }
        }

        if(formulario.codigo_materia.trim() === '' || formulario.codigo_materia.trim() === '0'){
            errors = {
                ...errors,
                codigo_materia: 'Requerido'
            }
        }

        setErrores(errors);

        return errors;

    }

    const reseteaFormulario = () => {
        setFormulario({
            codigo: '',
            descripcion: '',
            codigo_materia: '',
            inactivo: false
        });
    }

    const handleClickCrear = async e => {
        
        try{
            //previne el envío
            e.preventDefault();
            //valida el formulario
            const errors = validarFormulario();
            //verifica que no hayan errores
            if(Object.keys(errors).length > 0){
                return;
            }
            //Unidad a enviar
            let unidad = formulario;
            unidad.codigo = uuidv4();

            const resp = await clienteAxios.post('/api/unidades/crear', unidad);
            
            unidad = resp.data;
            reseteaFormulario();
            toast.success(<ToastMultiline mensajes={[{msg: 'UNIDAD CREADA'}]}/>, {containerId: 'sys_msg'});
        
        }catch(e){
            handleError(e);
        }                                                
    }

    const handleClickActualizar = async e => {
        
        try{
            e.preventDefault();
            //valida el formulario
            const errors = validarFormulario();
            //verifica que no hayan errores
            if(Object.keys(errors).length > 0){
                return;
            }
            let unidad = formulario;
            await clienteAxios.put('/api/unidades/actualizar', unidad);
            toast.success(<ToastMultiline mensajes={[{msg: 'UNIDAD ACTUALIZADA'}]}/>, {containerId: 'sys_msg'});
        }catch(e){
            handleError(e);
        }
    }

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
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                    id="descripcion"
                    name="descripcion"
                    type="text" 
                    placeholder="DESCRIPCIÓN"
                    value={formulario.descripcion}
                    onChange={e => setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.value.toUpperCase()
                    })} 
                    isInvalid={errores.hasOwnProperty('descripcion')}
                    onBlur={validarFormulario}
                />
                <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('descripcion') && errores.descripcion}
                </Form.Control.Feedback>
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
                    isInvalid={errores.hasOwnProperty('codigo_materia')}
                    onBlur={validarFormulario}
                    disabled={router.query.materia}
                />
                <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('codigo_materia') && errores.codigo_materia}
                </Form.Control.Feedback>
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
            <Row className="justify-content-center">
                <Col className="mb-3 mb-sm-0" xs={12} sm={"auto"}>
                    {result_select
                    ?
                        <Button 
                            variant="outline-info"
                            size="lg"
                            className="btn-block"
                            onClick={handleClickActualizar}
                        >Actualizar</Button>
                    :
                        <Button 
                            variant="info"
                            size="lg"
                            className="btn-block"
                            onClick={handleClickCrear}
                        >Crear</Button>
                    }
                </Col>
                <Col className="mb-3 mb-sm-0" xs={12} sm={"auto"}>
                    <Button 
                        variant="success"
                        disabled={!result_select}
                        size="lg"
                        className="btn-block"
                        onClick={() => {
                            router.push({
                                pathname: '/administrar/modulos',
                                query: { 
                                    materia: formulario.codigo_materia,
                                    unidad: formulario.codigo
                                },
                            })
                        }}
                    >+ Agregar Módulos</Button>
                </Col>
                <Col xs={12} sm={"auto"}>
                    <ButtonBack />
                </Col>
            </Row>
       </Form>
    </Container> );
}
 
export default UnidadForm;