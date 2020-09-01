import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ToastMultiline from '../../../components/ui/ToastMultiline';
import { Container, Form, Button } from 'react-bootstrap';
import { handleError } from '../../../helpers';
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

    const [errores, setErrores] = useState({});

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
            reseteaFormulario();
        }
        setErrores({});

    }, [filtro_busqueda, result_select]);

    const validarFormulario = () => {
        //setea los errores para que no exista ninguno.
        let errors = {}
        //valida el codigo
        if(formulario.codigo.trim() === ''){
            errors = {
                ...errors,
                codigo: 'Requerido'
            }
        }

        //valida la descripcion.
        if(formulario.descripcion.trim() === ''){
            errors = {
                ...errors,
                descripcion: 'Requerido'
            }
        }

        //valida la unidad.
        if(formulario.codigo_unidad.trim() === '' || formulario.codigo_unidad.trim() === '0'){
            errors = {
                ...errors,
                codigo_unidad: 'Requerido'
            }
        }
        //valida el nivel academico.
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
            descripcion: '',
            codigo_unidad: '',
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
             //modulo a enviar
             let modulo = formulario; 
             const resp = await clienteAxios.post('/api/modulos/crear', modulo);
             //respuesta del modulo recibido.
             modulo = resp.data;
             reseteaFormulario();
             toast.success(<ToastMultiline mensajes={[{msg: 'MODULO'},
                                                      {msg: `CODIGO: ${modulo.codigo}`},
                                                      {msg: `DESCRIPCION: ${modulo.descripcion}`},
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
            //modulo a enviar
            let modulo = formulario;

            await clienteAxios.put('/api/modulos/actualizar', modulo);
            //respuesta del usuario recibido.
            toast.success(<ToastMultiline mensajes={[{msg: 'MODULO'},
                                                     {msg: `CODIGO: ${modulo.codigo}`},
                                                     {msg: `DESCRIPCION: ${modulo.descripcion}`},
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
                    isInvalid={errores.hasOwnProperty('codigo_unidad')}
                    onBlur={validarFormulario}
                />
                <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('codigo_unidad') && errores.codigo_unidad}
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
 
export default ModuloForm;