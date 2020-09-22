import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import {handleError } from '../../helpers';
import  clienteAxios from '../../config/axios';
import InputSearch from '../ui/InputSearch';
import ToastMultiline from '../ui/ToastMultiline';
import InputSelectNivelAcademico from '../ui/InputSelectNivelAcademico';
import InputSelectInstitucion from '../ui/InputSelectInstitucion';
import ListSelectCursoModulos from '../ui/ListSelectCursoModulos';
import ListSelectCursoUsuarios from '../ui/ListSelectCursoUsuarios';
import ButtonBack from '../ui/ButtonBack';

const CursoForm = () => {

    const router = useRouter();
    const [filtro_busqueda, setFiltroBusqueda] = useState('');
    const [result_busqueda, setResultBusqueda] = useState([]);
    const [result_select, setResultSelect]     = useState(null);
    const [formulario, setFormulario] = useState({
        codigo: '',
        letra: '',
        codigo_institucion: '0',
        codigo_nivel_academico: '0',
        inactivo: false
    });
    
    const [errores, setErrores] = useState({});

    const buscarCurso = async () => {
        const resp = await clienteAxios.get(`/api/cursos/busqueda/${filtro_busqueda}`, 
            { params: { 
                codigo_institucion: router.query.institucion 
            } 
        });
        setResultBusqueda(resp.data.cursos);
    }

    useEffect(() => {

        if(filtro_busqueda.trim() !== '' && !result_select){
            buscarCurso();
        }else{
            setResultBusqueda([]);
        }
        
        if(result_select){
            setFormulario({
                codigo: result_select.codigo,
                letra: result_select.letra,
                codigo_institucion: result_select.codigo_institucion,
                codigo_nivel_academico: result_select.codigo_nivel_academico,
                inactivo: result_select.inactivo
            });
        }else{
            reseteaFormulario();
        }
        setErrores({});

    }, [filtro_busqueda, result_select]);

    //carga la institución en el formulario si existe en la url.
    useEffect(() => {
        if(router.query.institucion){
            setFormulario({
                ...formulario,
                codigo_institucion: router.query.institucion
            });
        }
    }, []);

    const validarFormulario = () => {
        
        let errors = {}

        if(formulario.letra.trim() === ''){
            errors = {
                ...errors,
                letra: 'Requerido'
            }
        }
        
        if(formulario.codigo_institucion.trim() === '' || formulario.codigo_institucion.trim() === '0'){
            errors = {
                ...errors,
                codigo_institucion: 'Requerido'
            }
        }

        if(formulario.codigo_nivel_academico.trim() === '' || formulario.codigo_nivel_academico.trim() === '0'){
            errors = {
                ...errors,
                codigo_nivel_academico: 'Requerido'
            }
        }

        setErrores(errors);

        return errors;

    }

    const reseteaFormulario = () => {
        setFormulario({
            codigo: '',
            letra: '',
            codigo_institucion: (router.query.institucion ? router.query.institucion : '0'),
            codigo_nivel_academico: '0',
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
            //curso a enviar
            let curso = formulario;
            curso.codigo = uuidv4();

            const resp = await clienteAxios.post('/api/cursos/crear', curso);
            curso = resp.data;
            reseteaFormulario();
            toast.success(<ToastMultiline mensajes={[{msg: 'CURSO CREADO'}]}/>, {containerId: 'sys_msg'});
        
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
            let curso = formulario;
            await clienteAxios.put('/api/cursos/actualizar', curso);
            toast.success(<ToastMultiline mensajes={[{msg: 'CURSO ACTUALIZADO'}]}/>, {containerId: 'sys_msg'});
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
            label="nivel_letra"
        />

        <Form>
            <Form.Group>
                <Form.Label>Institución</Form.Label>
                <InputSelectInstitucion
                    id="codigo_institucion"
                    name="codigo_institucion"
                    as="select"
                    value={formulario.codigo_institucion}
                    onChange={e => setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.value
                    })}
                    isInvalid={errores.hasOwnProperty('codigo_institucion')}
                    onBlur={validarFormulario}
                    disabled={router.query.institucion} 
                />
                <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('codigo_institucion') && errores.codigo_institucion}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Row}>
                <Col sm={8}>
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
                            isInvalid={errores.hasOwnProperty('codigo_nivel_academico')}
                            onBlur={validarFormulario}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.hasOwnProperty('codigo_nivel_academico') && errores.codigo_nivel_academico}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col sm={4}>
                    <Form.Group>
                        <Form.Label>Letra</Form.Label>
                        <Form.Control
                            id="letra"
                            name="letra"
                            type="text" 
                            placeholder="LETRA"
                            value={formulario.letra}
                            onChange={e => setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value.toUpperCase()
                            })} 
                            isInvalid={errores.hasOwnProperty('letra')}
                            onBlur={validarFormulario}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.hasOwnProperty('letra') && errores.letra}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Form.Group>
            <Row className="mb-3">
                <Col sm={12}>
                    <Form.Check 
                        id="inactivo"
                        name="inactivo"
                        type="checkbox"
                        label="Inactivo"
                        checked={formulario.inactivo}
                        onChange={e => setFormulario({
                            ...formulario,
                            [e.target.name]: e.target.checked,
                        })}
                    />
                </Col>
            </Row>
            </Form>
            {result_select
            ?   
                <Button 
                    variant="outline-info"
                    onClick={handleClickActualizar}
                    size="lg"
                >Actualizar</Button>
            :
                <Button 
                    variant="info"
                    onClick={handleClickCrear}
                    size="lg"
                >Crear</Button>
            }
            <ButtonBack />
    {result_select
    
    &&
        <Container>
        <Row>
            <Col sm={12} md={6}>
                <Row className="mt-3">
                    <Button 
                        variant="success"
                        onClick={()=>{
                            router.push('/administrar/modulos')
                        }}
                        size="lg"
                        block
                    >+ Crear Modulos</Button>
                </Row>
                <Row className="mt-2 py-1 bg-light rounded">
                    <ListSelectCursoModulos
                        codigo_curso={formulario.codigo}
                    />
                </Row> 
            </Col>
            <Col className="ml-3">
                <Row className="mt-3">
                    <Button 
                        variant="success"
                        onClick={()=>{
                            router.push('/administrar/usuarios')
                        }}
                        size="lg"
                        block
                    >+ Crear Usuarios</Button>
                </Row>
                <Row className="mt-2 py-1 bg-light rounded">
                    <ListSelectCursoUsuarios
                        codigo_curso={formulario.codigo}
                    />
                </Row> 
            </Col>
        </Row>
        </Container>
    }
    </Container>
    );
}
 
export default CursoForm;