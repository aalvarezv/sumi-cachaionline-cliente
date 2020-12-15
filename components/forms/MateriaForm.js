import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { Container, Form, Button, Image, Row, Col } from 'react-bootstrap';
import ToastMultiline from '../ui/ToastMultiline';
import { handleError, getBase64 } from '../../helpers';
import  clienteAxios from '../../config/axios';
import InputSearch from '../ui/InputSearch';
import Uploader from '../ui/Uploader';
import ButtonBack from '../ui/ButtonBack';


const MateriaForm = ({materia_modificar, handleClickVolver}) => {

    const router = useRouter();
    const [filtro_busqueda, setFiltroBusqueda] = useState('');
    const [formulario, setFormulario] = useState({
        codigo: '',
        nombre: '',
        descripcion: '',
        imagen: '',
        inactivo: false
    });
    //1.- definir la variable que almacena los errores.
    const [errores, setErrores] = useState({});

    useEffect(() => {

        if(materia_modificar){
            setFormulario({
                codigo: materia_modificar.codigo,
                nombre: materia_modificar.nombre,
                descripcion: materia_modificar.descripcion,
                imagen: materia_modificar.imagen,
                inactivo: materia_modificar.inactivo
            });
        }else{
            reseteaFormulario();
        }
        setErrores({});

    }, [materia_modificar])

    const validarFormulario = () => {
        //setea los errores para que no exista ninguno.
        let errors = {}

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
             let materia = {
                 ...formulario,
                codigo : uuidv4(),
             }

             const resp = await clienteAxios.post('/api/materias/crear', materia);
             //respuesta de la materia recibido.
             materia = resp.data;
             reseteaFormulario();
             toast.success(<ToastMultiline mensajes={[{msg: 'MATERIA CREADA'}]}/>, {containerId: 'sys_msg'});
 
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
            toast.success(<ToastMultiline mensajes={[{msg: 'MATERIA ACTUALIZADA'}]}/>, {containerId: 'sys_msg'});
 
        }catch(e){
             handleError(e);
        }
    }

    //funcion que recibe el componente Uploader donde retorna los archivos a subir.
    const getArchivos = async archivos => {
    
        const base64 = await getBase64(archivos[0]);
        setFormulario({
            ...formulario,
            imagen: base64
        })

    }

    return ( 
        <Container>
            <Form>
                <Form.Group as={Row}>
                    <Col xs="auto">
                        <Image 
                            src={formulario.imagen.trim() === '' ? '/static/no-image.png' : formulario.imagen.trim()} 
                            style={{width: 150}}
                            thumbnail
                        />
                    </Col>    
                    <Col>
                        <Uploader 
                            titulo={"HAZ CLICK O ARRASTRA Y SUELTA UNA IMAGEN"}
                            getArchivos={getArchivos}
                        />
                    </Col>
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
                <Row className="justify-content-center">
                    <Col className="mb-3 mb-sm-0" xs={12} sm={"auto"}>
                        {materia_modificar
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
                            disabled={!materia_modificar}
                            size="lg"
                            className="btn-block"
                            onClick={() => {
                                router.push({
                                    pathname: '/administrar/unidades',
                                    query: { materia: formulario.codigo },
                                })
                            }}
                        >+ Agregar Unidades</Button>
                    </Col>
                    <Col>
                    <Button 
                        variant="info"
                        size="lg"
                        onClick={handleClickVolver}
                    >Volver</Button>
                </Col>
                </Row>
            </Form>
        </Container> );
}
 
export default MateriaForm;