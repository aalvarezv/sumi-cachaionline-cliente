import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import { Container, Form, Button, Row, Col } from 'react-bootstrap'
import { handleError } from '../../helpers'
import  clienteAxios from '../../config/axios'
import InputSelectMateria from '../ui/InputSelectMateria'
import InputSelectUnidadesMateria from '../ui/InputSelectUnidadesMateria'
import InputSelectModulosUnidad from '../ui/InputSelectModulosUnidad'

const ContenidoForm = ({contenidoEnProceso, setContenidoEnProceso}) => {

    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        codigo_modulo: '0',
        inactivo: false,
    })
    const [codigo_materia, setCodigoMateria] = useState('0')
    const [codigo_unidad, setCodigoUnidad] = useState('0')

    useEffect(() => {
        
        //cuando se selecciona o cambia el result_select
        if(contenidoEnProceso){

            setCodigoUnidad(contenidoEnProceso.modulo.codigo_unidad)
            setCodigoMateria(contenidoEnProceso.modulo.unidad.codigo_materia)

            setFormulario({
                codigo: contenidoEnProceso.codigo,
                descripcion: contenidoEnProceso.descripcion,
                codigo_modulo: contenidoEnProceso.codigo_modulo,
                inactivo: contenidoEnProceso.inactivo
            })

        }else{
            setCodigoMateria('0')
            setCodigoUnidad('0')
            reseteaFormulario()
        }

    }, [contenidoEnProceso])

    const validarFormulario = () => {

        //valida el módulo
        if(formulario.codigo_modulo.trim() === '' || formulario.codigo_modulo.trim() === '0'){
            toast.error('Seleccione módulo', {containerId: 'sys_msg'})
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
        setCodigoUnidad('0')
        setFormulario({
            codigo: '',
            descripcion: '',
            codigo_modulo: '0',
            inactivo: false
        })
    }

    const handleClickCrear = async e => {
        
        try{

            //valida el formulario
            if(!validarFormulario()) return
            //contenido a enviar
            let contenido = {
                ...formulario,
                codigo : uuidv4(),
             }

             await clienteAxios.post('/api/contenidos/crear', contenido)
             
             setContenidoEnProceso({
                ...contenido,
                modulo: {
                    codigo_unidad,
                    unidad: {
                        codigo_materia
                    }
                }
             })

             toast.success('Contenido creado', {containerId: 'sys_msg'})
 
        }catch(e){
             handleError(e)
        }
     
    }

    const handleClickActualizar = async e => {
        
        try{
            if(!validarFormulario()) return
            
            await clienteAxios.put('/api/contenidos/actualizar', formulario)
            //respuesta del usuario recibido.
            toast.success('Contenido actualizado', {containerId: 'sys_msg'})
 
        }catch(e){
             handleError(e)
        }
    }

    return ( 
        <Container>
            <Form className="p-3"> 
                <Row>
                    <Col>
                        <Form.Label className="text-muted">Materia</Form.Label>
                        <InputSelectMateria
                            id="codigo_materia"
                            name="codigo_materia"
                            as="select"
                            size="sm"
                            value={codigo_materia}
                            onChange={e => {
                                setCodigoMateria(e.target.value)
                                setCodigoUnidad('0')
                                setFormulario({
                                    ...formulario,
                                    codigo_modulo: '0',
                                })
                            }}
                        />
                    </Col>
                    <Col>
                        <Form.Label className="text-muted">Unidad</Form.Label>
                        <InputSelectUnidadesMateria
                            id="codigo_unidad"
                            name="codigo_unidad"
                            /*codigo materia se le pasa a las props del componente
                            para filtrar las unidades de la materia seleccionada.*/
                            codigo_materia={codigo_materia}
                            as="select"
                            size="sm"
                            value={codigo_unidad}
                            onChange={e => {
                                setCodigoUnidad(e.target.value)
                                setFormulario({
                                    ...formulario,
                                    codigo_modulo: '0',
                                })
                            }}
                        />
                    </Col>
                    
                </Row>
                
                <Form.Group>
                    <Form.Label>Módulos</Form.Label>
                    <InputSelectModulosUnidad
                        id="codigo_modulo"
                        name="codigo_modulo"
                        /*codigo unidad se le pasa a las props del componente
                        para filtrar los modulos de la unidad seleccionada.*/
                        codigo_unidad={codigo_unidad}
                        as="select"
                        size="sm"
                        value={formulario.codigo_modulo}
                        onChange={e => {
                            setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value
                            })
                        }}
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
                    {contenidoEnProceso
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
 
export default ContenidoForm
