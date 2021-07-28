import React, { useState, useContext, createRef, useEffect} from 'react'
import { v4 as uuidv4 } from 'uuid'
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
 

const RingForm = ({ ringEnProceso, setRingEnProceso }) => {

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
    
    useEffect(() => {
       
        if(ringEnProceso){
            
            setFormulario({
                codigo: ringEnProceso.codigo,
                nombre: ringEnProceso.nombre,
                descripcion: ringEnProceso.descripcion,
                rut_usuario_creador: ringEnProceso.rut_usuario_creador,
                codigo_institucion: institucion_select.codigo,
                niveles_academicos: ringEnProceso.niveles_academicos.map(nivelAcademico => {
                    return{
                        codigo: nivelAcademico.codigo,
                        descripcion: nivelAcademico.descripcion,
                        selected: true,
                    }
                }),
                codigo_materia: ringEnProceso.codigo_materia,
                codigo_tipo_juego: ringEnProceso.codigo_tipo_juego,
                codigo_modalidad: ringEnProceso.codigo_modalidad,
                fecha_hora_inicio: new Date(ringEnProceso.fecha_hora_inicio),
                fecha_hora_fin: new Date(ringEnProceso.fecha_hora_fin),
                tipo_duracion_pregunta: ringEnProceso.tipo_duracion_pregunta,
                duracion_pregunta: ringEnProceso.duracion_pregunta,
                tipo_duracion_pregunta: ringEnProceso.tipo_duracion_pregunta,
                duracion_pregunta: ringEnProceso.duracion_pregunta,
                revancha: ringEnProceso.revancha,
                revancha_cantidad: ringEnProceso.revancha_cantidad,
                nota_alta: ringEnProceso.nota_alta,
                nota_alta_mensaje: ringEnProceso.nota_alta_mensaje,
                nota_media: ringEnProceso.nota_media,
                nota_media_mensaje: ringEnProceso.nota_media_mensaje,
                nota_baja: ringEnProceso.nota_baja,
                nota_baja_mensaje: ringEnProceso.nota_baja_mensaje,
                puntos_respuesta_correcta: ringEnProceso.puntos_respuesta_correcta,
                puntos_respuesta_incorrecta: ringEnProceso.puntos_respuesta_incorrecta,
                puntos_respuesta_omitida: ringEnProceso.puntos_respuesta_omitida,
                puntos_respuesta_timeout: ringEnProceso.puntos_respuesta_timeout,
                retroceder: ringEnProceso.retroceder,
                pistas: ringEnProceso.pistas,
                mostrar_cantidad_usuarios: ringEnProceso.mostrar_cantidad_usuarios,
                privado: ringEnProceso.privado,
                inactivo: ringEnProceso.inactivo,
            })

            if(ringEnProceso.tipo_duracion_pregunta == '2'){
                setShowDuracionPregunta(true)
            }else{
                setShowDuracionPregunta(false)
            }

            if(ringEnProceso.revancha){
                setShowRevanchaCantidad(true)
            }else{
                setShowRevanchaCantidad(false)
            }

        }else{
            reseteaFormulario()
        }
    
    }, [ringEnProceso])

    const validarFormulario = (e, fechaHoraInicio = formulario.fecha_hora_inicio, fechaHoraFin = formulario.fecha_hora_fin) => {
        
        if(formulario.nombre.trim() === ''){
            toast.error('Ingrese nombre del ring', {containerId: 'sys_msg'})
            return false
        }
        
        //Se valida fechahora solo si se envían, que es cuando se selecciona una fechahora en los input datepicker.
        const fechaInicio = new Date(fechaHoraInicio).toISOString().split('T')[0]
        const horaInicio  = new Date(fechaHoraInicio).toTimeString().split(' ')[0].substring(0,5)

        const fechaFin = new Date(fechaHoraFin).toISOString().split('T')[0]
        const horaFin  = new Date(fechaHoraFin).toTimeString().split(' ')[0].substring(0,5)
  
        if(fechaInicio >= fechaFin && horaInicio >= horaFin){
            toast.error('Fecha y hora de inicio del juego ser menor a su fecha y hora de fin', {containerId: 'sys_msg'})
            return false
        }
       
        if(formulario.niveles_academicos.length === 0){
            toast.error('Seleccione al menos un nivel académico', {containerId: 'sys_msg'})
            return false
        }

        if(formulario.codigo_materia === '0'){
            toast.error('Seleccione materia', {containerId: 'sys_msg'})
            return false

        }

        if(formulario.codigo_tipo_juego === '0'){
            toast.error('Seleccione tipo de juego', {containerId: 'sys_msg'})
            return false
        }

        if(formulario.codigo_modalidad === '0'){
            toast.error('Seleccione modalidad del juego', {containerId: 'sys_msg'})
            return false
        }

        if(formulario.tipo_duracion_pregunta === '0'){
            toast.error('Seleccione tipo de duración de preguntas', {containerId: 'sys_msg'})
            return false
        }

        if(formulario.tipo_duracion_pregunta === '2' && formulario.duracion_pregunta === '0' || formulario.duracion_pregunta === ''){
            toast.error('Ingrese duración de pregunta en segundos', {containerId: 'sys_msg'})
            return false
        }

        if(formulario.revancha && formulario.revancha_cantidad === '0' || formulario.revancha_cantidad === '' ){
            toast.error('Ingrese cantidad de revanchas', {containerId: 'sys_msg'})
            return false
        }

        return true

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
            //valida el formulario
            if(!validarFormulario()){
                return
            }
            //ring a enviar
            let ring = {
                ...formulario,
                codigo: uuidv4(),
                niveles_academicos: formulario.niveles_academicos.filter(nivelAcademico => nivelAcademico.selected === true)
            }

            await clienteAxios.post('/api/rings/crear', ring)
            
            setRingEnProceso(ring)

            toast.success('Tu ring ha sido creado ahora puedes agregar alumnos y preguntas pulsando el botón siguiente', {containerId: 'sys_msg'})
        
        }catch(e){
            handleError(e)
        }                                                
    }

    const handleActualizarRing = async e => {

        try{
           
            if(!validarFormulario()){
                return
            }
            
            let ring = {
                ...formulario,
                niveles_academicos: formulario.niveles_academicos.filter(nivelAcademico => nivelAcademico.selected === true)
            }
          
            await clienteAxios.put('/api/rings/actualizar', ring)
            
            toast.success('Tu ring se ha actualizado ahora puedes agregar o quitar alumnos y preguntas pulsando el botón siguiente', {containerId: 'sys_msg'})


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
                                [e.target.name]: e.target.value
                            })
                        }}
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
                        }}
                        customInput={
                            <CustomDateInput 
                                label="Inicio del juego"
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
                        }}
                        customInput={
                            <CustomDateInput
                                label = "Fin del juego" 
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
                                [e.target.name]: e.target.value
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
                                disabled = {!showDuracionPregunta}
                            />
                        </Col>
                    </Row>
                </Col>
                {/* <Col md={"auto"} className="mb-2">
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
                                [e.target.name]: e.target.value
                            })
                        }}
                        disabled = {!showRevanchaCantidad}
                    />
                </Col> */}
            </Row> 
            <Row> 
                {/* <Col xs={12} md="auto" className="mb-1">
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
                </Col> */}
                <Col xs={12} md="auto" className="mb-1"> 
                    <Form.Check 
                        id="pistas"
                        name="pistas"
                        type="checkbox"
                        label="Mostrar pistas"
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
                    {!ringEnProceso
                    ?
                        <Button 
                            variant="info"
                            size="lg"
                            className="btn-block"
                            onClick={handleCrearRing}
                        >Crear</Button>
                    :
                        <Button
                            variant="info"
                            size="lg"
                            className="btn-block"
                            onClick={handleActualizarRing}
                        >Actualizar</Button>
                    }
                </Col>
            </Row>
        </Form>
     </Container> )
}
 
export default RingForm