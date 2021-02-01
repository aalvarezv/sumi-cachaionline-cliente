import React from 'react'
import {Table} from 'react-bootstrap'

const ResultadosRing = ({respuestas}) => {
    
    return ( 
        <>
        <Table striped bordered hover variant="light" responsive size="sm">
        <thead>
            <tr>
                <th><small className="font-weight-bold">#</small></th>
                <th><small className="font-weight-bold">RESPUESTA</small></th>
                <th><small className="font-weight-bold">ALTERNATIVA CORRECTA</small></th>
                <th><small className="font-weight-bold">ESTADO</small></th>
            </tr>
        </thead>
        <tbody>
            {respuestas.map(respuesta => {
                const {numero_pregunta_actual, alternativa_select, 
                    alternativa_correcta, omitida} = respuesta
                return(
                <tr className={omitida ? 'table-warning' : ''}>
                    <td><small>{numero_pregunta_actual+1}</small></td>
                    <td><small>{alternativa_select}</small></td>
                    <td><small>{alternativa_correcta}</small></td>
                    <td><small>{omitida ? 'OMITIDA' : 'RESPONDIDA'}</small></td>
                </tr>
                )
            })}
            <tr className="table-info">
                <td colSpan="4" className="text-center font-weight-bold">RESUMEN PREGUNTAS</td>
            </tr>
            <tr className="table-info">
                <td colSpan="4" className="text-center"><small>{`TOTAL PREGUNTAS: ${respuestas.length}`}</small></td>
            </tr>
            <tr className="table-info">
                <td colSpan="4" className="text-center"><small>{`RESPONDIDAS: ${respuestas.filter(respuesta => !respuesta.omitida).length}`}</small></td>
            </tr>
            <tr className="table-warning">
                <td colSpan="4" className="text-center"><small>{`OMITIDAS: ${respuestas.filter(respuesta => respuesta.omitida).length}`}</small></td>
            </tr>
            <tr className="table-success"> 
                <td colSpan="4" className="text-center"><small>{`CORRECTAS: ${respuestas.filter(respuesta => respuesta.alternativa_select === respuesta.alternativa_correcta).length}`}</small></td>
            </tr>
            <tr className="table-danger">
                <td colSpan="4" className="text-center"><small>{`ERRONEAS: ${respuestas.filter(respuesta => respuesta.alternativa_select !== respuesta.alternativa_correcta && !respuesta.omitida).length}`}</small></td>
            </tr>
        </tbody>
        </Table>
        </>
     )
}
 
export default ResultadosRing