import React, { useEffect, useState } from 'react';
import { Badge, Table } from 'react-bootstrap';
import clienteAxios from '../../config/axios';
import { handleError } from '../../helpers';


const TableCuestionarioPreguntasEstaditica = ({codigo_cuestionario}) => {
    
    const [preguntas, setPreguntas] = useState([])

    useEffect(() => {
        if(codigo_cuestionario !== '0'){
            getPreguntas()
        }
    }, [codigo_cuestionario])

    const getPreguntas = async () => {
        
        try {
            
            const resp = await clienteAxios.get('/api/cuestionario-estadisticas/estadistica-preguntas', {
                params: {
                    codigo_cuestionario,
                }
            })
            setPreguntas(resp.data.estadisticaPreguntas)

        } catch (e) {
            handleError(e)
        }

    }

    if (preguntas.length === 0) return null

    return ( 
        <>
        <h6 className="font-weight-bold text-muted">Estadística preguntas</h6>
        <Table size="sm" striped borderless hover variant="light" responsive> 
            <thead>
                <tr>
                    <th><small className="font-weight-bold">Nº pregunta</small></th>
                    <th className="text-center"><small className="font-weight-bold">Aciertos</small></th>
                    <th className="text-center"><small className="font-weight-bold">Omisiones</small></th>
                    <th className="text-center"><small className="font-weight-bold">Errores</small></th>
                </tr>
            </thead>
            <tbody>
                {preguntas.map((pregunta, index) =>{
                        
                    const {codigo_pregunta, correctas_porcent, incorrectas_porcent, omitidas_porcent} = pregunta
                    
                    return(
                        <tr key={index}>
                            <td>
                                <Badge 
                                    variant={ 
                                      (correctas_porcent > incorrectas_porcent && correctas_porcent > omitidas_porcent)
                                      ? "success"
                                      : (incorrectas_porcent > correctas_porcent && incorrectas_porcent > omitidas_porcent)
                                        ? "danger"
                                        : (omitidas_porcent > correctas_porcent && omitidas_porcent > incorrectas_porcent )
                                        ? "warning"
                                        : "secondary" 
                                    }
                                >
                                    {codigo_pregunta}
                                </Badge>
                            </td>    
                            <td className="text-center"><small>{correctas_porcent}%</small></td>
                            <td className="text-center"><small>{omitidas_porcent}%</small></td>    
                            <td className="text-center"><small>{incorrectas_porcent}%</small></td>
                        </tr>
                    )
                })}                
            </tbody>
        </Table>
        </>
    )
}
 
export default TableCuestionarioPreguntasEstaditica;