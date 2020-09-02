import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ToastMultiline from '../../../components/ui/ToastMultiline';
import { Container, Form, Button } from 'react-bootstrap';
import {handleError } from '../../../helpers';
import  clienteAxios from '../../../config/axios';
import InputSearch from '../../ui/InputSearch';
import InputSelectNivelAcademico from '../../ui/InputSelectNivelAcademico';


const CursoForm = () => {

    const [filtro_busqueda, setFiltroBusqueda] = useState('');
    const [result_busqueda, setResultBusqueda] = useState([]);
    const [result_select, setResultSelect]     = useState(null);
    const [formulario, setFormulario] = useState({
        codigo: '',
        letra: '',
        codigo_nivel_academico: '',
        inactivo: false
    });
    
    const [errores, setErrores] = useState({});

    const buscarCurso = async () => {
        const resp = await clienteAxios.get(`/api/cursos/busqueda/${filtro_busqueda}`);
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
                codigo_nivel_academico: result_select.codigo_nivel_academico,
                inactivo: result_select.inactivo
            });
        }else{
            reseteaFormulario();
        }
        setErrores({});

    }, [filtro_busqueda, result_select]);


    const validarFormulario = () => {
        
        let errors = {}

        if(formulario.codigo.trim() === ''){
            errors = {
                ...errors,
                codigo: 'Requerido'
            }
        }

        if(formulario.letra.trim() === ''){
            errors = {
                ...errors,
                letra: 'Requerido'
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
            codigo_nivel_academico: '',
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

            const resp = await clienteAxios.post('/api/cursos/crear', curso);
            
            curso = resp.data;
            reseteaFormulario();
            toast.success(<ToastMultiline mensajes={[{msg: 'CURSO'},
                                                     {msg: `CODIGO: ${curso.codigo}`},
                                                     {msg: `LETRA: ${curso.letra}`},
                                                     {msg: 'CREADO CORRECTAMENTE'}
                                                    ]}/>, {containerId: 'sys_msg'});
        
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
            toast.success(<ToastMultiline mensajes={[{msg: 'CURSO'},
                                                     {msg: `CODIGO: ${(curso.codigo)}`},
                                                     {msg: `LETRA: ${curso.letra}`},
                                                     {msg: 'ACTUALIZADO CORRECTAMENTE'}
                                                    ]}/>, {containerId: 'sys_msg'});
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
            label="letra"
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
                        [e.target.name]: e.target.value.toUpperCase()
                    })}
                    readOnly={result_select}
                    isInvalid={errores.hasOwnProperty('codigo')}
                    onBlur={validarFormulario}
                />
                <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('codigo') && errores.codigo}
                </Form.Control.Feedback>
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
                    isInvalid={errores.hasOwnProperty('codigo_nivel_academico')}
                    onBlur={validarFormulario}
                />
                <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('codigo_nivel_academico') && errores.codigo_nivel_academico}
                </Form.Control.Feedback>
            </Form.Group>
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
                    onClick={handleClickActualizar}
                >Actualizar</Button>
            :
                <Button 
                    variant="info"
                    onClick={handleClickCrear}
                >Crear</Button>
            }
       </Form>
    </Container> );
}
 
export default CursoForm;