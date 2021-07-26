import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import ToastMultiline from '../ui/ToastMultiline'
import { Container, Form, Button, Row, Col } from 'react-bootstrap'
import {handleError } from '../../helpers'
import  clienteAxios from '../../config/axios'

const NivelAcademicoForm = ({nivelAcademicoEnProceso, setNivelAcademicoEnProceso}) => {

    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        nivel: '',
        inactivo: false
    })

    useEffect(() => {

        if(nivelAcademicoEnProceso){
            setFormulario({
                codigo: nivelAcademicoEnProceso.codigo,
                descripcion: nivelAcademicoEnProceso.descripcion,
                nivel: nivelAcademicoEnProceso.nivel,
                inactivo: nivelAcademicoEnProceso.inactivo
            })
        }else{
            reseteaFormulario()
        }

    }, [nivelAcademicoEnProceso])

    const validarFormulario = () => {
        
        if(formulario.descripcion.trim() === ''){
            toast.error('Ingrese descripción', {containerId: 'sys_msg'})
            return false
        }

        if(Number(formulario.nivel) === 0){
            toast.error('Ingrese número nivel', {containerId: 'sys_msg'})
            return false
        }

        return true

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
            //valida el formulario
            if(!validarFormulario()) return

            //Unidad a enviar
            let nivelacademico = {
                ...formulario,
                codigo : uuidv4(),
            }

            await clienteAxios.post('/api/nivel-academico/crear', nivelacademico)
            setNivelAcademicoEnProceso(nivelacademico)
            toast.success('Nivel académico creado', {containerId: 'sys_msg'})
        
        }catch(e){
            handleError(e)
        }                                                
    }

    const handleClickActualizar = async e => {
        
        try{
            //valida el formulario
            if(!validarFormulario()) return

            let nivelacademico = formulario
            await clienteAxios.put('/api/nivel-academico/actualizar', nivelacademico)

            toast.success('Nivel académico actualizado', {containerId: 'sys_msg'})
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
                            [e.target.name]: e.target.value
                         })
                     }}
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
                    {nivelAcademicoEnProceso
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
            </Row>
        </Form>
        </Container> )
}
 
export default NivelAcademicoForm