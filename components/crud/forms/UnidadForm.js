import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ToastMultiline from '../../../components/ui/ToastMultiline';
import { Container, Form, Button } from 'react-bootstrap';
import {handleError } from '../../../helpers';
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
    
    const [errores, setErrores] = useState({});

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
            //verifica que no hayan errores
            if(Object.keys(errores).length > 0){
                return;
            }
            //Unidad a enviar
            let unidad = formulario;

            const resp = await clienteAxios.post('/api/unidades/crear', unidad);
            
            unidad = resp.data;
            reseteaFormulario();
            toast.success(<ToastMultiline mensajes={[{msg: 'UNIDAD'},
                                                     {msg: `CODIGO: ${unidad.codigo}`},
                                                     {msg: `DESCRIPCION: ${unidad.descripcion}`},
                                                     {msg: 'CREADA CORRECTAMENTE'}
                                                    ]}/>, {containerId: 'sys_msg'});
        
        }catch(e){
            handleError(e);
        }                                                
    }

    const handleClickActualizar = async e => {
        
        try{
            e.preventDefault();
            if(Object.keys(errores).length > 0){
                return;
            }
            let unidad = formulario;
            await clienteAxios.put('/api/unidades/actualizar', unidad);
            toast.success(<ToastMultiline mensajes={[{msg: 'UNIDAD'},
                                                     {msg: `CODIGO: ${(unidad.codigo)}`},
                                                     {msg: `NOMBRE: ${unidad.descripcion}`},
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
 
export default UnidadForm;