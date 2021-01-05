import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Container, Form, Tabs, Tab, Button, Row, Col } from 'react-bootstrap';
import ToastMultiline from '../ui/ToastMultiline';
import { handleError } from '../../helpers';
import  clienteAxios from '../../config/axios';
import InputSelectMateria from '../ui/InputSelectMateria';
import InputSelectUnidadesMateria from '../ui/InputSelectUnidadesMateria';
import InputSelectModulosUnidad from '../ui/InputSelectModulosUnidad';

const ContenidoForm = ({contenido_modificar, handleClickVolver}) => {

    const router = useRouter();
    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        codigo_modulo: '',
        codigo_unidad: '',
        codigo_materia: '',
        inactivo: false,
    });

    const [codigo_materia, setCodigoMateria] = useState('0');
    const [codigo_unidad, setCodigoUnidad] = useState('0');
    const [codigo_modulo, setCodigoModulo] = useState('0');

    const [errores, setErrores] = useState({});

    useEffect(() => {
        

        //cuando se selecciona o cambia el result_select
        if(contenido_modificar){

            setCodigoUnidad(contenido_modificar.modulo.codigo_unidad);
            setCodigoMateria(contenido_modificar.modulo.unidad.codigo_materia);

            setFormulario({
                codigo: contenido_modificar.codigo,
                descripcion: contenido_modificar.descripcion,
                codigo_modulo: contenido_modificar.codigo_modulo,
                inactivo: contenido_modificar.inactivo
            });


        }else{
            reseteaFormulario();
        }
        setErrores({});

    }, [contenido_modificar]);

    const validarFormulario = () => {
        //setea los errores para que no exista ninguno.
        let errors = {}

        //valida la descripcion.
        if(formulario.descripcion.trim() === ''){
            errors = {
                ...errors,
                descripcion: 'Requerido'
            }
        }

        //valida la unidad.
        if(formulario.codigo_modulo.trim() === '' || formulario.codigo_modulo.trim() === '0'){
            errors = {
                ...errors,
                codigo_modulo: 'Requerido'
            }
        }

        setErrores(errors);

        return errors;

    }

    const reseteaFormulario = () => {
        setFormulario({
            codigo: '',
            descripcion: '',
            codigo_modulo: '',
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
            //contenido a enviar
            let contenido = {
                ...formulario,
             }

             const resp = await clienteAxios.post('/api/modulo-contenidos/crear', contenido);
             //respuesta del contenido recibido.
             contenido = resp.data;
             reseteaFormulario();
             toast.success(<ToastMultiline mensajes={[{msg: 'CONTENIDO CREADO'}]}/>, {containerId: 'sys_msg'});
 
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
            //contenido a enviar
            let contenido = formulario;

            await clienteAxios.put('/api/modulo-contenidos/actualizar', contenido);
            //respuesta del usuario recibido.
            toast.success(<ToastMultiline mensajes={[{msg: 'CONTENIDO ACTUALIZADO'}]}/>, {containerId: 'sys_msg'});
 
        }catch(e){
             handleError(e);
        }
    }



    return ( 
        <Container>
            <Form className="p-3">
                <Form.Group>
                    <Form.Label>Codigo</Form.Label>
                        <Form.Control
                            id="codigo"
                            name="codigo"
                            type="text" 
                            placeholder="CODIGO" 
                            value={formulario.codigo}
                            onChange={e => setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value.toUpperCase()
                            })}
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
                    <Form.Label>Matateria</Form.Label>
                        <InputSelectMateria
                            id="codigo_materia"
                            name="codigo_materia"
                            as="select"
                            size="sm"
                            value={codigo_materia}
                            onChange={e => {
                                setCodigoMateria(e.target.value)
                                setCodigoUnidad('0')
                                setCodigoModulo('0')
                            }}
                        />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Unidad</Form.Label>
                        <InputSelectUnidadesMateria
                            id="codigo_unidad"
                            name="codigo_unidad"
                            /*codigo materia se le pasa a las props del componente
                            para filtrar las unidades de la materia seleccionada.*/
                            codigo_materia={codigo_materia}
                            as="select"
                            size="sm"
                            value={codigo_unidad}
                            onChange={e => {
                                setCodigoUnidad(e.target.value)
                                setCodigoModulo('0')
                            }}
                        />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Modulos</Form.Label>
                        <InputSelectModulosUnidad
                            id="codigo_modulo"
                            name="codigo_modulo"
                            /*codigo unidad se le pasa a las props del componente
                            para filtrar los modulos de la unidad seleccionada.*/
                            codigo_unidad={codigo_unidad}
                            as="select"
                            size="sm"
                            value={formulario.codigo_modulo}
                            onChange={e => {
                                setFormulario({
                                    ...formulario,
                                    [e.target.name]: e.target.value
                                });
                            }}
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
            <Row className="justify-content-center">
            <Col className="mb-3 mb-sm-0" xs={12} sm={"auto"}>
                    {contenido_modificar
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
                <Button 
                        variant="info"
                        size="lg"
                        onClick={handleClickVolver}
                    >Volver</Button>
            </Row>
            </Form>
        </Container> 
     );
}
 
export default ContenidoForm;
