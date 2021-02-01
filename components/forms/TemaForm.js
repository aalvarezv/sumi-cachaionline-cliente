import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import { Container, Form, Button, Row, Col } from 'react-bootstrap'
import ToastMultiline from '../ui/ToastMultiline'
import { handleError } from '../../helpers'
import  clienteAxios from '../../config/axios'
import InputSelectMateria from '../ui/InputSelectMateria'
import InputSelectUnidadesMateria from '../ui/InputSelectUnidadesMateria'
import InputSelectModulosUnidad from '../ui/InputSelectModulosUnidad'
import InputSelectModulosContenido from '../../components/ui/InputSelectModulosContenido'


const TemaForm = ({tema_modificar, handleClickVolver}) => {
    
    const [codigo_materia, setCodigoMateria] = useState('0')
    const [codigo_unidad, setCodigoUnidad] = useState('0')
    const [codigo_modulo, setCodigoModulo] = useState('0')
    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        codigo_modulo_contenido: '0',
        inactivo: false,
    })

    const [errores, setErrores] = useState({})


    useEffect(() => {
        
        //cuando se selecciona o cambia el result_select
        if(tema_modificar){

            setCodigoModulo(tema_modificar.modulo_contenido.codigo_modulo)
            setCodigoUnidad(tema_modificar.modulo_contenido.modulo.codigo_unidad)
            setCodigoMateria(tema_modificar.modulo_contenido.modulo.unidad.codigo_materia)

            setFormulario({
                codigo: tema_modificar.codigo,
                descripcion: tema_modificar.descripcion,
                codigo_modulo_contenido: tema_modificar.codigo_modulo_contenido,
                inactivo: tema_modificar.inactivo
            })

        }else{
            reseteaFormulario()
        }
        setErrores({})

    }, [tema_modificar])

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
        if(formulario.codigo_modulo_contenido.trim() === '' || formulario.codigo_modulo_contenido.trim() === '0'){
            errors = {
                ...errors,
                codigo_modulo_contenido: 'Requerido'
            }
        }

        setErrores(errors)

        return errors

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
            //previne el envío
            e.preventDefault()
            //valida el formulario
            const errors = validarFormulario()
            //verifica que no hayan errores
            if(Object.keys(errors).length > 0){
                return
            }
            //contenido a enviar
            let tema = {
                ...formulario,
                codigo : uuidv4(),
             }

             const resp = await clienteAxios.post('/api/temas/crear', tema)
             reseteaFormulario()
             toast.success(<ToastMultiline mensajes={[{msg: 'TEMA CREADO'}]}/>, {containerId: 'sys_msg'})
 
        }catch(e){
             handleError(e)
        }
     
    }

    const handleClickActualizar = async e => {
        
        try{
            e.preventDefault()
            //valida el formulario
            /*const errors = validarFormulario()
            //verifica que no hayan errores
            if(Object.keys(errors).length > 0){
                return
            }*/
            //tema a enviar
            let tema = formulario

            await clienteAxios.put('/api/temas/actualizar', tema)
            //respuesta del usuario recibido.
            toast.success(<ToastMultiline mensajes={[{msg: 'TEMA ACTUALIZADO'}]}/>, {containerId: 'sys_msg'})
 
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
                            isInvalid={errores.hasOwnProperty('codigo_modulo_contenido')}
                            onBlur={validarFormulario}
                        />
                    </Col>
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
                    {tema_modificar
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
 
export default TemaForm
