import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import clienteAxios from '../../config/axios';
import { handleError } from '../../helpers';


const TableCuestionarioPeores10 = ({codigo_cuestionario}) => {
    
    const [peores10, setPeores10] = useState([])

    useEffect(() => {
        if(codigo_cuestionario !== '0'){
            getPeores10()
        }
    }, [codigo_cuestionario])

    const getPeores10 = async () => {
        
        try {
            
            const resp = await clienteAxios.get('/api/cuestionario-estadisticas/peores-10', {
                params: {
                    codigo_cuestionario,
                }
            })

            setPeores10(resp.data.peores10)

        } catch (e) {
            handleError(e)
        }

    }

    if (peores10.length === 0) return null

    return ( 
        <>
        <h6 className="font-weight-bold text-muted">Peores 10 puntajes</h6>
        <Table size="sm" striped borderless hover variant="danger" responsive> 
            <thead>
                <tr>
                    <th></th>
                    <th><small className="font-weight-bold">Nombre</small></th>
                    <th><small className="font-weight-bold">Email</small></th>
                    <th className="text-center"><small className="font-weight-bold">Puntos</small></th>
                </tr>
            </thead>
            <tbody>
                {peores10.map((usuario, index) =>{
                        
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
 
export default TableCuestionarioPeores10;