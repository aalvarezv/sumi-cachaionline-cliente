import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import ToastMultiline from '../ui/ToastMultiline'
import { Container, Form, Button, Row, Col } from 'react-bootstrap'
import {handleError } from '../../helpers'
import  clienteAxios from '../../config/axios'
import InputSelectMateria from '../ui/InputSelectMateria'


const UnidadForm = ({unidad_modificar, handleClickVolver}) => {

    const router = useRouter()
    const [unidadValida, setUnidadValida] = useState(false)
    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        codigo_materia: '0',
        inactivo: false
    })
    
    const [errores, setErrores] = useState({})

    useEffect(() => {
        
        if(unidad_modificar){
            setFormulario({
                codigo: unidad_modificar.codigo,
                descripcion: unidad_modificar.descripcion,
                codigo_materia: unidad_modificar.codigo_materia,
                inactivo: unidad_modificar.inactivo
            })
            setUnidadValida(true)
        }else{
            reseteaFormulario()
            setUnidadValida(false)
        }
        setErrores({})

    }, [unidad_modificar])

    //carga la materia en el formulario si existe en la url.
    useEffect(() => {
        if(router.query.materia){
            setFormulario({
                ...formulario,
                codigo_materia: router.query.materia
            })
        }
    }, [])

    const validarFormulario = () => {
        
        let errors = {}

        if(formulario.descripcion.trim() === ''){
            errors = {
                ...errors,
                descripcion: 'Requerido'
            }
        }

        if(formulario.codigo_materia.trim() === '' || formulario.codigo_materia.trim() === '0'){
            errors = {
                ...errors,
                codigo_materia: 'Requerido'
            }
        }

        setErrores(errors)

        return errors

    }

    const reseteaFormulario = () => {
        setFormulario({
            codigo: '',
            descripcion: '',
            codigo_materia: '0',
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
            //Unidad a enviar
            let unidad = {
                ...formulario,
                codigo : uuidv4(),
            }

            const resp = await clienteAxios.post('/api/unidades/crear', unidad)
            setUnidadValida(true)
            toast.success(<ToastMultiline mensajes={[{msg: 'UNIDAD CREADA'}]}/>, {containerId: 'sys_msg'})
        
        }catch(e){
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
            let unidad = formulario
            await clienteAxios.put('/api/unidades/actualizar', unidad)
            toast.success(<ToastMultiline mensajes={[{msg: 'UNIDAD ACTUALIZADA'}]}/>, {containerId: 'sys_msg'})
        }catch(e){
            handleError(e)
        }
    }

    return ( 
    <Container>

       <Form>
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
            </Form.Group>
            <Form.Group>
                <Form.Label>Materia</Form.Label>
                <InputSelectMateria
                    id="codigo_materia"
                    name="codigo_materia"
                    as="select"
                    value={formulario.codigo_materia}
                    onChange={e => setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.value
                    })}
                    isInvalid={errores.hasOwnProperty('codigo_materia')}
                    onBlur={validarFormulario}
                    disabled={router.query.materia}
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
                    {unidad_modificar
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
                        disabled={!unidadValida}
                        size="lg"
                        className="btn-block"
                        onClick={() => {
                            router.push({
                                pathname: '/administrar/modulos',
                                query: { 
                                    materia: formulario.codigo_materia,
                                    unidad: formulario.codigo
                                },
                            })
                        }}
                    >+ Agregar Módulos</Button>
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
    </Container> )
}
 
export default UnidadForm