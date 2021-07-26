import React, { useContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import { Container, Form, Button, Row, Col } from 'react-bootstrap'
import {handleError } from '../../helpers'
import  clienteAxios from '../../config/axios'
import InputSelectNivelAcademico from '../ui/InputSelectNivelAcademico'
import AuthContext from '../../context/auth/AuthContext'

const CursoForm = ({cursoEnProceso, setCursoEnProceso}) => {

    const { institucion_select } = useContext(AuthContext)

    const [formulario, setFormulario] = useState({
        codigo: '',
        letra: '',
        codigo_institucion: institucion_select.codigo,
        codigo_nivel_academico: '0',
        inactivo: false
    })
    
    useEffect(() => {

        if(cursoEnProceso){
            setFormulario({
                codigo: cursoEnProceso.codigo,
                letra: cursoEnProceso.letra,
                codigo_institucion: cursoEnProceso.codigo_institucion,
                codigo_nivel_academico: cursoEnProceso.codigo_nivel_academico,
                inactivo: cursoEnProceso.inactivo
            })
        }else{
            reseteaFormulario()
        }

    }, [cursoEnProceso])

   
    const validarFormulario = () => {
        
        if(formulario.codigo_nivel_academico.trim() === '' || formulario.codigo_nivel_academico.trim() === '0'){
            toast.error('Seleccione nivel academico', {containerId: 'sys_msg'})
            return false
        }
        
        if(formulario.letra.trim() === ''){
            toast.error('Ingrese Letra', {containerId: 'sys_msg'})
            return false
        }

        return true

    }

    const reseteaFormulario = () => {
        setFormulario({
            codigo: '',
            letra: '',
            codigo_institucion: institucion_select.codigo,
            codigo_nivel_academico: '0',
            inactivo: false
        })
    }

    const handleClickCrear = async e => {
        
        try{
            //valida el formulario
            if(!validarFormulario()) return
            //curso a enviar
            let curso = {
                ...formulario,
                codigo : uuidv4(),
            }

            await clienteAxios.post('/api/cursos/crear', curso)

            setCursoEnProceso(curso)

            toast.success('Curso creado', {containerId: 'sys_msg'})
        
        }catch(e){
            handleError(e)
        }                                                
    }

    const handleClickActualizar = async e => {
        
        try{
            if(!validarFormulario()) return

            let curso = formulario
            await clienteAxios.put('/api/cursos/actualizar', curso)
            toast.success('Curso actualizado', {containerId: 'sys_msg'})
        }catch(e){
            handleError(e)
        }
    }
   
    return ( 
    <Container>
        <Form>
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
                        />
                    </Form.Group>
                </Col>
                <Col sm={"auto"}>
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
                    {cursoEnProceso
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
 
export default CursoForm