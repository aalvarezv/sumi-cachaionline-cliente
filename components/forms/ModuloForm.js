import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import { Container, Form, Button, Row, Col } from 'react-bootstrap'
import { handleError } from '../../helpers'
import  clienteAxios from '../../config/axios'
import InputSelectUnidadesMateria from '../ui/InputSelectUnidadesMateria'
import InputSelectMateria from '../ui/InputSelectMateria'

const ModuloForm = ({moduloEnProceso, setModuloEnProceso}) => {

    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        codigo_unidad: '0',
        inactivo: false
    })
    const [codigo_materia, setCodigoMateria] = useState('0')

    useEffect(() => {
        
        //cuando se selecciona o cambia el result_select
        if(moduloEnProceso){

            setCodigoMateria(moduloEnProceso.unidad.codigo_materia)

            setFormulario({
                codigo: moduloEnProceso.codigo,
                descripcion: moduloEnProceso.descripcion,
                codigo_unidad: moduloEnProceso.codigo_unidad,
                inactivo: moduloEnProceso.inactivo
            })

        }else{
            reseteaFormulario()
        }
    }, [moduloEnProceso])


    const validarFormulario = () => {
        
        //valida la unidad.
        if(formulario.codigo_unidad.trim() === '' || formulario.codigo_unidad.trim() === '0'){
            toast.error('Seleccione unidad', {containerId: 'sys_msg'})
            return false
        }

        //valida la descripcion.
        if(formulario.descripcion.trim() === ''){
            toast.error('Ingrese descripción', {containerId: 'sys_msg'})
            return false
        }

        return true

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
           if(!validarFormulario()) return
            //modulo a enviar
            let modulo = {
                ...formulario,
                codigo : uuidv4(),
            }

            const resp = await clienteAxios.post('/api/modulos/crear', modulo)

            setModuloEnProceso({
                ...modulo,
                unidad: {
                    codigo_materia
                }
            })
            toast.success('Módulo creado', {containerId: 'sys_msg'})
 
        }catch(e){
             handleError(e)
        }
     
    }

    const handleClickActualizar = async e => {
        
        try{
           
            if(!validarFormulario()) return
            //modulo a enviar
            let modulo = formulario

            await clienteAxios.put('/api/modulos/actualizar', modulo)
            //respuesta del usuario recibido.
            toast.success('Módulo actualizado', {containerId: 'sys_msg'})
 
        }catch(e){
             handleError(e)
        }
    }

    return ( 
    <Container>
        <Form className="p-3">
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
                    {moduloEnProceso
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
 
export default ModuloForm