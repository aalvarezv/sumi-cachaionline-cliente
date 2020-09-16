import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ToastMultiline from '../../../components/ui/ToastMultiline';
import { Container, Form, Button } from 'react-bootstrap';
import {handleError } from '../../../helpers';
import  clienteAxios from '../../../config/axios';
import InputSearch from '../../ui/InputSearch';

const NivelAcademicoForm = () => {

    const [filtro_busqueda, setFiltroBusqueda] = useState('');
    const [result_busqueda, setResultBusqueda] = useState([]);
    const [result_select, setResultSelect]     = useState(null);
    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        nivel: '',
        inactivo: false
    });

    const [errores, setErrores] = useState({});

    const buscarNivelAcademico = async () => {
        const resp = await clienteAxios.get(`/api/nivel-academico/busqueda/${filtro_busqueda}`);
        setResultBusqueda(resp.data.nivelesAcademicos);
    }

    useEffect(() => {

        if(filtro_busqueda.trim() !== '' && !result_select){
            buscarNivelAcademico();
        }else{
            setResultBusqueda([]);
        }

        if(result_select){
            setFormulario({
                codigo: result_select.codigo,
                descripcion: result_select.descripcion,
                nivel: result_select.nivel,
                inactivo: result_select.inactivo
            });
        }else{
            reseteaFormulario();
        }
        setErrores({});

    }, [filtro_busqueda, result_select])

    const validarFormulario = () => {
        
        let errors = {}

        if(formulario.codigo.trim() === ''){
            errors = {
                ...errors,
                codigo: 'Requerido'
            }
        }

        if(formulario.descripcion.trim() === ''){
            errors = {
                ...errors,
                descripcion: 'Requerido'
            }
        }

        if(Number(formulario.nivel) === 0){
            errors = {
                ...errors,
                nivel: 'Requerido'
            }
        }

        setErrores(errors);

        return errors;

    }

    const reseteaFormulario = () => {
        setFormulario({
            codigo: '',
            descripcion: '',
            nivel: '',
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
            let nivelacademico = formulario;

            const resp = await clienteAxios.post('/api/nivel-academico/crear', nivelacademico);
            
            nivelacademico = resp.data;
            reseteaFormulario();
            toast.success(<ToastMultiline mensajes={[{msg: 'NIVEL ACADEMICO'},
                                                     {msg: `CODIGO: ${nivelacademico.codigo}`},
                                                     {msg: `DESCRIPCION: ${nivelacademico.descripcion}`},
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
            let nivelacademico = formulario;
            await clienteAxios.put('/api/nivel-academico/actualizar', nivelacademico);
            toast.success(<ToastMultiline mensajes={[{msg: 'NIVEL ACADEMICO'},
                                                     {msg: `CODIGO: ${(nivelacademico.codigo)}`},
                                                     {msg: `NOMBRE: ${nivelacademico.descripcion}`},
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
                    value={formulario.codigo}
                     onChange={e => {
                         setFormulario({
                             ...formulario,
                            [e.target.name]: e.target.value.toUpperCase()
                         })
                     }}
                     readOnly={result_select} 
                     isInvalid={errores.hasOwnProperty('codigo')}
                     onBlur={validarFormulario}
                />
                <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('codigo') && errores.codigo}
                 </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                 <Form.Label>Descripcion</Form.Label>
                 <Form.Control
                     id="descripcion"
                     name="descripcion"
                     type="text" 
                     placeholder="DESCRIPCIÓN" 
                     value={formulario.descripcion}
                     onChange={e => {setFormulario({
                             ...formulario,
                            [e.target.name]: e.target.value.toUpperCase()
                         })
                     }}
                     isInvalid={errores.hasOwnProperty('descripcion')}
                     onBlur={validarFormulario}
                 />
                 <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('descripcion') && errores.descripcion}
                 </Form.Control.Feedback>
             </Form.Group>
             <Form.Group>
                 <Form.Label>Nivel Numérico</Form.Label>
                 <Form.Control
                     id="nivel"
                     name="nivel"
                     type="text" 
                     placeholder="NIVEL NUMÉRICO" 
                     value={formulario.nivel}
                     onChange={e => {
                        //si es número ó es vacío.
                        if (Number(e.target.value) || e.target.value === '') {
                            setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value
                            })
                        }
                     }}
                     isInvalid={errores.hasOwnProperty('nivel')}
                     onBlur={validarFormulario}
                 />
                 <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('nivel') && errores.nivel}
                 </Form.Control.Feedback>
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
                <Button 
                    variant="outline-info"
                    onClick={handleClickActualizar}
            >   Actualizar</Button>
             :
                <Button 
                    variant="info"
                    onClick={handleClickCrear}
                >Crear</Button>
             }
        </Form>
        </Container> );
}
 
export default NivelAcademicoForm;