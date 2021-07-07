import React, { useState } from 'react'
import { Button, Form, Popover, OverlayTrigger } from 'react-bootstrap'
import { toast } from 'react-toastify'
import clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'


const PopOverPuntajesPregunta = ({ring, pregunta}) => {

    const [show, setShow] = useState(false)
    const [puntajes, setPuntajes] = useState({
        puntos_respuesta_correcta: 0,
        puntos_respuesta_incorrecta: 0,
        puntos_respuesta_omitida: 0,
        puntos_respuesta_timeout: 0,
    })

    const {
        puntos_respuesta_correcta, 
        puntos_respuesta_incorrecta, 
        puntos_respuesta_omitida, 
        puntos_respuesta_timeout 
    } = puntajes
    
    const handleConfigurarPuntaje = async () => {

        try{
        
            if(!show){

                const resp = await clienteAxios.get('/api/ring-preguntas/puntajes-pregunta',{
                    params: {
                        codigo_ring: ring.codigo,
                        codigo_pregunta: pregunta.codigo
                    }
                })

                const { puntajesPreguntaRing } = resp.data

                setPuntajes({
                    puntos_respuesta_correcta: puntajesPreguntaRing.puntos_respuesta_correcta,
                    puntos_respuesta_incorrecta: puntajesPreguntaRing.puntos_respuesta_incorrecta,
                    puntos_respuesta_omitida: puntajesPreguntaRing.puntos_respuesta_omitida,
                    puntos_respuesta_timeout: puntajesPreguntaRing.puntos_respuesta_timeout,
                })

            }

            setShow(!show)
            
        }catch(e){
            handleError(e)
        }
    
    }

    const handleAplicarPuntaje = async () => {

        try{

            const resp = await clienteAxios.put('/api/ring-preguntas/puntajes-pregunta', {
                codigo_ring: ring.codigo,
                codigo_pregunta: pregunta.codigo,
                puntos_respuesta_correcta, 
                puntos_respuesta_incorrecta, 
                puntos_respuesta_omitida, 
                puntos_respuesta_timeout,
            })

            setShow(false)

            toast.dark('Puntaje aplicado a la pregunta', {containerId: 'sys_msg'})

        }catch(e){
            handleError(e)
        }

    }

    return (  

        <OverlayTrigger
            trigger="click"
            key={"bottom"}
            placement={"bottom"}
            show={show}
            overlay={
                <Popover id={`popover-positioned-${"bottom"}`}>
                <Popover.Title as="h3">Configurar Puntajes</Popover.Title>
                <Popover.Content>
                        <Form.Label>Respuesta correcta</Form.Label>
                        <Form.Control
                            id="puntos_respuesta_correcta"
                            name="puntos_respuesta_correcta"
                            type="number" 
                            size="sm"
                            value={puntos_respuesta_correcta}
                            onChange={e => {
                                setPuntajes({
                                    ...puntajes,
                                    [e.target.name]: e.target.value
                                })
                            }}
                        />
                        <Form.Label>Respuesta incorrecta</Form.Label>
                        <Form.Control
                            id="puntos_respuesta_incorrecta"
                            name="puntos_respuesta_incorrecta"
                            type="number" 
                            size="sm"
                            value={puntos_respuesta_incorrecta}
                            onChange={e => {
                                setPuntajes({
                                    ...puntajes,
                                    [e.target.name]: e.target.value
                                })
                            }}
                        />
                        <Form.Label>Pregunta omitida</Form.Label>
                        <Form.Control
                            id="puntos_respuesta_omitida"
                            name="puntos_respuesta_omitida"
                            type="number" 
                            size="sm"
                            value={puntos_respuesta_omitida}
                            onChange={e => {
                                setPuntajes({
                                    ...puntajes,
                                    [e.target.name]: e.target.value
                                })
                            }}
                        />
                        <Form.Label>Fuera de tiempo</Form.Label>
                        <Form.Control
                            id="puntos_respuesta_timeout"
                            name="puntos_respuesta_timeout"
                            type="number" 
                            size="sm"
                            value={puntos_respuesta_timeout}
                            onChange={e => {
                                setPuntajes({
                                    ...puntajes,
                                    [e.target.name]: e.target.value
                                })
                            }}
                        />
                        <Button 
                            variant="info" 
                            size="sm"
                            className="btn-block my-2"
                            onClick={handleAplicarPuntaje}
                        >Aplicar</Button>
                </Popover.Content>
                </Popover>
            }
            >
        <Button 
            variant="secondary" 
            size="sm"
            onClick={handleConfigurarPuntaje}
        >Configurar Puntaje</Button>
        </OverlayTrigger>
    );
}
 
export default PopOverPuntajesPregunta;














{/* <td>
                                <Form.Control
                                    id="puntos_respuesta_correcta"
                                    name="puntos_respuesta_correcta"
                                    type="number" 
                                    size="sm"
                                    value={ring_pregunta.length > 0 ? ring_pregunta[0].puntos_respuesta_correcta : 0}
                                    onChange={e => handleAddPuntajePregunta(e, codigo)}
                                    // onChange={e => {setFormulario({
                                    //         ...formulario,
                                    //         [e.target.name]: e.target.value
                                    //     })
                                    // }}
                                />
                            </td>
                            <td>
                                <Form.Control
                                    id="puntos_respuesta_incorrecta"
                                    name="puntos_respuesta_incorrecta"
                                    type="number" 
                                    size="sm"
                                    value={ring_pregunta.length > 0 ? ring_pregunta[0].puntos_respuesta_incorrecta : 0}
                                    // onChange={e => {setFormulario({
                                    //         ...formulario,
                                    //         [e.target.name]: e.target.value
                                    //     })
                                    // }}
                                />
                            </td>
                            <td>
                                <Form.Control
                                    id="puntos_respuesta_omitida"
                                    name="puntos_respuesta_omitida"
                                    type="number" 
                                    size="sm"
                                    value={ring_pregunta.length > 0 ? ring_pregunta[0].puntos_respuesta_omitida : 0}
                                    // onChange={e => {setFormulario({
                                    //         ...formulario,
                                    //         [e.target.name]: e.target.value
                                    //     })
                                    // }}
                                />
                            </td>
                            <td>
                                <Form.Control
                                    id="puntos_respuesta_timeout"
                                    name="puntos_respuesta_timeout"
                                    type="number"
                                    size="sm" 
                                    value={ring_pregunta.length > 0 ? ring_pregunta[0].puntos_respuesta_timeout : 0}
                                    //value={ring_pregunta[0].puntos_respuesta_timeout}
                                    // onChange={e => {setFormulario({
                                    //         ...formulario,
                                    //         [e.target.name]: e.target.value
                                    //     })
                                    // }}
                                />
                            </td> */}