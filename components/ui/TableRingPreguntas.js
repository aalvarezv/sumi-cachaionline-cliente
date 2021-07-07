import React from 'react'
import { Table, Image, Button } from 'react-bootstrap'
import {getNumeroFilaTabla} from '../../helpers'
import PopOverPuntajesPregunta from './PopOverPuntajesPregunta'

 
 
const TableRingPreguntas = ({
        ring,
        preguntas, 
        pagina_actual, 
        resultados_por_pagina, 
        handleAgregarPreguntaRing, 
        handleQuitarPreguntaRing, 
        handleAgregarQuitarPreguntasRingMasivo,
        handleShowModalPreguntaInfo,
    }) => {


    return ( 
        <>
            <Table striped bordered hover variant="light" responsive>
                <thead>
                    <tr>
                    <th>#</th>
                    <th><small>Multimedia</small></th>
                    <th><small>Creador</small></th>
                    <th><small>Creada</small></th>
                    <th className="d-flex justify-content-center">
                        <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleAgregarQuitarPreguntasRingMasivo(preguntas)}
                        >
                            Todas
                        </Button>
                    </th>
                    </tr>
                </thead>
                <tbody>
                    {preguntas.map((pregunta, index) => {
                            
                        const { codigo, imagen, audio, video, usuario, 
                                createdAt, ring_pregunta} = pregunta
                               
                        let numFila = getNumeroFilaTabla(index, pagina_actual, resultados_por_pagina)
                        return (
                        <tr
                            key={codigo}
                        >   
                            <td>{numFila}</td>
                            <td>
                                {imagen.trim() !== '' &&
                                    <Image 
                                        src={imagen} 
                                        style={{width: 150, cursor: 'pointer', background: 'black'}} 
                                        onClick={() => handleShowModalPreguntaInfo(pregunta)}
                                        thumbnail
                                    />
                                }
                                {audio.trim() !== '' &&
                                    <audio 
                                        style={{width: 150, cursor: 'pointer'}}
                                        controls
                                    >
                                        <source src={audio.trim()} />
                                    </audio>
                                }
                                {video.trim() !== '' &&
                                    <video 
                                        style={{width: 150, cursor: 'pointer'}}
                                        controls
                                    >
                                        <source src={video.trim()} />
                                    </video>
                                }
                            </td>
                            <td>{usuario.nombre}</td>
                            <td><small>{createdAt}</small></td>
                            
                            <td className="text-center">
                                {ring_pregunta && ring_pregunta.length === 0
                                ?
                                    <Button
                                        variant={"outline-info"}
                                        size="sm"
                                        onClick={() => handleAgregarPreguntaRing(codigo)}
                                        >
                                        &#10003;
                                    </Button>
                                :
                                    <>
                                        
                                        <Button
                                            variant={"info"}
                                            size="sm"
                                            className="mr-3"
                                            onClick={() => handleQuitarPreguntaRing(codigo)}
                                        >
                                            &#10003;
                                        </Button>
                                        <PopOverPuntajesPregunta 
                                            ring={ring}
                                            pregunta={pregunta}
                                        />
                                    </>
                                }
                            </td>
                        </tr>
                        )
                    })}
                </tbody>
            </Table>
        </>
     )
}
 
export default TableRingPreguntas