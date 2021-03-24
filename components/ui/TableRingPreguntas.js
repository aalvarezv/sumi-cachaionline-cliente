import React, {useState} from 'react'
import { Table, Image, Button } from 'react-bootstrap'
import {getNumeroFilaTabla} from '../../helpers'
import ModalPreguntaInfo from './ModalPreguntaInfo'

const TableRingPreguntas = ({
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
                    <th className="d-flex justify-content-center">
                        <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleAgregarQuitarPreguntasRingMasivo(preguntas)}
                        >
                            Todas
                        </Button>
                    </th>
                    <th>#</th>
                    <th>Multimedia</th>
                    <th>Creador</th>
                    <th>Creada</th>
                    </tr>
                </thead>
                <tbody>
                    {preguntas.map((pregunta, index) => {
                            
                        const { codigo, imagen, audio, video, usuario, 
                                createdAt, updatedAt, ring_pregunta} = pregunta
                        let numFila = getNumeroFilaTabla(index, pagina_actual, resultados_por_pagina)
                        return (
                        <tr
                            key={codigo}
                        >   
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
                                <Button
                                    variant={"info"}
                                    size="sm"
                                    onClick={() => handleQuitarPreguntaRing(codigo)}
                                >
                                    &#10003;
                                </Button>
                            }
                            </td>
                            <td>{numFila}</td>
                            <td>
                                {imagen.trim() !== '' &&
                                    <Image 
                                        src={imagen} 
                                        style={{width: 150, cursor: 'pointer'}} 
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
                            
                        </tr>
                        )
                    })}
                </tbody>
            </Table>
        </>
     )
}
 
export default TableRingPreguntas