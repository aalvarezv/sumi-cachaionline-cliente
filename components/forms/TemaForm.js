import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import { Container, Form, Button, Row, Col } from 'react-bootstrap'
import { handleError } from '../../helpers'
import  clienteAxios from '../../config/axios'
import InputSelectMateria from '../ui/InputSelectMateria'
import InputSelectUnidadesMateria from '../ui/InputSelectUnidadesMateria'
import InputSelectModulosUnidad from '../ui/InputSelectModulosUnidad'
import InputSelectModulosContenido from '../../components/ui/InputSelectModulosContenido'


const TemaForm = ({temaEnProceso, setTemaEnProceso}) => {
    
    const [codigo_materia, setCodigoMateria] = useState('0')
    const [codigo_unidad, setCodigoUnidad] = useState('0')
    const [codigo_modulo, setCodigoModulo] = useState('0')
    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        codigo_modulo_contenido: '0',
        inactivo: false,
    })

    useEffect(() => {
        
        //cuando se selecciona o cambia el result_select
        if(temaEnProceso){

            setCodigoModulo(temaEnProceso.modulo_contenido.codigo_modulo)
            setCodigoUnidad(temaEnProceso.modulo_contenido.modulo.codigo_unidad)
            setCodigoMateria(temaEnProceso.modulo_contenido.modulo.unidad.codigo_materia)

            setFormulario({
                codigo: temaEnProceso.codigo,
                descripcion: temaEnProceso.descripcion,
                codigo_modulo_contenido: temaEnProceso.codigo_modulo_contenido,
                inactivo: temaEnProceso.inactivo
            })

        }else{
            reseteaFormulario()
        }

    }, [temaEnProceso])

    const validarFormulario = () => {

        //valida la unidad.
        if(formulario.codigo_modulo_contenido.trim() === '' || formulario.codigo_modulo_contenido.trim() === '0'){
            toast.error('Seleccione contenido', {containerId: 'sys_msg'})
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

        setFormulario({
            codigo: '',
            descripcion: '',
            codigo_modulo_contenido: '0',
            inactivo: false
        })
        setCodigoMateria('0')
        setCodigoUnidad('0')
        setCodigoModulo('0')

    }

    const handleClickCrear = async e => {
        
        try{
            if(!validarFormulario()) return
            //contenido a enviar
            let tema = {
                ...formulario,
                codigo : uuidv4(),
             }

            await clienteAxios.post('/api/temas/crear', tema)

            setTemaEnProceso({
                 ...tema,
                 modulo_contenido:{
                    codigo_modulo,
                    modulo: {
                        codigo_unidad,
                        unidad: {
                            codigo_materia
                        }
                    }
                 }   
            })
            
            toast.success('Tema creado', {containerId: 'sys_msg'})
 
        }catch(e){
             handleError(e)
        }
     
    }

    const handleClickActualizar = async e => {
        
        try{
            //valida el formulario
            if(!validarFormulario()) return
            //tema a enviar
            let tema = formulario

            await clienteAxios.put('/api/temas/actualizar', tema)
            //respuesta del usuario recibido.
            toast.success('Tema actualizado', {containerId: 'sys_msg'})
 
        }catch(e){
             handleError(e)
        }
    }

    return ( 
        <Container>
            <Form className="p-3">

                <Form.Group as={Row}>
                    <Col xs={12} sm={6} className="mb-3 mb-sm-0">
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
                                setCodigoModulo('0')
                                setFormulario({
                                    ...formulario,
                                    codigo_modulo_contenido: '0'

                                })
                            }}
                        />
                    </Col>
                    <Col xs={12} sm={6}>
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
                                setCodigoModulo('0')
                                setFormulario({
                                    ...formulario,
                                    codigo_modulo_contenido: '0'

                                })
                            }}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Col xs={12} sm={6} className="mb-3 mb-sm-0">
                        <Form.Label className="text-muted">Módulo</Form.Label>
                        <InputSelectModulosUnidad
                            id="codigo_modulo"
                            name="codigo_modulo"
                            /*codigo unidad se le pasa a las props del componente
                            para filtrar los modulos de la unidad seleccionada.*/
                            codigo_unidad={codigo_unidad}
                            as="select"
                            size="sm"
                            value={codigo_modulo}
                            onChange={e => {
                                setCodigoModulo(e.target.value)
                                setFormulario({
                                    ...formulario,
                                    codigo_modulo_contenido: '0'

                                })
                            }}
                        />
                    </Col>
                    <Col xs={12} sm={6}>
                        <Form.Label>Contenido</Form.Label>
                        <InputSelectModulosContenido
                            id="codigo_modulo_contenido"
                            name="codigo_modulo_contenido"
                            /*codigo modulo se le pasa a las props del componente
                            para filtrar las propiedades del modulo seleccionado.*/
                            codigo_modulo={codigo_modulo}
                            as="select"
                            size="sm"
                            label="TODOS LOS CONTENIDOS"
                            value={formulario.codigo_modulo_contenido}
                            onChange={e => {
                                setFormulario({
                                    ...formulario,
                                    [e.target.name]: e.target.value
                                })
                            }}
                        />
                    </Col>
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
                    {temaEnProceso
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
 
export default TemaForm
