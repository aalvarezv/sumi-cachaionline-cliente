import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import ToastMultiline from '../ui/ToastMultiline'
import { Container, Form, Button, Image, Row, Col } from 'react-bootstrap'
import {handleError, getBase64, emailValido } from '../../helpers'
import  clienteAxios from '../../config/axios'
import Uploader from '../ui/Uploader'


const InstitucionForm = ({institucion_modificar, handleClickVolver}) => {

    const router = useRouter()
    const [institucionValida, setInstitucionValida] = useState(false)
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

    const [errores, setErrores] = useState({})
   
    useEffect(() => {

        if(institucion_modificar){
            setFormulario({
                codigo: institucion_modificar.codigo,
                descripcion: institucion_modificar.descripcion,
                direccion: institucion_modificar.direccion,
                email: institucion_modificar.email,
                telefono: institucion_modificar.telefono,
                website: institucion_modificar.website,
                logo: institucion_modificar.logo,
                inactivo: institucion_modificar.inactivo
            })
            setInstitucionValida(true)
        }else{
            reseteaFormulario()
            setInstitucionValida(false)
        }
        setErrores({})

    }, [institucion_modificar])

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

        if(formulario.direccion.trim() === ''){
            errors = {
                ...errors,
                direccion: 'Requerido'
            }
        }

        if(formulario.email.trim() === ''){
            errors = {
                ...errors,
                email: 'Requerido'
            }
        }else{
            if(!emailValido(formulario.email)){
                errors = {
                    ...errors,
                    email: 'No es un email válido'
                }
            }
        }
    
        if(formulario.telefono === ''){
            errors = {
                ...errors,
                telefono: 'Requerido'
            }
        }
       
        setErrores(errors)

        return errors

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
            //previne el envío
            e.preventDefault()
            //valida el formulario
            const errors = validarFormulario()
            //verifica que no hayan errores
            if(Object.keys(errors).length > 0){
                return
            }
            //Institucion a enviar
            const resp = await clienteAxios.post('/api/instituciones/crear', formulario)
            setFormulario(resp.data.institucion)
            setInstitucionValida(true)
            toast.success(<ToastMultiline mensajes={[{msg: 'INSTITUCIÓN CREADA'}]}/>, {containerId: 'sys_msg'})
        
        }catch(e){
            setInstitucionValida(false)
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
            await clienteAxios.put('/api/instituciones/actualizar', formulario)
            toast.success(<ToastMultiline mensajes={[{msg: 'INSTITUCIÓN ACTUALIZADA'}]}/>, {containerId: 'sys_msg'})

        }catch(e){
            handleError(e)
        }
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
                        disabled={institucion_modificar}
                        isInvalid={errores.hasOwnProperty('codigo')}
                        onBlur={validarFormulario}
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
                                [e.target.name]: e.target.value.toUpperCase()
                            })
                        }}
                        isInvalid={errores.hasOwnProperty('descripcion')}
                        onBlur={validarFormulario}
                    />
                </Col>
                <Col className="d-flex order-1 order-md-2 my-3 my-md-0">
                    <Image 
                        src={formulario.logo.trim() === '' ? '/static/no-image.png' : formulario.logo.trim()} 
                        style={{width: 150}}
                        thumbnail
                    />
                    <Uploader 
                        titulo={"HAZ CLICK O ARRASTRA Y SUELTA UNA IMAGEN"}
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
                                [e.target.name]: e.target.value.toUpperCase()
                            })
                        }}
                        isInvalid={errores.hasOwnProperty('direccion')}
                        onBlur={validarFormulario}
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
                        isInvalid={errores.hasOwnProperty('email')}
                        onBlur={validarFormulario}
                    />
                </Col>
                <Col xs={12} sm={4}>
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                        id="telefono"
                        name="telefono"
                        type="number" 
                        placeholder="TELÉFONO" 
                        value={formulario.telefono}
                        onChange={e => {setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value.toUpperCase()
                            })
                        }}
                        isInvalid={errores.hasOwnProperty('telefono')}
                        onBlur={validarFormulario}
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
                        isInvalid={errores.hasOwnProperty('website')}
                        onBlur={validarFormulario}
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
                    {institucionValida
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
                <Col className="mb-2 mb-sm-0" xs={12} sm={"auto"}>
                    <Button 
                        variant="success"
                        size="lg"
                        className="btn-block"
                        disabled={!institucionValida}
                        onClick={() => {
                            router.push({
                                pathname: '/administrar/cursos',
                            })
                        }}
                    >+Administrar Cursos</Button>
                </Col>
                <Col xs={12} sm={"auto"}>
                    <Button 
                        variant="info"
                        size="lg"
                        className="btn-block"
                        onClick={handleClickVolver}
                    >Volver</Button>
                </Col>
            </Row>
        </Form>
        </Container> 
    )
}
 
export default InstitucionForm