import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Container, Form, Button, Image, Row, Col, Tab, Tabs } from 'react-bootstrap';
import { rutEsValido, rutFormat, handleError, getBase64 } from '../../helpers';
import  clienteAxios from '../../config/axios';
import ToastMultiline from '../ui/ToastMultiline';
import InputSearch from '../ui/InputSearch';
import Uploader from '../ui/Uploader';
import ButtonBack from '../ui/ButtonBack';
import UsuarioFormTabConfig from './UsuarioFormTabConfig';

const UsuarioForm = () => {

    const router = useRouter();
    const [filtro_busqueda, setFiltroBusqueda] = useState('');
    const [result_busqueda, setResultBusqueda] = useState([]);
    const [result_select, setResultSelect]     = useState(null);
    const [formulario, setFormulario] = useState({
        rut: '',
        nombre: '',
        clave: '',
        clave_confirm: '',
        email: '',
        telefono: '',
        codigo_rol: '',
        imagen: '',
        inactivo: true
    });
    const [tab_key, setTabKey] = useState("tab_perfil");

    //1.- definir la variable que almacena los errores.
    const [errores, setErrores] = useState({});

    const buscarUsuario = async () => {

        try{
            const resp = await clienteAxios.get(`/api/usuarios/busqueda/${filtro_busqueda}`);
            setResultBusqueda(resp.data.usuarios);
        }catch(e){
            handleError(e);
        }
    }

    //cuando cambia el filtro de búsqueda.
    useEffect(() => {

        //si tengo un filtro de búsqueda y no hay un usuario seleccionado, entonces busca.
        if(filtro_busqueda.trim() !== '' && !result_select){
            buscarUsuario();
        }else{
            setResultBusqueda([]);
        }

        //cuando se selecciona o cambia el result_select
        if(result_select){

            setFormulario({
                rut: rutFormat(result_select.rut),
                nombre: result_select.nombre,
                clave: result_select.clave,
                clave_confirm: result_select.clave,
                email: result_select.email,
                telefono: result_select.telefono,
                codigo_rol: result_select.codigo_rol,
                imagen: result_select.imagen,
                inactivo: result_select.inactivo
            });
   
        }else{
            reseteaFormulario();
        }
        setErrores({});

    }, [filtro_busqueda, result_select]);

    //carga el rol en el formulario si existe en la url.
    useEffect(() => {
        if(router.query.rol){
            setFormulario({
                ...formulario,
                codigo_rol: router.query.rol
            })
        }
    }, []);

    const validarFormulario = () => {
        //setea los errores para que no exista ninguno.
        let errors = {}
        //valida el rut.
        if(formulario.rut.trim() === ''){
            errors = {
                ...errors,
                rut: 'Requerido'
            }
        }else if(!rutEsValido(formulario.rut)){
            errors = {
                ...errors,
                rut: 'No es un RUT válido'
            }
        }
        //valida el nombre.
        if(formulario.nombre.trim() === ''){
            errors = {
                ...errors,
                nombre: 'Requerido'
            }
        }
        //valida la clave
        if(formulario.clave.trim() === ''){
            errors = {
                ...errors,
                clave: 'Requerido'
            }
        }else if (formulario.clave.length < 8){
            errors = {
                ...errors,
                clave: 'Debe contener al menos 8 caracteres'
            }
        }

        //valida la confirmación de clave
        if(formulario.clave_confirm.trim() === ''){
            errors = {
                ...errors,
                clave_confirm: 'Requerido'
            }
        }
        //valida que la clave y su confirmación sea válida.
        if(formulario.clave_confirm.trim() !== formulario.clave.trim()){
            errors = {
                ...errors,
                clave_confirm: 'No es igual a la clave'
            }
        }

        //valida el email
        if(formulario.email.trim() === ''){
            errors = {
                ...errors,
                email: 'Requerido'
            }
        }else if( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formulario.email) ) {
            errors = {
                ...errors,
                email: 'No es un email válido'
            }
        }

        setErrores(errors);

        return errors;
    }

    const reseteaFormulario = () => {
        setFormulario({
            rut: '',
            nombre: '',
            clave: '',
            clave_confirm: '',
            email: '',
            telefono: '',
            codigo_rol: '',
            imagen: '',
            inactivo: false
        });
        setTabKey('tab_perfil');
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
            //usuario a enviar
            let usuario = {
                ...formulario,
                rut: formulario.rut.replace('-','')
            }
            const resp = await clienteAxios.post('/api/usuarios/crear', usuario);
            //respuesta del usuario recibido.
            usuario = resp.data;
            setResultSelect(usuario);

            toast.success(<ToastMultiline mensajes={[{msg: 'USUARIO CREADO'}]}/>, {containerId: 'sys_msg'});

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
            //usuario a enviar

            let usuario = {
                ...formulario,
                rut: formulario.rut.replace('-','')
            }

            await clienteAxios.put('/api/usuarios/actualizar', usuario);
            //respuesta del usuario recibido.
            toast.success(<ToastMultiline mensajes={[{msg: 'USUARIO ACTUALIZADO'}]}/>, {containerId: 'sys_msg'});
 
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
            id="rut"
            label="nombre"
        />
        <Tabs 
            id="tab_usuario"
            activeKey={tab_key}
            onSelect={(k) => setTabKey(k)}
        >
        <Tab eventKey="tab_perfil" title="Información del Usuario">
        <Form className="p-3">
            <Row>
                <Col sm={12} md={5} lg={7}>
                    <Form.Group>
                        <Form.Label>Rut</Form.Label>
                        <Form.Control 
                            id="rut"
                            name="rut"
                            type="text" 
                            placeholder="RUT" 
                            //autoComplete="off"
                            value={formulario.rut}
                            onChange={e => {
                                setFormulario({
                                ...formulario,
                                [e.target.name]: rutFormat(e.target.value.toUpperCase()),
                            })}}
                            readOnly={result_select}
                            isInvalid={errores.hasOwnProperty('rut')}
                            onBlur={validarFormulario}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.hasOwnProperty('rut') && errores.rut}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group> 
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            id="nombre"
                            name="nombre"
                            type="text" 
                            placeholder="NOMBRE COMPLETO" 
                            //autoComplete="off"
                            value={formulario.nombre}
                            onChange={e => setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value.toUpperCase()
                            })}
                            isInvalid={errores.hasOwnProperty('nombre')}
                            onBlur={validarFormulario}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.hasOwnProperty('nombre') && errores.nombre}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col className="pb-3">
                    <Uploader 
                        titulo={"HAZ CLICK O ARRASTRA Y SUELTA UNA IMAGEN"}
                        getArchivos={getArchivos}
                    /> 
                </Col>
                <Col className="pb-3">
                    <Image 
                        src={formulario.imagen.trim() === '' ? '/static/no-image.png' : formulario.imagen.trim()} 
                        thumbnail
                    />       
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={6}>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            id="email"
                            name="email"
                            type="email" 
                            placeholder="TU.EMAIL@EJEMPLO.COM"
                            //autoComplete="off"
                            value={formulario.email}
                            onChange={e => setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value.toUpperCase()
                            })}
                            isInvalid={errores.hasOwnProperty('email')}
                            onBlur={validarFormulario}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.hasOwnProperty('email') && errores.email}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Group>
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control 
                            id="telefono"
                            name="telefono"
                            type="tel" 
                            placeholder="(+56) 9 4567 8323"
                            //autoComplete="off"
                            value={formulario.telefono}
                            onChange={e => setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value,
                            })}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={6}>
                    <Form.Group>
                        <Form.Label>Clave</Form.Label>
                        <Form.Control
                            id="clave"
                            name="clave"
                            type="password" 
                            placeholder="CLAVE" 
                            value={formulario.clave}
                            onChange={e => setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value,
                            })}
                            isInvalid={errores.hasOwnProperty('clave')}
                            onBlur={validarFormulario}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.hasOwnProperty('clave') && errores.clave}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Group>
                        <Form.Label>Confirmar Clave</Form.Label>
                        <Form.Control
                            id="clave_confirm"
                            name="clave_confirm"
                            type="password" 
                            placeholder="CONFIRMAR CLAVE" 
                            value={formulario.clave_confirm}
                            onChange={e => setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value,
                            })}
                            isInvalid={errores.hasOwnProperty('clave_confirm')}
                            onBlur={validarFormulario}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.hasOwnProperty('clave_confirm') && errores.clave_confirm}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
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
                <Col xs={12} sm={"auto"}>
                    <ButtonBack />
                </Col>
            </Row>
       </Form>
       </Tab>
       {result_select &&
            <Tab eventKey="tab_configuracion" title="Configuración">
                <UsuarioFormTabConfig
                    rut_usuario = {result_select.rut}
                />
            </Tab> 
        }    
       </Tabs>
    </Container> );
}
 
export default UsuarioForm;