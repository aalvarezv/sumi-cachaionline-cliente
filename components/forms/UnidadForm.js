import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import { Container, Form, Button, Row, Col, Tab, Tabs } from 'react-bootstrap'
import {handleError } from '../../helpers'
import  clienteAxios from '../../config/axios'
import InputSelectMateria from '../ui/InputSelectMateria'
import TablePreguntasInscritasRing from '../ui/TablePreguntasInscritasRing'
import TabConfigRing from '../ui/TabConfigRing'




const UnidadForm = ({unidadEnProceso, setUnidadEnProceso}) => {

    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        codigo_materia: '0',
        inactivo: false
    })

    useEffect(() => {
        
        if(unidadEnProceso){
            setFormulario({
                codigo: unidadEnProceso.codigo,
                descripcion: unidadEnProceso.descripcion,
                codigo_materia: unidadEnProceso.codigo_materia,
                inactivo: unidadEnProceso.inactivo
            })
        }else{
            reseteaFormulario()
        }

    }, [unidadEnProceso])

    const validarFormulario = () => {
        
        if(formulario.codigo_materia.trim() === '' || formulario.codigo_materia.trim() === '0'){
            toast.error('Seleccione materia', {containerId: 'sys_msg'})
            return false
        }

        if(formulario.descripcion.trim() === ''){
            toast.error('Ingrese descripción', {containerId: 'sys_msg'})
            return false
        }

        return true

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
            //valida el formulario
            if(!validarFormulario()) return
            //Unidad a enviar
            let unidad = {
                ...formulario,
                codigo : uuidv4(),
            }

            await clienteAxios.post('/api/unidades/crear', unidad)
            setUnidadEnProceso(unidad)
            toast.success('Unidad creada', {containerId: 'sys_msg'})
        
        }catch(e){
            handleError(e)
        }                                                
    }

    const handleClickActualizar = async e => {
        
        try{

            if(!validarFormulario()) return
            let unidad = formulario
            await clienteAxios.put('/api/unidades/actualizar', unidad)
            toast.success('Unidad actualizada', {containerId: 'sys_msg'})

        }catch(e){
            handleError(e)
        }
    }

    
    return ( 
    <Container>
        <Form>
            <TabConfigRing/>
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
                />
            </Form.Group>
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
                        [e.target.name]: e.target.value
                    })} 
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
                    {unidadEnProceso
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
    </Container> )
}
 
export default UnidadForm