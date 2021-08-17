import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import clienteAxios from '../../config/axios';
import { handleError } from '../../helpers';


const TableCuestionarioPreguntasErradas = ({codigo_cuestionario}) => {
    
    const [preguntasErradas, setPreguntasErradas] = useState([])

    useEffect(() => {
        if(codigo_cuestionario !== '0'){
            getPreguntasErradas()
        }
    }, [codigo_cuestionario])

    const getPreguntasErradas = async () => {
        
        try {
            
            const resp = await clienteAxios.get('/api/cuestionario-estadisticas/preguntas-erradas', {
                params: {
                    codigo_cuestionario,
                }
            })
            setPreguntasErradas(resp.data.preguntasErradas)

        } catch (e) {
            handleError(e)
        }

    }

    if (preguntasErradas.length === 0) return null

    return ( 
        <>
        <h6 className="font-weight-bold text-muted">Top 10 preguntas erradas</h6>
        <Table size="sm" striped borderless hover variant="danger" responsive> 
            <thead>
                <tr>
                    <th>#</th>
                    <th><small className="font-weight-bold">Código</small></th>
                    <th className="text-center"><small className="font-weight-bold">Errores</small></th>
                </tr>
            </thead>
            <tbody>
                {preguntasErradas.map((pregunta, index) =>{
                        
                    const {codigo_pregunta, incorrectas} = pregunta
                    
                    return(
                        <tr key={index}>
                            <td><small>{index + 1}</small></td>
                            <td><small>{codigo_pregunta}</small></td>        
                            <td className="text-center"><small>{incorrectas}</small></td>
                        </tr>
                    )
                })}                
            </tbody>
        </Table>
        </>
    )
}
 
export default TableCuestionarioPreguntasErradas;