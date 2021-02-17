import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import { Container, Form, Card, Button, Row, Col } from 'react-bootstrap'
import {handleError } from '../../helpers'
import  clienteAxios from '../../config/axios'
import ToastMultiline from '../ui/ToastMultiline'
import InputSelectNivelAcademico from '../ui/InputSelectNivelAcademico'
import InputSelectInstitucion from '../ui/InputSelectInstitucion'

const CursoForm = ({curso_modificar, handleClickVolver}) => {

    const router = useRouter()
    const [cursoValido, setCursoValido] = useState(false)
    const [formulario, setFormulario] = useState({
        codigo: '',
        letra: '',
        codigo_institucion: '0',
        codigo_nivel_academico: '0',
        inactivo: false
    })
    
    const [errores, setErrores] = useState({})

    useEffect(() => {

        if(curso_modificar){
            setFormulario({
                codigo: curso_modificar.codigo,
                letra: curso_modificar.letra,
                codigo_institucion: curso_modificar.codigo_institucion,
                codigo_nivel_academico: curso_modificar.codigo_nivel_academico,
                inactivo: curso_modificar.inactivo
            })
            setCursoValido(true)
        }else{
            reseteaFormulario()
            setCursoValido(false)
        }
        setErrores({})

    }, [curso_modificar])

    //carga la institución en el formulario si existe en la url.
    useEffect(() => {
        if(router.query.institucion){
            setFormulario({
                ...formulario,
                codigo_institucion: router.query.institucion
            })
        }
    }, [])
    
    const validarFormulario = () => {
        
        let errors = {}

        if(formulario.letra.trim() === ''){
            errors = {
                ...errors,
                letra: 'Requerido'
            }
        }
        
        if(formulario.codigo_institucion.trim() === '' || formulario.codigo_institucion.trim() === '0'){
            errors = {
                ...errors,
                codigo_institucion: 'Requerido'
            }
        }

        if(formulario.codigo_nivel_academico.trim() === '' || formulario.codigo_nivel_academico.trim() === '0'){
            errors = {
                ...errors,
                codigo_nivel_academico: 'Requerido'
            }
        }

        setErrores(errors)

        return errors

    }

    const reseteaFormulario = () => {
        setFormulario({
            codigo: '',
            letra: '',
            codigo_institucion: (router.query.institucion ? router.query.institucion : '0'),
            codigo_nivel_academico: '0',
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
            //curso a enviar
            let curso = {
                ...formulario,
                codigo : uuidv4(),
            }

            const resp = await clienteAxios.post('/api/cursos/crear', curso)
            curso = resp.data
            reseteaFormulario()
            toast.success(<ToastMultiline mensajes={[{msg: 'CURSO CREADO'}]}/>, {containerId: 'sys_msg'})
        
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
            let curso = formulario
            await clienteAxios.put('/api/cursos/actualizar', curso)
            toast.success(<ToastMultiline mensajes={[{msg: 'CURSO ACTUALIZADO'}]}/>, {containerId: 'sys_msg'})
        }catch(e){
            handleError(e)
        }
    }

  
   
    return ( 
    <Container>
        <Form>
            <Form.Group>
                <Form.Label>Institución</Form.Label>
                <InputSelectInstitucion
                    id="codigo_institucion"
                    name="codigo_institucion"
                    as="select"
                    value={formulario.codigo_institucion}
                    onChange={e => setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.value
                    })}
                    isInvalid={errores.hasOwnProperty('codigo_institucion')}
                    onBlur={validarFormulario}
                    disabled={router.query.institucion} 
                />
            </Form.Group>
            <Form.Group as={Row}>
                <Col sm={8}>
                    <Form.Group>
                        <Form.Label>Nivel Academico</Form.Label>
                        <InputSelectNivelAcademico
                            id="codigo_nivel_academico"
                            name="codigo_nivel_academico"
                            as="select"
                            value={formulario.codigo_nivel_academico}
                            onChange={e => setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value
                            })}
                            isInvalid={errores.hasOwnProperty('codigo_nivel_academico')}
                            onBlur={validarFormulario}
                        />
                    </Form.Group>
                </Col>
                <Col sm={4}>
                    <Form.Group>
                        <Form.Label>Letra</Form.Label>
                        <Form.Control
                            id="letra"
                            name="letra"
                            type="text" 
                            placeholder="LETRA"
                            value={formulario.letra}
                            onChange={e => setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value.toUpperCase()
                            })} 
                            isInvalid={errores.hasOwnProperty('letra')}
                            onBlur={validarFormulario}
                        />
                    </Form.Group>
                </Col>
            </Form.Group>
            <Row className="mb-3">
                <Col sm={12}>
                    <Form.Check 
                        id="inactivo"
                        name="inactivo"
                        type="checkbox"
                        label="Inactivo"
                        checked={formulario.inactivo}
                        onChange={e => setFormulario({
                            ...formulario,
                            [e.target.name]: e.target.checked,
                        })}
                    />
                </Col>
            </Row>
            <Row className="justify-content-start">
                <Col className="mb-3 mb-sm-0 " xs={12} sm={"auto"}>
                    {curso_modificar
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
    </Container>
  
    )
}
 
export default CursoForm