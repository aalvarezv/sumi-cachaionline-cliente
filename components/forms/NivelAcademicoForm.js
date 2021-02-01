import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import ToastMultiline from '../ui/ToastMultiline'
import { Container, Form, Button, Row, Col } from 'react-bootstrap'
import {handleError } from '../../helpers'
import  clienteAxios from '../../config/axios'

const NivelAcademicoForm = ({nivelacademico_modificar, handleClickVolver}) => {

    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        nivel: '',
        inactivo: false
    })

    const [errores, setErrores] = useState({})

    useEffect(() => {

        if(nivelacademico_modificar){
            setFormulario({
                codigo: nivelacademico_modificar.codigo,
                descripcion: nivelacademico_modificar.descripcion,
                nivel: nivelacademico_modificar.nivel,
                inactivo: nivelacademico_modificar.inactivo
            })
        }else{
            reseteaFormulario()
        }
        setErrores({})

    }, [nivelacademico_modificar])

    const validarFormulario = () => {
        
        let errors = {}

        if(formulario.descripcion.trim() === ''){
            errors = {
                ...errors,
                descripcion: 'Requerido'
            }
        }

        if(Number(formulario.nivel) === 0){
            errors = {
                ...errors,
                nivel: 'Requerido'
            }
        }

        setErrores(errors)

        return errors

    }

    const reseteaFormulario = () => {
        setFormulario({
            codigo: '',
            descripcion: '',
            nivel: '',
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
            let nivelacademico = {
                ...formulario,
                codigo : uuidv4(),
            }

            const resp = await clienteAxios.post('/api/nivel-academico/crear', nivelacademico)
            
            nivelacademico = resp.data
            reseteaFormulario()
            toast.success(<ToastMultiline mensajes={[{msg: 'NIVEL ACADEMICO CREADO'}]}/>, {containerId: 'sys_msg'})
        
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
            let nivelacademico = formulario
            await clienteAxios.put('/api/nivel-academico/actualizar', nivelacademico)
            toast.success(<ToastMultiline mensajes={[{msg: 'NIVEL ACADÉMICO ACTUALIZADO'}]}/>, {containerId: 'sys_msg'})
        }catch(e){
            handleError(e)
        }
    }

    return ( 
        <Container>
        <Form>
            <Form.Group>
                 <Form.Label>Descripcion</Form.Label>
                 <Form.Control
                     id="descripcion"
                     name="descripcion"
                     type="text" 
                     placeholder="DESCRIPCIÓN" 
                     value={formulario.descripcion}
                     onChange={e => {setFormulario({
                             ...formulario,
                            [e.target.name]: e.target.value.toUpperCase()
                         })
                     }}
                     isInvalid={errores.hasOwnProperty('descripcion')}
                     onBlur={validarFormulario}
                 />
             </Form.Group>
             <Form.Group>
                 <Form.Label>Nivel Numérico</Form.Label>
                 <Form.Control
                     id="nivel"
                     name="nivel"
                     type="number" 
                     placeholder="NIVEL NUMÉRICO" 
                     value={formulario.nivel}
                     onChange={e => {
                        //si es número ó es vacío.
                        if (Number(e.target.value) || e.target.value === '') {
                            setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value
                            })
                        }
                     }}
                     isInvalid={errores.hasOwnProperty('nivel')}
                     onBlur={validarFormulario}
                 />
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
            
            <Row className="justify-content-center">
                <Col className="mb-3 mb-sm-0" xs={12} sm={"auto"}>
                    {nivelacademico_modificar
                    ?
                        <Button 
                            variant="outline-info"
                            size="lg"
                            className="btn-block"
                            onClick={handleClickActualizar}
                    >   Actualizar</Button>
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
 
export default NivelAcademicoForm