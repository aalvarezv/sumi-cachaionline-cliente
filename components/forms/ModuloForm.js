import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import { Container, Form, Button, Row, Col } from 'react-bootstrap'
import ToastMultiline from '../ui/ToastMultiline'
import { handleError } from '../../helpers'
import  clienteAxios from '../../config/axios'
import InputSelectUnidadesMateria from '../ui/InputSelectUnidadesMateria'
import InputSelectMateria from '../ui/InputSelectMateria'

const ModuloForm = ({modulo_modificar, handleClickVolver}) => {

    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        codigo_unidad: '0',
        inactivo: false
    })
    const [codigo_materia, setCodigoMateria] = useState('0')
    const [errores, setErrores] = useState({})


    useEffect(() => {
        
        //cuando se selecciona o cambia el result_select
        if(modulo_modificar){

            setCodigoMateria(modulo_modificar.unidad.codigo_materia)

            setFormulario({
                codigo: modulo_modificar.codigo,
                descripcion: modulo_modificar.descripcion,
                codigo_unidad: modulo_modificar.codigo_unidad,
                inactivo: modulo_modificar.inactivo
            })

        }else{
            reseteaFormulario()
        }
        setErrores({})

    }, [modulo_modificar])


    const validarFormulario = () => {
        //setea los errores para que no exista ninguno.
        let errors = {}

        //valida la descripcion.
        if(formulario.descripcion.trim() === ''){
            errors = {
                ...errors,
                descripcion: 'Requerido'
            }
        }

        //valida la unidad.
        if(formulario.codigo_unidad.trim() === '' || formulario.codigo_unidad.trim() === '0'){
            errors = {
                ...errors,
                codigo_unidad: 'Requerido'
            }
        }

        setErrores(errors)

        return errors

    }

    const reseteaFormulario = () => {

        setCodigoMateria('0')
        setFormulario({
            codigo: '',
            descripcion: '',
            codigo_unidad: '0',
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
            //modulo a enviar
            let modulo = {
                ...formulario,
                codigo : uuidv4(),
            }

            const resp = await clienteAxios.post('/api/modulos/crear', modulo)
            //respuesta del modulo recibido.
            modulo = resp.data
            reseteaFormulario()
            toast.success(<ToastMultiline mensajes={[{msg: 'MÓDULO CREADO'}]}/>, {containerId: 'sys_msg'})
 
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
            //modulo a enviar
            let modulo = formulario

            await clienteAxios.put('/api/modulos/actualizar', modulo)
            //respuesta del usuario recibido.
            toast.success(<ToastMultiline mensajes={[{msg: 'MÓDULO ACTUALIZADO'}]}/>, {containerId: 'sys_msg'})
 
        }catch(e){
             handleError(e)
        }
    }

    return ( 
    <Container>

        <Form className="p-3">
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
            <Form.Group >
                <Form.Label className="text-muted">Materia</Form.Label>
                <InputSelectMateria
                    id="codigo_materia"
                    name="codigo_materia"
                    as="select"
                    label="TODAS LAS MATERIAS"
                    value={codigo_materia}
                    onChange={e => {
                        setCodigoMateria(e.target.value)
                        setFormulario({
                            ...formulario,
                            codigo_unidad: '0'
                        })
                    }}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Unidad</Form.Label>
                <InputSelectUnidadesMateria
                    id="codigo_unidad"
                    name="codigo_unidad"
                    /*codigo materia se le pasa a las props del componente
                    para filtrar las unidades de la materia seleccionada.*/
                    codigo_materia={codigo_materia}
                    as="select"
                    value={formulario.codigo_unidad}
                    onChange={e => setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.value
                    })}
                
                    isInvalid={errores.hasOwnProperty('codigo_unidad')}
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
                onChange={e => setFormulario({
                    ...formulario,
                    [e.target.name]: e.target.checked,
                })}
            />
            <Row className="justify-content-center">
                <Col className="mb-3 mb-sm-0" xs={12} sm={"auto"}>
                    {modulo_modificar
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
    </Container> )
}
 
export default ModuloForm