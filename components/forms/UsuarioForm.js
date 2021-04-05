import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Container, Form, Button, Image, Row, Col, Tab, Tabs } from 'react-bootstrap'
import { rutEsValido, rutFormat, handleError, getBase64 } from '../../helpers'
import  clienteAxios from '../../config/axios'
import ToastMultiline from '../ui/ToastMultiline'
import Uploader from '../ui/Uploader'
import UsuarioFormTabConfig from './UsuarioFormTabConfig'

const UsuarioForm = ({usuario_modificar, handleClickVolver}) => {

    const [usuarioValido, setUsuarioValido] = useState(false)
    const [formulario, setFormulario] = useState({
        rut: '',
        nombre: '',
        clave: '',
        clave_confirm: '',
        email: '',
        telefono: '',
        imagen: '',
        inactivo: true
    })
    const [tab_key, setTabKey] = useState("tab_perfil")

    //1.- definir la variable que almacena los errores.
    const [errores, setErrores] = useState({})

    //cuando cambia el filtro de búsqueda.
    useEffect(() => {

        //cuando se selecciona o cambia el result_select
        if(usuario_modificar){

            setFormulario({
                rut: rutFormat(usuario_modificar.rut),
                nombre: usuario_modificar.nombre,
                clave: usuario_modificar.clave,
                clave_confirm: usuario_modificar.clave,
                email: usuario_modificar.email,
                telefono: usuario_modificar.telefono,
                imagen: usuario_modificar.imagen,
                inactivo: usuario_modificar.inactivo
            })
            setUsuarioValido(true)
        }else{
            setUsuarioValido(false)
            reseteaFormulario()
        }
        setErrores({})

    }, [usuario_modificar])

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

        setErrores(errors)

        return errors
    }

    const reseteaFormulario = () => {
        setFormulario({
            rut: '',
            nombre: '',
            clave: '',
            clave_confirm: '',
            email: '',
            telefono: '',
            imagen: '',
            inactivo: false
        })
        setTabKey('tab_perfil')
    }

    const handleClickCrear = async e => {
        
       try{
            //previne el envío
            e.preventDefault()
            //valida el formulario
            const errors = validarFormulario()
            //verifica que no hayan errores
            if(Object.keys(errors).length > 0){
                return
            }
            //usuario a enviar
            let usuario = {
                ...formulario,
                rut: formulario.rut.replace('-','')
            }
            const resp = await clienteAxios.post('/api/usuarios/crear', usuario)
            setUsuarioValido(true)
            //respuesta del usuario recibido.
            toast.success(<ToastMultiline mensajes={[{msg: 'USUARIO CREADO'}]}/>, {containerId: 'sys_msg'})

       }catch(e){
            setUsuarioValido(false)
            handleError(e)
       }
    }

    const handleClickActualizar = async e => {
        
        try{
            e.preventDefault()
            //valida el formulario
            const errors = validarFormulario()
            //verifica que no hayan errores
            if(Object.keys(errors).length > 0){
                return
            }
            //usuario a enviar
            let usuario = {
                ...formulario,
                rut: formulario.rut.replace('-','')
            }

            await clienteAxios.put('/api/usuarios/actualizar', usuario)
            //respuesta del usuario recibido.
            toast.success(<ToastMultiline mensajes={[{msg: 'USUARIO ACTUALIZADO'}]}/>, {containerId: 'sys_msg'})
 
        }catch(e){
             handleError(e)
        }
    }

    //funcion que recibe el componente Uploader donde retorna los archivos a subir.
    const getArchivos = async archivos => {

        const base64 = await getBase64(archivos[0])
        setFormulario({
            ...formulario,
            imagen: base64
        })

    }

    return ( 
    <Container>
        <Tabs 
            id="tab_usuario"
            activeKey={tab_key}
            onSelect={(k) => setTabKey(k)}
        >
        <Tab eventKey="tab_perfil" title="Información del Usuario">
        <Form className="p-3">
            <Row className="d-flex mb-2">
                <Col sm={12} md={5} lg={7} className="order-2 order-md-1">
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
                        readOnly={usuario_modificar}
                        isInvalid={errores.hasOwnProperty('rut')}
                        onBlur={validarFormulario}
                    />                
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
                </Col>
                <Col className="d-flex order-1 order-md-2 my-3 my-md-0">
                    <Image 
                        src={formulario.imagen.trim() === '' ? '/static/no-image.png' : formulario.imagen.trim()} 
                        style={{width: 150}}
                        thumbnail
                    />       
                    <Uploader 
                        titulo={"HAZ CLICK O ARRASTRA Y SUELTA UNA IMAGEN"}
                        getArchivos={getArchivos}
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
                            placeholder="tu.email@email.com"
                            //autoComplete="off"
                            value={formulario.email}
                            onChange={e => setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value.toLowerCase()
                            })}
                            isInvalid={errores.hasOwnProperty('email')}
                            onBlur={validarFormulario}
                        />
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
                    {usuarioValido
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
                        variant="info"
                        size="lg"
                        className="btn-block"
                        onClick={handleClickVolver}
                    >Volver</Button>
                </Col>
            </Row>
       </Form>
       </Tab>
       {usuarioValido &&
            <Tab eventKey="tab_configuracion" title="Configurar Perfiles y Cursos">
                <Row>
                    <Col>
                        <UsuarioFormTabConfig
                            rut_usuario = {formulario.rut.replace('-','')}
                            nombre_usuario = {formulario.nombre}
                            handleClickVolver={handleClickVolver}
                        />
                    </Col>
                </Row>
            </Tab> 
        }    
       </Tabs>
    </Container> )
}
 
export default UsuarioForm