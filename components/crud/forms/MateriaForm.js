import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ToastMultiline from '../../../components/ui/ToastMultiline';
import { Container, Form, Button } from 'react-bootstrap';
import { handleError } from '../../../helpers';
import  clienteAxios from '../../../config/axios';
import InputSearch from '../../ui/InputSearch';
import InputSelectRol from '../../ui/InputSelectRol';



const MateriaForm = () => {

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
    //1.- definir la variable que almacena los errores.
    const [errores, setErrores] = useState({});

    const buscarMateria = async () => {
        const resp = await clienteAxios.get(`/api/materias/busqueda/${filtro_busqueda}`);
        setResultBusqueda(resp.data.materias);
    }

    useEffect(() => {

        if(filtro_busqueda.trim() !== '' && !result_select){
            buscarMateria();
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
            reseteaFormulario();
        }
        setErrores({});

    }, [filtro_busqueda, result_select])

    const validarFormulario = () => {
        //setea los errores para que no exista ninguno.
        let errors = {}
        //valida el rut.
        //valida el codigo.
        if(formulario.codigo.trim() === ''){
            errors = {
                ...errors,
                codigo: 'Requerido'
            }
        }
        //valida el nombre.
        if(formulario.nombre.trim() === ''){
            errors = {
                ...errors,
                nombre: 'Requerido'
            }
        }
        //valida el descripcion.
        if(formulario.descripcion.trim() === ''){
            errors = {
                ...errors,
                descripcion: 'Requerido'
            }
        }

        setErrores(errors);

        return errors;

    }

    const reseteaFormulario = () => {
        setFormulario({
            codigo: '',
            nombre: '',
            descripcion: '',
            imagen: '',
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
             //materia a enviar
             let materia = formulario;
             const resp = await clienteAxios.post('/api/materias/crear', materia);
             //respuesta de la materia recibido.
             materia = resp.data;
             reseteaFormulario();
             toast.success(<ToastMultiline mensajes={[{msg: 'MATERIA'},
                                                      {msg: `CODIGO: ${materia.codigo}`},
                                                      {msg: `NOMBRE: ${materia.nombre}`},
                                                      {msg: 'CREADA CORRECTAMENTE'}  
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
            //materia a enviar
            let materia = formulario;

            await clienteAxios.put('/api/materias/actualizar', materia);
            //respuesta de la materia recibido.
            toast.success(<ToastMultiline mensajes={[{msg: 'MATERIA'},
                                                     {msg: `CODIGO: ${materia.codigo}`},
                                                     {msg: `NOMBRE: ${materia.nombre}`},
                                                     {msg: 'ACTUALIZADA CORRECTAMENTE'}  
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
                                [e.target.name]: e.target.value.toUpperCase()
                            })
                        }} 
                        isInvalid={errores.hasOwnProperty('nombre')}
                        onBlur={validarFormulario}
                    />
                <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('nombre') && errores.nombre}
                </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control 
                        id="descripcion"
                        name="descripcion"
                        as="textarea" 
                        rows="5"
                        placeholder="DESCRIPCIÓN"
                        value={formulario.descripcion}
                        onChange={e => {
                            setFormulario({
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
 
export default MateriaForm;