import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Container, Form, Button, Image, Row, Col } from 'react-bootstrap'
import { rutEsValido, rutFormat, handleError, getBase64 } from '../../helpers'
import  clienteAxios from '../../config/axios'
import Uploader from '../ui/Uploader'
import { TiDelete } from 'react-icons/ti'


const UsuarioForm = ({ usuarioEnProceso, setUsuarioEnProceso }) => {

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

    //cuando cambia el filtro de búsqueda.
    useEffect(() => {

        //cuando se selecciona o cambia el result_select
        if(usuarioEnProceso){

            setFormulario({
                rut: rutFormat(usuarioEnProceso.rut),
                nombre: usuarioEnProceso.nombre,
                clave: usuarioEnProceso.clave,
                clave_confirm: usuarioEnProceso.clave,
                email: usuarioEnProceso.email,
                telefono: usuarioEnProceso.telefono,
                imagen: usuarioEnProceso.imagen,
                inactivo: usuarioEnProceso.inactivo
            })

        }else{
            reseteaFormulario()
        }

    }, [usuarioEnProceso])

    const validarFormulario = () => {

        //valida el rut.
        if(formulario.rut.trim() === ''){
            toast.error('Ingrese RUT', {containerId: 'sys_msg'})
            return false
        }else if(!rutEsValido(formulario.rut)){
            toast.error('No es un RUT válido', {containerId: 'sys_msg'})
            return false
        }
        //valida el nombre.
        if(formulario.nombre.trim() === ''){
            toast.error('Ingrese nombre', {containerId: 'sys_msg'})
            return false
        }
        //valida la clave
        if(formulario.clave.trim() === ''){
            toast.error('Ingrese clave', {containerId: 'sys_msg'})
            return false
        }

        //valida la confirmación de clave
        if(formulario.clave_confirm.trim() === ''){
            toast.error('Confirme clave', {containerId: 'sys_msg'})
            return false
        }
        //valida que la clave y su confirmación sea válida.
        if(formulario.clave_confirm.trim() !== formulario.clave.trim()){
            toast.error('Confirmación no coincide con la clave', {containerId: 'sys_msg'})
            return false
        }

        //valida el email
        if(formulario.email.trim() === ''){
            toast.error('Ingrese email', {containerId: 'sys_msg'})
            return false
        }else if( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formulario.email) ) {
            toast.error('No es un email válido', {containerId: 'sys_msg'})
            return false
        }

        return true

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
    }

    const handleClickCrear = async e => {
        
       try{
            //valida el formulario
            if(!validarFormulario()) return
            //usuario a enviar
            let usuario = {
                ...formulario,
                rut: formulario.rut.replace('-','')
            }
            await clienteAxios.post('/api/usuarios/crear', usuario)
            setUsuarioEnProceso(usuario)
            //respuesta del usuario recibido.
            toast.success('Usuario creado', {containerId: 'sys_msg'})

       }catch(e){
            handleError(e)
       }
    }

    const handleClickActualizar = async e => {
        
        try{
            //valida el formulario
            if(!validarFormulario()) return
            //usuario a enviar
            let usuario = {
                ...formulario,
                rut: formulario.rut.replace('-','')
            }

            await clienteAxios.put('/api/usuarios/actualizar', usuario)
            //respuesta del usuario recibido.
            toast.success('Usuario actualizado', {containerId: 'sys_msg'})
 
        }catch(e){
             handleError(e)
        }
    }

    const handleBlurUsuario = async e => {

        let rut = e.target.value.replace('-','')

        try {
            
            const resp = await clienteAxios.get(`/api/usuarios/datos/${rut}`)
            const { usuario } = resp.data

            if(usuario){
                setUsuarioEnProceso({
                    rut: usuario.rut,
                    nombre: usuario.nombre,
                    clave: usuario.clave,
                    clave_confirm: usuario.clave,
                    email: usuario.email,
                    telefono: usuario.telefono,
                    imagen: usuario.imagen,
                    inactivo: usuario.inactivo
                })
    
            }

        } catch (e) {
            handleError(e)
        }

    }

    const handleQuitarImagenUsuario = () => {
        setFormulario({
            ...formulario,
            imagen: ''
        })

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
            <Form className="p-3">
                <Row className="d-flex mb-2">
                    <Col sm={12} md={5} lg={7} className="order-2 order-md-1">
                        <Form.Label>RUT</Form.Label>
                        <Form.Control 
                            id="rut"
                            name="rut"
                            type="text" 
                            placeholder="RUT" 
                            autoComplete="off"
                            value={formulario.rut}
                            onChange={e => {
                                setFormulario({
                                ...formulario,
                                [e.target.name]: rutFormat(e.target.value.toUpperCase()),
                            })}}
                            onBlur={handleBlurUsuario}
                            readOnly={usuarioEnProceso}
                        />                
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            id="nombre"
                            name="nombre"
                            type="text" 
                            placeholder="NOMBRE COMPLETO" 
                            autoComplete="off"
                            value={formulario.nombre}
                            onChange={e => setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value
                            })}
                        />
                    </Col>
                    <Col className="d-flex order-1 order-md-2 my-3 my-md-0">
                            
                        <div
                            className="d-flex"
                            style={{position:"relative", minWidth:150}}
                        >
                            <Image 
                                src={formulario.imagen.trim() === '' ? '/static/no-image.png' : formulario.imagen.trim()} 
                                style={{width: 150}}
                                thumbnail
                            /> 
                            
                            {formulario.imagen.trim() !== '' &&
                                <span
                                    onClick={handleQuitarImagenUsuario}
                                    style={{
                                        position: 'absolute', 
                                        top: -16, 
                                        right: -13,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <TiDelete 
                                        size={"1.5rem"} 
                                        color={"red"}
                                    />
                                </span>
                            }
                        </div>
                              
                        <Uploader 
                            titulo={"HAZ CLICK O ARRASTRA Y SUELTA UNA IMAGEN"}
                            formatosValidos={["image/*"]}
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
                                autoComplete="off"
                                value={formulario.email}
                                onChange={e => setFormulario({
                                    ...formulario,
                                    [e.target.name]: e.target.value.toLowerCase()
                                })}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Group>
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control 
                                id="telefono"
                                name="telefono"
                                type="text" 
                                maxLength={9}
                                placeholder="TELÉFONO"
                                autoComplete="off"
                                value={formulario.telefono}
                                onChange={e => {
                                    if (e.target.value === '' || /^[0-9\b]+$/.test(e.target.value)) {
                                        setFormulario({
                                            ...formulario,
                                            [e.target.name]: e.target.value
                                        })
                                    }
                                }}
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
                        {usuarioEnProceso
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
                </Row>
            </Form>
        </Container> 
    )

}
 
export default UsuarioForm