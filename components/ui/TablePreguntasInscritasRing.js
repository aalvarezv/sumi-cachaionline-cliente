import React, { useState, useEffect } from 'react'
import { Alert, Table, Image, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'

 
const TablePreguntasInscritasRing = ({ring}) => {

    
    const [ preguntasInscritasRing, setPreguntasInscritasRing] = useState([])

    const codigoRing = ring.codigo
    console.log(codigoRing)
    useEffect(() => {

        const listarUnidadesMineducNivelAcademico = async () => {
            try{
                const resp = await clienteAxios.get('/api/ring-preguntas/listar/preguntas/ring',{
                    params:{
                        codigo_ring: codigoRing
                    }
                })
                setPreguntasInscritasRing(resp.data.preguntas)
            }catch(e){
                handleError(e)
            }
        }
        listarUnidadesMineducNivelAcademico()
    }, )

    const handleQuitarPreguntaRing = async codigo =>  {
        
        try{
            
            const resp = await clienteAxios.delete(`/api/ring-preguntas/eliminar/${codigoRing}/${codigo}`)
            toast.success('Pregunta quitada del ring.', {containerId: 'sys_msg'})

        }catch(e){
            handleError(e)
        }
    }

    return ( 
        <>
            <Table striped bordered hover variant="light" responsive>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Imagen</th>
                    <th><small>Creador</small></th>
                    <th><small>Creada</small></th>
                    <th className="text-center"><small>Quitar</small></th>
                    </tr>
                </thead>
                <tbody>
                    {preguntasInscritasRing.map((preguntaInscrita, index) => {
                            
                        const { codigo_pregunta, pregunta} = preguntaInscrita
                               
                        /* let numFila = getNumeroFilaTabla(index, pagina_actual, resultados_por_pagina) */
                        return (
                        <tr
                            key={codigo_pregunta}
                        >   
                             <td>{index+1}</td>
                            <td>
                                {pregunta.imagen.trim() !== '' 
                                ?
                                    <Image 
                                        src={pregunta.imagen} 
                                        style={{width: 150, cursor: 'pointer', background: 'black'}} 
                                        /* onClick={() => handleShowPreguntaInfo(pregunta)} */
                                        thumbnail
                                    />
                                :
                                    null
                                }
                            </td>
                            <td>{pregunta.rut_usuario_creador}</td>
                            <td><small>{pregunta.createdAt}</small></td>
                            
                            <td className="text-center">
                                    <>
                                            <Button
                                                variant={"danger"}
                                                size="sm"
                                                className="mr-3"
                                                onClick={() => handleQuitarPreguntaRing(codigo_pregunta)}
                                            >
                                                &#10003;
                                            </Button>
                                    </>
                            </td>
                        </tr>
                        )
                    })}
                </tbody>
            </Table>
        </>
     )
}
 
export default TablePreguntasInscritasRing