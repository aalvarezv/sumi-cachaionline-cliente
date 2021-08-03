import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import ToastMultiline from '../ui/ToastMultiline'
import { Container, Form, Button, Image, Row, Col } from 'react-bootstrap'
import {handleError, getBase64, emailValido } from '../../helpers'
import  clienteAxios from '../../config/axios'
import Uploader from '../ui/Uploader'
import { TiDelete } from 'react-icons/ti'


const InstitucionForm = ({institucionEnProceso, setInstitucionEnProceso}) => {

    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        direccion: '',
        email: '',
        telefono: '',
        website: '',
        logo: '',
        inactivo: false
    })

    useEffect(() => {

        if(institucionEnProceso){
            setFormulario({
                codigo: institucionEnProceso.codigo,
                descripcion: institucionEnProceso.descripcion,
                direccion: institucionEnProceso.direccion,
                email: institucionEnProceso.email,
                telefono: institucionEnProceso.telefono,
                website: institucionEnProceso.website,
                logo: institucionEnProceso.logo,
                inactivo: institucionEnProceso.inactivo
            })
        }else{
            reseteaFormulario()
        }

    }, [institucionEnProceso])

    const validarFormulario = () => {
        
        if(formulario.codigo.trim() === ''){
            toast.error('Ingrese código', {containerId: 'sys_msg'})
            return false
        }

        if(formulario.descripcion.trim() === ''){
            toast.error('Ingrese descripción', {containerId: 'sys_msg'})
            return false
        }

        if(formulario.direccion.trim() === ''){
            toast.error('Ingrese dirección', {containerId: 'sys_msg'})
            return false
        }

        if(formulario.email.trim() === ''){
            toast.error('Ingrese email', {containerId: 'sys_msg'})
            return false
        }else{
            if(!emailValido(formulario.email)){
                toast.error('No es un email válido', {containerId: 'sys_msg'})
                return false
            }
        }
           
        return true

    }

    const reseteaFormulario = () => {
        setFormulario({
            codigo: '',
            descripcion: '',
            direccion: '',
            email: '',
            telefono: '',
            website: '',
            logo: '',
            inactivo: false
        })
    }

    const handleClickCrear = async e => {
        
        try{
            //valida el formulario
            if(!validarFormulario()) return
            //Institucion a enviar
            await clienteAxios.post('/api/instituciones/crear', formulario)
            setInstitucionEnProceso(formulario)
            toast.success('Institución creada', {containerId: 'sys_msg'})
        
        }catch(e){
            handleError(e)
        }     

    }

    const handleClickActualizar = async e => {
        
        try{
            if(!validarFormulario()) return
            
            await clienteAxios.put('/api/instituciones/actualizar', formulario)
            toast.success('Institución actualizada', {containerId: 'sys_msg'})

        }catch(e){
            handleError(e)
        }
    }

    const handleQuitarLogoInstitucion = () => {
        setFormulario({
            ...formulario,
            logo: ''
        })

    }

    //funcion que recibe el componente Uploader donde retorna los archivos a subir.
    const getArchivos = async archivos => {
    
        const base64 = await getBase64(archivos[0])
        setFormulario({
            ...formulario,
            logo: base64
        })

    }

    return ( 
        <Container>
        <Form className="mt-3">
            <Row className="d-flex mb-2">
                <Col sm={12} md={5} lg={7} className="order-2 order-md-1">
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
                        disabled={institucionEnProceso}
                    />
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        id="descripcion"
                        name="descripcion"
                        type="text" 
                        placeholder="NOMBRE" 
                        value={formulario.descripcion}
                        onChange={e => {setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value
                            })
                        }}
                    />
                </Col>
                <Col className="d-flex order-1 order-md-2 my-3 my-md-0">
                    <div
                        className="d-flex"
                        style={{position:"relative", minWidth:150}}
                    >
                        <Image 
                            src={formulario.logo.trim() === '' ? '/static/no-image.png' : formulario.logo.trim()} 
                            style={{
                                width: 150,
                                marginRight: 10
                            }}
                            thumbnail
                        />
                        {formulario.logo.trim() !== '' &&
                            <span
                                onClick={handleQuitarLogoInstitucion}
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
            <Form.Group as={Row}>
                <Col xs={12}>
                <Form.Label>Dirección</Form.Label>
                    <Form.Control
                        id="direccion"
                        name="direccion"
                        type="text" 
                        placeholder="DIRECCIÓN" 
                        value={formulario.direccion}
                        onChange={e => {setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value
                            })
                        }}
                    />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Col xs={12} sm={4}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        id="email"
                        name="email"
                        type="email" 
                        placeholder="info@institucion.com" 
                        value={formulario.email}
                        onChange={e => {setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value.toLowerCase()
                            })
                        }}
                    />
                </Col>
                <Col xs={12} sm={4}>
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                        id="telefono"
                        name="telefono"
                        type="text"
                        maxLength={9} 
                        placeholder="TELÉFONO" 
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
                </Col>
                <Col xs={12} sm={4}>
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                        id="website"
                        name="website"
                        type="text" 
                        placeholder="WEBSITE" 
                        value={formulario.website}
                        onChange={e => {setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value.toLowerCase()
                            })
                        }}
                    />
                </Col>
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
                    })
                }}
            />
            
            <Row className="d-flex justify-content-center">
                <Col className="mb-2 mb-sm-0" xs={12} sm={"auto"}>
                    {institucionEnProceso
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
 
export default InstitucionForm