import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import clienteAxios from '../../config/axios';
import { handleError } from '../../helpers';


const TableCuestionarioMejores10 = ({codigo_cuestionario}) => {
    
    const [mejores10, setMejores10] = useState([])

    useEffect(() => {
        if(codigo_cuestionario !== '0'){
            getMejores10()
        }
    }, [codigo_cuestionario])

    const getMejores10 = async () => {
        
        try {
            
            const resp = await clienteAxios.get('/api/cuestionario-estadisticas/mejores-10', {
                params: {
                    codigo_cuestionario,
                }
            })

            setMejores10(resp.data.mejores10)

        } catch (e) {
            handleError(e)
        }

    }

    if (mejores10.length === 0) return null

    return ( 
        <>
        <h6 className="font-weight-bold text-muted">Mejores 10 puntajes</h6>
        <Table size="sm" striped borderless hover variant="info" responsive> 
            <thead>
                <tr>
                    <th></th>
                    <th><small className="font-weight-bold">Nombre</small></th>
                    <th><small className="font-weight-bold">Email</small></th>
                    <th className="text-center"><small className="font-weight-bold">Puntos</small></th>
                </tr>
            </thead>
            <tbody>
                {mejores10.map((usuario, index) =>{
                        
                    const {nombre, email, respuestas_correctas} = usuario
                    
                    return(
                        <tr key={index}>
                            <td><small>{index + 1}</small></td>
                            <td><small>{nombre}</small></td> 
                            <td><small>{email}</small></td>            
                            <td className="text-center"><small>{respuestas_correctas}</small></td>
                        </tr>
                    )
                })}                
            </tbody>
        </Table>
        </>
    )
}
 
export default TableCuestionarioMejores10;