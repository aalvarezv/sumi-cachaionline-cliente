import React, { useState } from 'react'
import { Alert, Container, Row, Col, Badge, Form, Button, Accordion, Card, Tab, Tabs } from 'react-bootstrap'
import { toast } from 'react-toastify'
import TableRingPreguntas from './TableRingPreguntas'
import InputSelectMateria from '../../components/ui/InputSelectMateria'
import InputSelectUnidadesMateria from '../../components/ui/InputSelectUnidadesMateria'
import InputSelectModulosUnidad from '../../components/ui/InputSelectModulosUnidad'
import InputSelectModulosContenido from '../../components/ui/InputSelectModulosContenido'
import InputSelectModulosContenidoTema from '../../components/ui/InputSelectModulosContenidoTema'
import InputSelectModulosContenidoTemaConcepto from '../../components/ui/InputSelectModulosContenidoTemaConcepto'
import { handleError } from '../../helpers'
import clienteAxios from '../../config/axios'
import AlertText from './AlertText'
import Paginador from './Paginador'
import PreguntaInfo from './PreguntaInfo'
import FiltrosBusquedaClasificacionPregunta from '../forms/FiltrosBusquedaClasificacionPregunta'
import FiltrosBusquedaHabilidadesPregunta from '../forms/FiltrosBusquedaHabilidadesPregunta'
import TablePreguntasInscritasRing from '../ui/TablePreguntasInscritasRing'


