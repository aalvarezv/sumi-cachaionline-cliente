import React, { useState, useContext, createRef, useEffect, useRef} from 'react'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import { Container, Form, Button, Row, Col, ButtonGroup, ToggleButton } from 'react-bootstrap'
import {handleError } from '../../helpers'
import clienteAxios from '../../config/axios'
import CustomDateInput from '../ui/CustomDateInput'
import DatePicker from 'react-datepicker'
import AuthContext from '../../context/auth/AuthContext'
import InputSelectTipoJuego from '../ui/InputSelectTipoJuego'
import InputSelectModalidadTipoJuego from '../ui/InputSelectModalidadTipoJuego'
import InputSelectNivelesAcademicosUsuarioInstitucion from '../../components/ui/InputSelectNivelesAcademicosUsuarioInstitucion'
import InputSelectMateria from '../../components/ui/InputSelectMateria'
import InputSelectTipoDuracionPregunta from '../../components/ui/InputSelectTipoDuracionPregunta'
 

const RingForm = ({ring_modificar, handleClickVolver}) => {

    const {usuario, institucion_select} = useContext(AuthContext)

    const [formulario, setFormulario] = useState({
        codigo: '',
        nombre: '',
        descripcion: '',
        rut_usuario_creador: usuario.rut,
        codigo_institucion: institucion_select.codigo,
        codigo_nivel_academico: '0',
        codigo_materia: '0',
        codigo_tipo_juego: '0',
        codigo_modalidad: '0',
        fecha_hora_inicio: new Date(),
        fecha_hora_fin: new Date(),
        tipo_duracion_pregunta: '0',
        duracion_pregunta: 0,
        revancha: false,
        revancha_cantidad: 0,
        retroceder: false,
        pistas: false,
        privado: true,
        inactivo: false,
    })
 
    const [showDuracionPregunta, setShowDuracionPregunta] = useState(false)
    const [showRevanchaCantidad, setShowRevanchaCantidad] = useState(false)

    const radios_estado_ring = [
        { name: 'Privado', value: true },
        { name: 'Público', value: false },
    ]

    const ref_custom_date_desde = createRef()
    const ref_custom_date_hasta = createRef()
    
    const [errores, setErrores] = useState({})

    //Si se cambia de institucion, vuelve a la pantalla anterior.
    useEffect(() => {
        if(ring_modificar && ring_modificar.codigo_institucion !== institucion_select.codigo){
            handleClickVolver()
        }

    }, [institucion_select])

    useEffect(() => {
       
        if(ring_modificar){

            setFormulario({
                codigo: ring_modificar.codigo,
                nombre: ring_modificar.nombre,
                descripcion: ring_modificar.descripcion,
                rut_usuario_creador: ring_modificar.rut_usuario_creador,
                codigo_institucion: institucion_select.codigo,
                codigo_nivel_academico: ring_modificar.codigo_nivel_academico,
                codigo_materia: ring_modificar.codigo_materia,
                codigo_tipo_juego: ring_modificar.codigo_tipo_juego,
                codigo_modalidad: ring_modificar.codigo_modalidad,
                fecha_hora_inicio: new Date(ring_modificar.fecha_hora_inicio),
                fecha_hora_fin: new Date(ring_modificar.fecha_hora_fin),
                tipo_duracion_pregunta: ring_modificar.tipo_duracion_pregunta,
                duracion_pregunta: ring_modificar.duracion_pregunta,
                tipo_duracion_pregunta: ring_modificar.tipo_duracion_pregunta,
                duracion_pregunta: ring_modificar.duracion_pregunta,
                revancha: ring_modificar.revancha,
                revancha_cantidad: ring_modificar.revancha_cantidad,
                retroceder: ring_modificar.retroceder,
                pistas: ring_modificar.pistas,
                privado: ring_modificar.privado,
                inactivo: ring_modificar.inactivo,
            })

            console.log(ring_modificar.tipo_duracion_pregunta)
            if(ring_modificar.tipo_duracion_pregunta == '2'){
                setShowDuracionPregunta(true)
            }else{
                setShowDuracionPregunta(false)
            }

            if(ring_modificar.revancha){
                setShowRevanchaCantidad(true)
            }else{
                setShowRevanchaCantidad(false)
            }

        }else{
            reseteaFormulario()
        }
    
    }, [ring_modificar])


    const validarFormulario = (e, fechaHoraInicio = formulario.fecha_hora_inicio, fechaHoraFin = formulario.fecha_hora_fin) => {
        
        let errors = {}

        if(formulario.nombre.trim() === ''){
            errors = {
                ...errors,
                nombre: 'Requerido'
            }
        }
        
        //Se valida fechahora solo si se envían, que es cuando se selecciona una fechahora en los input datepicker.
        const fechaInicio = new Date(fechaHoraInicio).toISOString().split('T')[0]
        const horaInicio  = new Date(fechaHoraInicio).toTimeString().split(' ')[0].substring(0,5)

        const fechaFin = new Date(fechaHoraFin).toISOString().split('T')[0]
        const horaFin  = new Date(fechaHoraFin).toTimeString().split(' ')[0].substring(0,5)
  
        if(fechaInicio >= fechaFin && horaInicio >= horaFin){
            errors = {
                ...errors,
                fecha_hora_inicio: 'Debe ser menor a fecha hora fin',
            }
        }
       
        if(formulario.codigo_nivel_academico === '0'){
            errors = {
                ...errors,
                codigo_nivel_academico: 'Requerido',
            }
        }

        if(formulario.codigo_materia === '0'){
            errors = {
                ...errors,
                codigo_materia: 'Requerido',
            }
        }

        if(formulario.codigo_tipo_juego === '0'){
            errors = {
                ...errors,
                codigo_tipo_juego: 'Requerido'
            }
        }

        if(formulario.codigo_modalidad === '0'){
            errors = {
                ...errors,
                codigo_modalidad: 'Requerido',
            }
        }

        if(formulario.tipo_duracion_pregunta === '0'){
            errors = {
               ...errors,
               tipo_duracion_pregunta: 'Requerio',
            }
        }

        if(formulario.tipo_duracion_pregunta === '2' && formulario.duracion_pregunta === '0' || formulario.duracion_pregunta === ''){
            
            errors = {
                ...errors,
                duracion_pregunta: 'Requerido',
            }
        }

        if(formulario.revancha && formulario.revancha_cantidad === '0' || formulario.revancha_cantidad === '' ){
            errors = {
                ...errors,
                revancha_cantidad: 'Requerido',
            }
        }


        setErrores(errors)

        return errors

    }

    const reseteaFormulario = () => {

        setShowDuracionPregunta(false)
        setShowRevanchaCantidad(false)
        setFormulario({
            codigo: '',
            nombre: '',
            descripcion: '',
            rut_usuario_creador: usuario.rut,
            codigo_institucion: institucion_select.codigo,
            codigo_nivel_academico: '0',
            codigo_materia: '0',
            codigo_tipo_juego: '0',
            codigo_modalidad: '0',
            fecha_hora_inicio: new Date(),
            fecha_hora_fin: new Date(),
            tipo_duracion_pregunta: '0',
            duracion_pregunta: 0,
            revancha: false,
            revancha_cantidad: 0,
            retroceder: false,
            pistas: false,
            privado: true,
            inactivo: false,
        })
    }

    const handleCrearRing = async e => {
        
        try{
            //previne el envío
            e.preventDefault()
            //valida el formulario
            const errors = validarFormulario()
            //verifica que no hayan errores
            if(Object.keys(errors).length > 0){
                toast.error('Complete los campos marcados en rojo', {containerId: 'sys_msg'})
                return
            }
            //ring a enviar
            let ring = formulario
            ring.codigo = uuidv4()

            const resp = await clienteAxios.post('/api/rings/crear', ring)
            reseteaFormulario()
            toast.success('RING CREADO', {containerId: 'sys_msg'})
        
        }catch(e){
            handleError(e)
        }                                                
    }

    const handleActualizarRing = async e => {

        try{
            //previne el envío
            e.preventDefault()
            //valida el formulario
            const errors = validarFormulario()
            //verifica que no hayan errores
            if(Object.keys(errors).length > 0){
                return
            }

            let ring = formulario
          
            const resp = await clienteAxios.put('/api/rings/actualizar', ring)
            ring = resp.data
            toast.success('RING ACTUALIZADO', {containerId: 'sys_msg'})


        }catch(e){
            handleError(e)
        }

    }

    return (
        <Container>
        <Form>
            <Row>
                <Col xs={12} lg={3} className="mb-2">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        id="nombre"
                        name="nombre"
                        type="text" 
                        placeholder="NOMBRE" 
                        value={formulario.nombre}
                        onChange={e => {setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value.toUpperCase()
                            })
                        }}
                        isInvalid={errores.hasOwnProperty('nombre')}
                        onBlur={validarFormulario}
                    />
                </Col>
                <Col xs={12} md={"auto"} className="mb-2">
                    <DatePicker
                        id="fecha_hora_inicio"
                        name="fecha_hora_inicio"
                        selected={formulario.fecha_hora_inicio}
                        showTimeInput
                        timeFormat = 'HH:mm'
                        dateFormat="dd/MM/yyyy HH:mm aa"
                        onChange={date => {
                            setFormulario({
                                ...formulario,
                                fecha_hora_inicio : date
                            })
                            validarFormulario(null, date, formulario.fecha_hora_fin)
                        }}
                        customInput={
                            <CustomDateInput 
                                label="Inicio del juego"
                                isInvalid={errores.hasOwnProperty('fecha_hora_inicio')}
                                ref = {ref_custom_date_desde}
                            />
                        }
                    />
                </Col>
                <Col xs={12} md={"auto"} className="mb-2">
                    <DatePicker
                        id='fecha_hora_fin'
                        name='fecha_hora_fin'
                        selected={formulario.fecha_hora_fin}
                        showTimeInput
                        timeFormat="HH:mm"
                        dateFormat="dd/MM/yyyy HH:mm aa"
                        onChange={date => {
                            setFormulario({
                                ...formulario,
                                fecha_hora_fin : date
                            })
                            validarFormulario(null, formulario.fecha_hora_inicio, date)
                        }}
                        customInput={
                            <CustomDateInput
                                label = "Fin del juego" 
                                isInvalid={errores.hasOwnProperty('fecha_hora_inicio')}
                                ref = {ref_custom_date_hasta}
                            />
                        }
                    />
                </Col>
                <Col xs={12} md={"auto"} className="d-flex align-items-end mb-2 mt-1">
                    <ButtonGroup toggle style={{zIndex: 0}}>
                        {radios_estado_ring.map((radio, idx) => (
                            <ToggleButton
                                key={idx}
                                type="radio"
                                variant="outline-info"
                                name="privado"
                                value={radio.value}
                                checked={formulario.privado === radio.value}
                                onChange={e => {
                                    setFormulario({
                                        ...formulario,
                                        [e.target.name]: radio.value,
                                    })
                                }
                                }
                            >
                                {radio.name}
                            </ToggleButton>
                        ))}
                    </ButtonGroup>
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={6} className="mb-2">
                    <Form.Label>Nivel Académico</Form.Label>
                    <InputSelectNivelesAcademicosUsuarioInstitucion
                        id="codigo_nivel_academico"
                        name="codigo_nivel_academico"
                        as="select"
                        //Listará los niveles academicos del rut_usuario logeado
                        rut_usuario={usuario.rut}
                        codigo_institucion={institucion_select.codigo}
                        value={formulario.codigo_nivel_academico}
                        onChange={e => setFormulario({
                            ...formulario,
                            [e.target.name]: e.target.value
                        })}
                        isInvalid={errores.hasOwnProperty('codigo_nivel_academico')}
                        onBlur={validarFormulario}
                    />
                </Col>
                <Col className="mb-2">
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
                        isInvalid={errores.hasOwnProperty('codigo_materia')}
                        onBlur={validarFormulario}
                    />
                </Col>
            </Row>
            <Row>
                <Col className="mb-2">
                    <Form.Label>Instrucciones</Form.Label>
                    <Form.Control
                        id="descripcion"
                        name="descripcion"
                        as = "textarea"
                        rows = "3"
                        placeholder="INSTRUCCIONES" 
                        value={formulario.descripcion}
                        onChange={e => {setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value.toUpperCase()
                            })
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={6} className="mb-2">
                    <Form.Label>Tipo de Juego</Form.Label>
                    <InputSelectTipoJuego
                        id="codigo_tipo_juego"
                        name="codigo_tipo_juego"
                        as="select"
                        value={formulario.codigo_tipo_juego}
                        onChange={e => setFormulario({
                            ...formulario,
                            [e.target.name]: e.target.value
                        })}
                        isInvalid={errores.hasOwnProperty('codigo_tipo_juego')}
                        onBlur={validarFormulario}
                    />   
                </Col>
                <Col className="mb-2">
                    <Form.Label>Modalidad</Form.Label>
                    <InputSelectModalidadTipoJuego
                        id="codigo_modalidad"
                        name="codigo_modalidad"
                        codigo_tipo_juego={formulario.codigo_tipo_juego}
                        as="select"
                        value={formulario.codigo_modalidad}
                        onChange={e => setFormulario({
                            ...formulario,
                            [e.target.name]: e.target.value
                        })}
                        isInvalid={errores.hasOwnProperty('codigo_modalidad')}
                        onBlur={validarFormulario}
                    />     
                </Col>
            </Row>            
            <Row>
                <Col xs={12} md={6} className="mb-2">
                    <Row>
                        <Col xs={9}>
                            <Form.Label>Tiempo para responder</Form.Label>
                            <InputSelectTipoDuracionPregunta
                                id="tipo_duracion_pregunta"
                                name="tipo_duracion_pregunta"
                                as="select"
                                value={formulario.tipo_duracion_pregunta}
                                onChange={e => {
                                    setFormulario({
                                        ...formulario,
                                        [e.target.name]: e.target.value,
                                        duracion_pregunta: '0',
                                    })
                                    if(e.target.value === '2'){
                                        setShowDuracionPregunta(true)
                                    }else{
                                        setShowDuracionPregunta(false)
                                    }
                                }}
                                isInvalid={errores.hasOwnProperty('tipo_duracion_pregunta')}
                                onBlur={validarFormulario}
                            />
                        </Col>
                        <Col xs={3}>
                            <Form.Label>Segundos</Form.Label>
                            <Form.Control
                                id="duracion_pregunta"
                                name="duracion_pregunta"
                                type="number" 
                                placeholder="SEGUNDOS DURACIÓN DE PREGUNTA" 
                                value={formulario.duracion_pregunta}
                                onChange={e => {setFormulario({
                                        ...formulario,
                                    [e.target.name]: e.target.value,
                                    })
                                }}
                                isInvalid={errores.hasOwnProperty('duracion_pregunta')}
                                onBlur={validarFormulario}
                                disabled = {!showDuracionPregunta}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col md={"auto"} className="mb-2">
                    <Form.Check
                        id="revancha"
                        name="revancha"
                        type="checkbox"
                        label="Revancha"
                        className="mb-2"
                        checked={formulario.revancha}
                        onChange={e => {
                            setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.checked,
                                revancha_cantidad : '0',
                            })
                            if(e.target.checked === true){
                                setShowRevanchaCantidad(true)
                            }else{
                                setShowRevanchaCantidad(false)
                            }
                        }}
                        onBlur={validarFormulario}
                    />
                    <Form.Control
                        id="revancha_cantidad"
                        name="revancha_cantidad"
                        type="number" 
                        placeholder="CANTIDAD DE REVANCHAS" 
                        value={formulario.revancha_cantidad}
                        onChange={e => {
                            setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value.toUpperCase()
                            })
                        }}
                        isInvalid={errores.hasOwnProperty('revancha_cantidad')}
                        onBlur={validarFormulario}
                        disabled = {!showRevanchaCantidad}
                    />
                </Col>
            </Row> 
            <Row> 
                <Col xs={12} md="auto" className="mb-1">
                    <Form.Check 
                        id="retroceder"
                        name="retroceder"
                        type="checkbox"
                        label="Retroceder"
                        checked={formulario.retroceder}
                        onChange={e => {
                            setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.checked
                            })
                        }}
                    />
                </Col>
                <Col className="mb-1"> 
                    <Form.Check 
                        id="pistas"
                        name="pistas"
                        type="checkbox"
                        label="Pistas"
                        checked={formulario.pistas}
                        onChange={e => {
                            setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.checked
                            })
                        }}
                    />
                </Col> 
                
            </Row>
            <Row>
                <Col className="mb-2">
                    <Form.Check 
                        id="inactivo"
                        name="inactivo"
                        type="checkbox"
                        label="Inactivo"
                        checked={formulario.inactivo}
                        onChange={e => {
                            setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.checked
                            })
                        }}
                    />
                </Col>
            </Row>
            
            <Row className="justify-content-center">
                <Col className="mb-2 mb-md-0" xs={12} md={"auto"}>
                    {!ring_modificar
                    ?
                        <Button 
                            variant="info"
                            size="lg"
                            className="btn-block"
                            onClick={handleCrearRing}
                        >Crear</Button>
                    :
                        <Button
                            variant="outline-info"
                            size="lg"
                            className="btn-block"
                            onClick={handleActualizarRing}
                        >
                           Actualizar 
                        </Button>
                    }
                    
                </Col>
                
                <Col xs={12} md={"auto"}>
                    <Button 
                        variant="outline-primary"
                        size="lg"
                        className="btn-block"
                        onClick={handleClickVolver}
                    >Volver</Button>
                </Col>
            </Row>
           
        </Form>
     </Container> )
}
 
export default RingForm