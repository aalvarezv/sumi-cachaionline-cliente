import React, { useState, useContext, createRef, useEffect} from 'react'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment';
import { toast } from 'react-toastify'
import { Card, Accordion, Container, Form, Button, Row, Col, ButtonGroup, ToggleButton } from 'react-bootstrap'
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
        niveles_academicos: [],
        codigo_materia: '0',
        codigo_tipo_juego: '0',
        codigo_modalidad: '0',
        fecha_hora_inicio: new Date(),
        fecha_hora_fin: new Date(),
        tipo_duracion_pregunta: '0',
        duracion_pregunta: 0,
        revancha: false,
        revancha_cantidad: 0,
        nota_alta: 100,
        nota_alta_mensaje: 'Excelente, estás muy cerca del éxito',
        nota_media: 70,
        nota_media_mensaje: 'Sigue así y nadie te parará',
        nota_baja: 40,
        nota_baja_mensaje: 'Te invitamos a que revises el material de Cachai Online para seguir mejorando',
        puntos_respuesta_correcta: 1,
        puntos_respuesta_incorrecta: -1,
        puntos_respuesta_omitida: 0,
        puntos_respuesta_timeout: 0,
        retroceder: false,
        pistas: false,
        mostrar_cantidad_usuarios: true,
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
   
    useEffect(() => {
       
        if(ring_modificar){
            
            setFormulario({
                codigo: ring_modificar.codigo,
                nombre: ring_modificar.nombre,
                descripcion: ring_modificar.descripcion,
                rut_usuario_creador: ring_modificar.rut_usuario_creador,
                codigo_institucion: institucion_select.codigo,
                niveles_academicos: ring_modificar.ring_nivel_academicos.map(ringNivelAcademico => {
                    return{
                        codigo: ringNivelAcademico.nivel_academico.codigo,
                        descripcion: ringNivelAcademico.nivel_academico.descripcion,
                        selected: true,
                    }
                }),
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
                nota_alta: ring_modificar.nota_alta,
                nota_alta_mensaje: ring_modificar.nota_alta_mensaje,
                nota_media: ring_modificar.nota_media,
                nota_media_mensaje: ring_modificar.nota_media_mensaje,
                nota_baja: ring_modificar.nota_baja,
                nota_baja_mensaje: ring_modificar.nota_baja_mensaje,
                puntos_respuesta_correcta: ring_modificar.puntos_respuesta_correcta,
                puntos_respuesta_incorrecta: ring_modificar.puntos_respuesta_incorrecta,
                puntos_respuesta_omitida: ring_modificar.puntos_respuesta_omitida,
                puntos_respuesta_timeout: ring_modificar.puntos_respuesta_timeout,
                retroceder: ring_modificar.retroceder,
                pistas: ring_modificar.pistas,
                mostrar_cantidad_usuarios: ring_modificar.mostrar_cantidad_usuarios,
                privado: ring_modificar.privado,
                inactivo: ring_modificar.inactivo,
            })

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
       
        if(formulario.niveles_academicos.length === 0){
            errors = {
                ...errors,
               niveles_academicos: 'Requerido',
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
            niveles_academicos: [],
            codigo_materia: '0',
            codigo_tipo_juego: '0',
            codigo_modalidad: '0',
            fecha_hora_inicio: new Date(),
            fecha_hora_fin: new Date(),
            tipo_duracion_pregunta: '0',
            duracion_pregunta: 0,
            revancha: false,
            revancha_cantidad: 0,
            nota_alta: 100,
            nota_alta_mensaje: 'Excelente, estás muy cerca del éxito',
            nota_media: 70,
            nota_media_mensaje: 'Sigue así y nadie te parará',
            nota_baja: 40,
            nota_baja_mensaje: 'Te invitamos a que revises el material de Cachai Online para seguir mejorando',
            puntos_respuesta_correcta: 1,
            puntos_respuesta_incorrecta: -1,
            puntos_respuesta_omitida: 0,
            puntos_respuesta_timeout: 0,
            retroceder: false,
            pistas: false,
            mostrar_cantidad_usuarios: true,
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
            let ring = {
                ...formulario,
                codigo: uuidv4(),
                niveles_academicos: formulario.niveles_academicos.filter(nivelAcademico => nivelAcademico.selected === true)
            }

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
            
            let ring = {
                ...formulario,
                niveles_academicos: formulario.niveles_academicos.filter(nivelAcademico => nivelAcademico.selected === true)
            }
          
            const resp = await clienteAxios.put('/api/rings/actualizar', ring)
            ring = resp.data
            toast.success('RING ACTUALIZADO', {containerId: 'sys_msg'})


        }catch(e){
            handleError(e)
        }

    }

    const handleSelectNivelAcademico = nivelesAcademicos => {
        
        setFormulario({
            ...formulario,
            niveles_academicos: nivelesAcademicos
        })

    }

    return (
        <Container>
        <Form>
            <Row>
                <Col xs={12} lg={3} className="mb-2">
                    <Form.Label className="text-muted">Nombre</Form.Label>
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
                        onChange={(date) => {
                            setFormulario({
                                ...formulario,
                                fecha_hora_inicio : date,
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
                                fecha_hora_fin : date,
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
                    <Form.Label className="text-muted">Nivel Académico</Form.Label>
                    <InputSelectNivelesAcademicosUsuarioInstitucion
                        id="niveles_academicos"
                        name="niveles_academicos"
                        as="select"
                        //Listará los niveles academicos del rut_usuario logeado
                        rut_usuario={usuario.rut}
                        codigo_institucion={institucion_select.codigo}
                        value={formulario.niveles_academicos}
                        niveles_academicos={formulario.niveles_academicos}
                        handleSelectNivelAcademico={handleSelectNivelAcademico}
                        isInvalid={errores.hasOwnProperty('niveles_academicos')}
                        onBlur={validarFormulario}
                        multiple
                    /> 
                </Col>
                <Col>
                    <Form.Label className="text-muted">Instrucciones</Form.Label>
                    <Form.Control
                        id="descripcion"
                        name="descripcion"
                        as = "textarea"
                        rows = "4"
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
                <Col className="mb-2">
                    <Form.Label className="text-muted">Materia</Form.Label>
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
                <Col xs={12} md={6} className="mb-2">
                    <Form.Label className="text-muted">Tipo de Juego</Form.Label>
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
                    <Form.Label className="text-muted">Modalidad</Form.Label>
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
                <Col className="mb-2">
                    <Accordion defaultActiveKey="1">
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                    Haga clic para configurar mensajes motivacionales según porcentaje obtenido por el competidor.
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <Row>
                                        <Col xs={"auto"}>
                                            <Form.Control
                                                id="nota_alta"
                                                name="nota_alta"
                                                type="number" 
                                                placeholder="% Alto" 
                                                value={formulario.nota_alta}
                                                onChange={e => {setFormulario({
                                                        ...formulario,
                                                        [e.target.name]: e.target.value
                                                    })
                                                }}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                id="nota_alta_mensaje"
                                                name="nota_alta_mensaje"
                                                type="text" 
                                                placeholder="mensaje para el usuario al obtener un porcentaje alto" 
                                                value={formulario.nota_alta_mensaje}
                                                onChange={e => {setFormulario({
                                                        ...formulario,
                                                        [e.target.name]: e.target.value
                                                    })
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={"auto"}>
                                            <Form.Control
                                                id="nota_media"
                                                name="nota_media"
                                                type="number" 
                                                placeholder="% Medio" 
                                                value={formulario.nota_media}
                                                onChange={e => {setFormulario({
                                                        ...formulario,
                                                        [e.target.name]: e.target.value
                                                    })
                                                }}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                id="nota_media_mensaje"
                                                name="nota_media_mensaje"
                                                type="text" 
                                                placeholder="mensaje para el usuario al obtener un porcentaje medio" 
                                                value={formulario.nota_media_mensaje}
                                                onChange={e => {setFormulario({
                                                        ...formulario,
                                                        [e.target.name]: e.target.value
                                                    })
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={"auto"}>
                                            <Form.Control
                                                id="nota_baja"
                                                name="nota_baja"
                                                type="number" 
                                                placeholder="% Medio" 
                                                value={formulario.nota_baja}
                                                onChange={e => {setFormulario({
                                                        ...formulario,
                                                        [e.target.name]: e.target.value
                                                    })
                                                }}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                id="nota_baja_mensaje"
                                                name="nota_baja_mensaje"
                                                type="text" 
                                                placeholder="mensaje para el usuario al obtener un porcentaje bajo" 
                                                value={formulario.nota_baja_mensaje}
                                                onChange={e => {setFormulario({
                                                        ...formulario,
                                                        [e.target.name]: e.target.value
                                                    })
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </Col>
                
            </Row> 
            <Row>
                <Col className="mb-2">
                    <Accordion defaultActiveKey="1">
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                    Haga clic para configurar puntaje para preguntas correctas, incorrectas, omitidas y fuera de tiempo.
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <Row>
                                        <Col xs={"auto"}>
                                            <Form.Label>Ptos. Correcta</Form.Label>
                                            <Form.Control
                                                id="puntos_respuesta_correcta"
                                                name="puntos_respuesta_correcta"
                                                type="number" 
                                                placeholder="Ptos. Correcta" 
                                                value={formulario.puntos_respuesta_correcta}
                                                onChange={e => {setFormulario({
                                                        ...formulario,
                                                        [e.target.name]: e.target.value
                                                    })
                                                }}
                                            />
                                        </Col>
                                        <Col xs={"auto"}>
                                            <Form.Label>Ptos. Incorrecta</Form.Label>
                                            <Form.Control
                                                id="puntos_respuesta_incorrecta"
                                                name="puntos_respuesta_incorrecta"
                                                type="number" 
                                                placeholder="Ptos. Incorrecta" 
                                                value={formulario.puntos_respuesta_incorrecta}
                                                onChange={e => {setFormulario({
                                                        ...formulario,
                                                        [e.target.name]: e.target.value
                                                    })
                                                }}
                                            />
                                        </Col>
                                        <Col xs={"auto"}>
                                            <Form.Label>Ptos. Omitida</Form.Label>
                                            <Form.Control
                                                id="puntos_respuesta_omitida"
                                                name="puntos_respuesta_omitida"
                                                type="number" 
                                                placeholder="Ptos. Omitida" 
                                                value={formulario.puntos_respuesta_omitida}
                                                onChange={e => {setFormulario({
                                                        ...formulario,
                                                        [e.target.name]: e.target.value
                                                    })
                                                }}
                                            />
                                        </Col>
                                        <Col xs={"auto"}>
                                            <Form.Label>Ptos. Fuera de Tiempo</Form.Label>
                                            <Form.Control
                                                id="puntos_respuesta_timeout"
                                                name="puntos_respuesta_timeout"
                                                type="number" 
                                                placeholder="Ptos. Fuera de Tiempo" 
                                                value={formulario.puntos_respuesta_timeout}
                                                onChange={e => {setFormulario({
                                                        ...formulario,
                                                        [e.target.name]: e.target.value
                                                    })
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </Col>
                
            </Row>         
            <Row>
                <Col xs={12} md={6} className="mb-2">
                    <Row>
                        <Col xs={9}>
                            <Form.Label className="text-muted">Tiempo para responder</Form.Label>
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
                            <Form.Label className="text-muted">Segundos</Form.Label>
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
                <Col xs={12} md="auto" className="mb-1"> 
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
                <Col className="mb-1"> 
                    <Form.Check 
                        id="mostrar_cantidad_usuarios"
                        name="mostrar_cantidad_usuarios"
                        type="checkbox"
                        label="Mostrar Cantidad Usuarios"
                        checked={formulario.mostrar_cantidad_usuarios}
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