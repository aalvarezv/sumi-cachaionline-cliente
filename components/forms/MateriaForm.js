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


const MateriaForm = () => {

    const router = useRouter();
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
        try{
            const resp = await clienteAxios.get(`/api/materias/busqueda/${filtro_busqueda}`);
            setResultBusqueda(resp.data.materias);
        }catch(e){
            handleError(e);
        }
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
             materia.codigo = uuidv4();

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
            <InputSearch
                setFilter={setFiltroBusqueda}
                results={result_busqueda}
                setResultSelect={setResultSelect}
                id="codigo"
                label="nombre"
            />
            <Form>
                <Form.Group as={Row}>
                    <Col>
                        <Image 
                            src={formulario.imagen.trim() === '' ? '/static/no-image.png' : formulario.imagen.trim()} 
                            thumbnail
                        />
                    </Col>    
                    <Col md={9}>
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
                                    pathname: '/administrar/unidades',
                                    query: { materia: formulario.codigo },
                                })
                            }}
                        >+ Agregar Unidades</Button>
                    </Col>
                    <Col xs={12} sm={"auto"}>
                        <ButtonBack />
                    </Col>
                </Row>
            </Form>
        </Container> );
}
 
export default MateriaForm;