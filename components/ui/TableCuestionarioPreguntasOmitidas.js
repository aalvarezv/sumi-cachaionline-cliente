import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import clienteAxios from '../../config/axios';
import { handleError } from '../../helpers';


const TableCuestionarioPreguntasOmitidas = ({codigo_cuestionario}) => {
    
    const [preguntasOmitidas, setPreguntasOmitidas] = useState([])

    useEffect(() => {
        if(codigo_cuestionario !== '0'){
            getPreguntasOmitidas()
        }
    }, [codigo_cuestionario])

    const getPreguntasOmitidas = async () => {
        
        try {
            
            const resp = await clienteAxios.get('/api/cuestionario-estadisticas/preguntas-omitidas', {
                params: {
                    codigo_cuestionario,
                }
            })
            setPreguntasOmitidas(resp.data.preguntasOmitidas)

        } catch (e) {
            handleError(e)
        }

    }

    if (preguntasOmitidas.length === 0) return null

    return ( 
        <>
        <h6 className="font-weight-bold text-muted">Top 10 preguntas omitidas</h6>
        <Table size="sm" striped borderless hover variant="warning" responsive> 
            <thead>
                <tr>
                    <th>#</th>
                    <th><small className="font-weight-bold">Código pregunta</small></th>
                    <th className="text-center"><small className="font-weight-bold">Omisiones</small></th>
                </tr>
            </thead>
            <tbody>
                {preguntasOmitidas.map((pregunta, index) =>{
                        
                    const {codigo_pregunta, omitidas} = pregunta
                    
                    return(
                        <tr key={index}>
                            <td><small>{index + 1}</small></td>
                            <td><small>{codigo_pregunta}</small></td>        
                            <td className="text-center"><small>{omitidas}</small></td>
                        </tr>
                    )
                })}                
            </tbody>
        </Table>
        </>
    )
}
 
export default TableCuestionarioPreguntasOmitidas;