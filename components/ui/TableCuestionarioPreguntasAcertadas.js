import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import clienteAxios from '../../config/axios';
import { handleError } from '../../helpers';


const TableCuestionarioPreguntasAcertadas = ({codigo_cuestionario}) => {
    
    const [preguntasAcertadas, setPreguntasAcertadas] = useState([])

    useEffect(() => {
        if(codigo_cuestionario !== '0'){
            getPreguntasAcertadas()
        }
    }, [codigo_cuestionario])

    const getPreguntasAcertadas = async () => {
        
        try {
            
            const resp = await clienteAxios.get('/api/cuestionario-estadisticas/preguntas-acertadas', {
                params: {
                    codigo_cuestionario,
                }
            })
            setPreguntasAcertadas(resp.data.preguntasAcertadas)

        } catch (e) {
            handleError(e)
        }

    }

    if (preguntasAcertadas.length === 0) return null

    return ( 
        <>
        <h6 className="font-weight-bold text-muted">Top 10 preguntas acertadas</h6>
        <Table size="sm" striped borderless hover variant="info" responsive> 
            <thead>
                <tr>
                    <th>#</th>
                    <th><small className="font-weight-bold">Código</small></th>
                    <th className="text-center"><small className="font-weight-bold">Aciertos</small></th>
                </tr>
            </thead>
            <tbody>
                {preguntasAcertadas.map((pregunta, index) =>{
                        
                    const {codigo_pregunta, correctas} = pregunta
                    
                    return(
                        <tr key={index}>
                            <td><small>{index + 1}</small></td>
                            <td><small>{codigo_pregunta}</small></td>        
                            <td className="text-center"><small>{correctas}</small></td>
                        </tr>
                    )
                })}                
            </tbody>
        </Table>
        </>
    )
}
 
export default TableCuestionarioPreguntasAcertadas;