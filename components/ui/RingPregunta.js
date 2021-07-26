import React, { useState } from 'react'
import { Alert, Container, Row, Col, Badge, Form, Button } from 'react-bootstrap'
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


export const RingPregunta = ({ring}) => {

    const [preguntas_ring, setPreguntasRing] = useState([])
    const [cantPreguntasRing, setCantPreguntasRing] = useState(0)
   
    const [pregunta, setPregunta] = useState(null)
    
    const [textAlert, setTextAlert] = useState('')
    const [filtros, setFiltros] = useState({
        codigo_materia: '0',
        codigo_unidad: '0',
        codigo_modulo: '0',
        codigo_modulo_contenido: '0',
        codigo_modulo_contenido_tema: '0',
        codigo_modulo_contenido_tema_concepto: '0',
        nombre_usuario_creador: ''
    })

    const { codigo_materia, codigo_unidad, codigo_modulo, codigo_modulo_contenido,
        codigo_modulo_contenido_tema, codigo_modulo_contenido_tema_concepto,
        nombre_usuario_creador } = filtros

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
                        codigo_materia: filtros.codigo_materia,
                        codigo_unidad: filtros.codigo_unidad,
                        codigo_modulo: filtros.codigo_modulo,
                        codigo_modulo_contenido: filtros.codigo_modulo_contenido,
                        codigo_modulo_contenido_tema: filtros.codigo_modulo_contenido_tema,
                        codigo_modulo_contenido_tema_concepto: filtros.codigo_modulo_contenido_tema_concepto,
                        nombre_usuario_creador: filtros.nombre_usuario_creador,
                        codigo_ring: ring.codigo,
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
                <Row> 
                    <Col className="font-weight-bold mb-2 ml-3">
                        <h5>Filtros de búsqueda preguntas</h5>
                    </Col>
                </Row> 
                <Row className="d-flex justify-content-center">
                    <Col className="mb-2 mb-lg-0" xs={12} lg={10}>
                        <Row className="mb-2">
                            <Col className="mb-2 mb-lg-0" xs={12} lg={6}>
                                <InputSelectMateria
                                id="codigo_materia"
                                name="codigo_materia"
                                as="select"
                                size="sm"
                                label="TODAS LAS MATERIAS"
                                value={codigo_materia}
                                onChange={e => setFiltros({
                                        ...filtros,
                                        codigo_unidad: '0',
                                        codigo_modulo: '0',
                                        codigo_modulo_contenido: '0',
                                        codigo_modulo_contenido_tema: '0',
                                        codigo_modulo_contenido_tema_concepto: '0',
                                        [e.target.name]: e.target.value,
                                })}
                                />
                            </Col>
                            <Col>
                                <InputSelectUnidadesMateria
                                id="codigo_unidad"
                                name="codigo_unidad"
                                /*codigo materia se le pasa a las props del componente
                                para filtrar las unidades de la materia seleccionada.*/
                                codigo_materia= {codigo_materia}
                                as="select"
                                size="sm"
                                label="TODAS LAS UNIDADES"
                                value={codigo_unidad}
                                onChange={e => setFiltros({
                                        ...filtros,
                                        codigo_modulo: '0',
                                        codigo_modulo_contenido: '0',
                                        codigo_modulo_contenido_tema: '0',
                                        codigo_modulo_contenido_tema_concepto: '0',
                                        [e.target.name]: e.target.value,
                                })}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col className="mb-2 mb-lg-0" xs={12} lg={6}>
                                <InputSelectModulosUnidad
                                id="codigo_modulo"
                                name="codigo_modulo"
                                /*codigo unidad se le pasa a las props del componente
                                para filtrar los modulos de la unidad seleccionada.*/
                                codigo_unidad= {codigo_unidad}
                                as="select"
                                size="sm"
                                label="TODOS LOS MÓDULOS"
                                value={codigo_modulo}
                                onChange={e => setFiltros({
                                        ...filtros,
                                        codigo_modulo_contenido: '0',
                                        codigo_modulo_contenido_tema: '0',
                                        codigo_modulo_contenido_tema_concepto: '0',
                                        [e.target.name]: e.target.value
                                })}
                                /> 
                            </Col>
                            <Col>
                                <InputSelectModulosContenido
                                    id="codigo_modulo_contenido"
                                    name="codigo_modulo_contenido"
                                    
                                    /*codigo modulo se le pasa a las props del componente
                                    para filtrar las propiedades del modulo seleccionado.*/
                                    codigo_modulo={codigo_modulo}
                                    as="select"
                                    size="sm"
                                    label="TODOS LOS CONTENIDOS"
                                    value={codigo_modulo_contenido}
                                    onChange={e => setFiltros({
                                            ...filtros,
                                            codigo_modulo_contenido_tema: '0',
                                            codigo_modulo_contenido_tema_concepto: '0',
                                            [e.target.name]: e.target.value
                                    })}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col className="mb-2 mb-lg-0" xs={12} lg={6}>
                                <InputSelectModulosContenidoTema
                                    id="codigo_modulo_contenido_tema"
                                    name="codigo_modulo_contenido_tema"
                                    
                                    /*codigo contenido se le pasa a las props del componente
                                    para filtrar las propiedades del modulo seleccionado.*/
                                    codigo_modulo_contenido={codigo_modulo_contenido}
                                    as="select"
                                    size="sm"
                                    label="TODOS LOS TEMAS"
                                    value={codigo_modulo_contenido_tema}
                                    onChange={e => setFiltros({
                                            ...filtros,
                                            codigo_modulo_contenido_tema_concepto: '0',
                                            [e.target.name]: e.target.value
                                    })}
                                />
                            </Col>
                            <Col>
                                <InputSelectModulosContenidoTemaConcepto
                                    id="codigo_modulo_contenido_tema_concepto"
                                    name="codigo_modulo_contenido_tema_concepto"

                                    /*codigo contenido se le pasa a las props del componente
                                    para filtrar las propiedades del modulo seleccionado.*/
                                    codigo_modulo_contenido_tema={codigo_modulo_contenido_tema}
                                    as="select"
                                    size="sm"
                                    label="TODOS LOS CONCEPTOS"
                                    value={codigo_modulo_contenido_tema_concepto}
                                    onChange={e => setFiltros({
                                    ...filtros,
                                    [e.target.name]: e.target.value
                                    })}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Control
                                    id="nombre_usuario_creador"
                                    name="nombre_usuario_creador"
                                    type="text" 
                                    size="sm"
                                    placeholder="CREADA POR USUARIO..." 
                                    value={nombre_usuario_creador}
                                    onChange={e => {
                                        setFiltros({
                                                ...filtros,
                                                [e.target.name]: e.target.value
                                        })
                                    }} 
                                />
                            </Col>
                        </Row>
                    </Col>  
                    <Col className="d-flex align-items-end mb-2 mb-lg-0" xs={12} lg="auto">
                        <Button
                            variant="info"
                            className="align-self-end"
                            onClick={handleClickBuscarPreguntas}
                            block
                        >
                            Buscar
                        </Button>
                    </Col>
                </Row>
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
                </>
            }    
        </Container>
    )
}