export const RingPregunta = ({ring}) => {

    const [preguntas_ring, setPreguntasRing] = useState([])
    const [cantPreguntasRing, setCantPreguntasRing] = useState(0)
   
    const [pregunta, setPregunta] = useState(null)
    
    const [textAlert, setTextAlert] = useState('')
    
    const [filtrosClasificacion, setFiltrosClasificacion] = useState({
        materias: [],
        unidades: [],
        modulos: [],
        contenidos: [],
        temas: [],
        conceptos: [],
     })
     const [filtrosHabilidades, setFiltrosHabilidades] = useState({
        recordar: 0,
        comprender: 0,
        aplicar: 0,
        analizar: 0,
        evaluar: 0,
        crear: 0
     })

    /**** Variables para paginación *****/
    const [pagina_actual, setPaginaActual] = useState(1)
    const [resultados_por_pagina, setResultadosPorPagina] = useState(4)

    const indice_ultimo_resultado = pagina_actual * resultados_por_pagina
    const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina
    const resultados_pagina = preguntas_ring.slice(indice_primer_resultado, indice_ultimo_resultado)
    /*************************************/

    const getCantidadPreguntasRing = async () =>{
        try{
            const resp = await clienteAxios.get('/api/ring-preguntas/count/preguntas',{
                params: {
                    codigo_ring: ring.codigo
                }
            })
            setCantPreguntasRing(resp.data.cantPreguntasRing)
        }catch(e){
            handleError(e)
        }
    }
    
    const handleClickBuscarPreguntas = async () => {
        try{
            const resp = await clienteAxios.get('/api/preguntas/listar/ring', {
                    params: {
                        codigo_ring: ring.codigo,
                        materias: filtrosClasificacion.materias,
                        unidades: filtrosClasificacion.unidades,
                        modulos: filtrosClasificacion.modulos,
                        contenidos: filtrosClasificacion.contenidos,
                        temas: filtrosClasificacion.temas,
                        conceptos: filtrosClasificacion.conceptos,
                        recordar: filtrosHabilidades.recordar, 
                        comprender: filtrosHabilidades.comprender,
                        aplicar: filtrosHabilidades.aplicar, 
                        analizar: filtrosHabilidades.analizar, 
                        evaluar: filtrosHabilidades.evaluar, 
                        crear: filtrosHabilidades.crear,
                        page: 1, 
                        limit: 1, 
                    }
            })

            getCantidadPreguntasRing()
            //Si no hay preguntas, mostrar un mensajillo.
            if(resp.data.preguntas.length > 0){
                setTextAlert("")
            }else{
                setTextAlert("No se encontraron resultados")
            }
            setPreguntasRing(resp.data.preguntas)
            setPaginaActual(1)

        }catch(e){
            handleError(e)
        }
    }

    const handleAgregarPreguntaRing = async codigo =>  {
        
        try{

            const resp = await clienteAxios.post('/api/ring-preguntas/crear',{
                codigo_ring: ring.codigo,
                codigo_pregunta: codigo,
                puntos_factor: ring.puntos_factor,
                puntos_respuesta_correcta: ring.puntos_respuesta_correcta, 
                puntos_respuesta_incorrecta: ring.puntos_respuesta_incorrecta, 
                puntos_respuesta_omitida: ring.puntos_respuesta_omitida, 
                puntos_respuesta_timeout: ring.puntos_respuesta_timeout 
            })

            setCantPreguntasRing(resp.data.cantPreguntasRing)
            toast.success('Pregunta agregada al ring.', {containerId: 'sys_msg'})

            const new_preguntas_ring = preguntas_ring.map(pregunta_ring => {  
              
                if(pregunta_ring.codigo === codigo){
                    return {
                        ...pregunta_ring,
                        ring_pregunta:  [resp.data.ring_pregunta],
                    }
                }else{
                    return pregunta_ring
                }
            })
            setPreguntasRing(new_preguntas_ring)
            
            
        }catch(e){
            handleError(e)
        }
    }

    const handleQuitarPreguntaRing = async codigo =>  {
        
        try{
            
            const resp = await clienteAxios.delete(`/api/ring-preguntas/eliminar/${ring.codigo}/${codigo}`)

            setCantPreguntasRing(resp.data.cantPreguntasRing)

            const new_preguntas_ring = preguntas_ring.map(pregunta_ring => {  
              
                if(pregunta_ring.codigo === codigo){
                    return {
                        ...pregunta_ring,
                        ring_pregunta: [],
                    }
                }else{
                    return pregunta_ring
                }
            })
            setPreguntasRing(new_preguntas_ring)
            toast.success('Pregunta quitada del ring.', {containerId: 'sys_msg'})

        }catch(e){
            handleError(e)
        }
    }

    const handleAgregarQuitarPreguntasRingMasivo = async resultados_pagina => {
        
        let ring_preguntas_add = []
        resultados_pagina.forEach(resultado_pagina => {
            if(resultado_pagina.ring_pregunta.length === 0){
                ring_preguntas_add.push({
                    codigo_pregunta: resultado_pagina.codigo,
                    codigo_ring: ring.codigo,
                    puntos_respuesta_correcta: ring.puntos_respuesta_correcta, 
                    puntos_respuesta_incorrecta: ring.puntos_respuesta_incorrecta, 
                    puntos_respuesta_omitida: ring.puntos_respuesta_omitida, 
                    puntos_respuesta_timeout: ring.puntos_respuesta_timeout
                })
            }
        })
       
        if(ring_preguntas_add.length > 0){
            
            try{
                const resp = await clienteAxios.post('/api/ring-preguntas/crear/masivo',{ring_preguntas_add})
                
                setCantPreguntasRing(resp.data.cantPreguntasRing)

                let new_preguntas_ring = [...preguntas_ring]

                for(let ring_pregunta of ring_preguntas_add){

                    new_preguntas_ring = new_preguntas_ring.map(pregunta_ring => {  
                        if(pregunta_ring.codigo === ring_pregunta.codigo_pregunta){
                            return {
                                ...pregunta_ring,
                                ring_pregunta: [ring_pregunta],
                            }
                        }else{
                            return pregunta_ring
                        }
                    })
                }
                setPreguntasRing(new_preguntas_ring)
                
            }catch(e){
                handleError(e)
            }

        }else{
            
            try{

                let ring_preguntas_del = []
                resultados_pagina.forEach(resultado_pagina => {
                    ring_preguntas_del.push({
                        codigo_pregunta: resultado_pagina.codigo,
                        codigo_ring: ring.codigo
                    })
                })

                const resp = await clienteAxios.delete('/api/ring-preguntas/eliminar/masivo',{
                    params: {
                        ring_preguntas_del
                    }
                })

                setCantPreguntasRing(resp.data.cantPreguntasRing)

                let new_preguntas_ring = [...preguntas_ring]

                for(let ring_pregunta of ring_preguntas_del){
                    new_preguntas_ring = new_preguntas_ring.map(pregunta_ring => {  
                        if(pregunta_ring.codigo === ring_pregunta.codigo_pregunta){
                            return {
                                ...pregunta_ring,
                                ring_pregunta: [],
                            }
                        }else{
                            return pregunta_ring
                        }
                    })
                }

                setPreguntasRing(new_preguntas_ring)

            }catch(e){
                handleError(e)
            }

        }

    }

    const handleSetPaginaActual = numero_pagina => {
        setPaginaActual(numero_pagina)
    }

    const handleShowPreguntaInfo = pregunta => {
        setPregunta(pregunta)
    } 

    const handleClosePreguntaInfo = () => {
        setPregunta(null)
    }    

    const handleFiltrosClasificacion = value => {
        setFiltrosClasificacion(value)
    }
  
    const handleFiltrosHabilidades = value => {
        setFiltrosHabilidades(value)
    }
    
    return (
        <Container>
            {pregunta 
            ?   
                <>
                <Alert
                    variant="info"
                >
                    <Row>
                        <Col>
                            <h5>Detalle Pregunta</h5>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <Button
                                variant={"info"}
                                size={"sm"}
                                onClick={handleClosePreguntaInfo}
                            >Volver</Button>
                        </Col>
                    </Row>
                </Alert>
                <PreguntaInfo
                    pregunta={pregunta}
                />
                </>
            :
                <>  
                
                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                    <Tab eventKey="agregarPreguntas" title="Agregar Preguntas">
                    <Accordion defaultActiveKey="0">
                            <Card>
                                <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                        Mostrar u ocultar filtros...
                                </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>
                                        <Row>
                                            <Col>
                                                <h6 className="text-muted">Clasificación</h6>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <FiltrosBusquedaClasificacionPregunta
                                                    handleClasificacion={handleFiltrosClasificacion}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mt-3">
                                            <Col>
                                                <h6 className="text-muted">Habilidades</h6>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <FiltrosBusquedaHabilidadesPregunta
                                                    handleHabilidades={handleFiltrosHabilidades}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mt-3"> 
                                            <Col className="d-flex justify-content-end">
                                                <Button
                                                    variant="info"
                                                    onClick={handleClickBuscarPreguntas}
                                                >
                                                    Buscar
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                        
                        <Row className="mx-0 mb-5">
                            {preguntas_ring.length > 0
                            ?
                            <Col className="mt-4 d-flex flex-column">
                                <div className="align-self-end">
                                        <h5>
                                            <Badge variant="info">
                                                {`Preguntas Ring ${cantPreguntasRing}`}
                                            </Badge>
                                        </h5>    
                                </div>
                                <div className="align-self-end">
                                    <Paginador
                                        resultados_por_pagina = {resultados_por_pagina}
                                        total_resultados = {preguntas_ring.length}
                                        handleSetPaginaActual = {handleSetPaginaActual}
                                        pagina_activa = {pagina_actual}
                                    />
                                </div>
                                <TableRingPreguntas
                                    ring={ring}
                                    preguntas={resultados_pagina}
                                    pagina_actual = {pagina_actual}
                                    resultados_por_pagina = {resultados_por_pagina}
                                    handleAgregarPreguntaRing = {handleAgregarPreguntaRing}
                                    handleQuitarPreguntaRing = {handleQuitarPreguntaRing}
                                    handleAgregarQuitarPreguntasRingMasivo = {handleAgregarQuitarPreguntasRingMasivo}
                                    handleShowPreguntaInfo={handleShowPreguntaInfo}
                                /> 
                            </Col>
                            :
                            <Col className="mt-5">
                                <AlertText  
                                    text={textAlert}
                                /> 
                            </Col>
                            }   
                        </Row>
                    </Tab>
                    <Tab eventKey="preguntasInscritas" title="Preguntas Inscritas">
                        <TablePreguntasInscritasRing
                            ring={ring}
                        />
                    </Tab>
                </Tabs>
                </>
            }    
        </Container>
    )
}
