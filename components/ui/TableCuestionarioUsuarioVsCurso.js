import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import clienteAxios from '../../config/axios';
import { handleError } from '../../helpers';


const TableCuestionarioUsuarioVsCurso = ({codigo_cuestionario}) => {
    
    const [puntajeUsuarios, setPuntajeUsuarios] = useState([])
    const [promedioCurso, setPromedioCurso] = useState({
        total_alumnos: 0, 
        total_preguntas: 0,
        correctas_curso_cant: 0, 
        correctas_curso_porcent: 0,
        incorrectas_curso_cant: 0, 
        incorrectas_curso_porcent: 0,
        omitidas_curso_cant: 0, 
        omitidas_curso_porcent: 0,
    })

    const {
        total_alumnos, total_preguntas,
        correctas_curso_cant, correctas_curso_porcent,
        incorrectas_curso_cant, incorrectas_curso_porcent,
        omitidas_curso_cant, omitidas_curso_porcent,
    } = promedioCurso

    useEffect(() => {
        if(codigo_cuestionario !== '0'){
            getUsuarioVsCurso()
        }
    }, [codigo_cuestionario])

    const getUsuarioVsCurso = async () => {
        
        try {
            
            const resp = await clienteAxios.get('/api/cuestionario-estadisticas/usuario-vs-curso', {
                params: {
                    codigo_cuestionario,
                }
            })
            setPuntajeUsuarios(resp.data.puntajeUsuarios)
            setPromedioCurso(resp.data.promedioCurso)

        } catch (e) {
            handleError(e)
        }

    }

    if (puntajeUsuarios.length === 0) return null

    return ( 
        <>
        <h6 className="font-weight-bold text-muted">Puntajes usuarios vs curso</h6>
        <Table size="sm" striped borderless hover variant="secondary" responsive> 
            <thead>
                <tr>
                    <th colSpan={6} className="">
                        <small className="font-weight-bold d-flex justify-content-center text-info">Promedio curso</small>
                    </th>
                </tr>
                <tr>
                    <th className="text-center"><small className="font-weight-bold">Respuestas correctas</small></th>
                    <th className="text-center"><small className="font-weight-bold">%</small></th>
                    <th className="text-center"><small className="font-weight-bold">Incorrectas</small></th>
                    <th className="text-center"><small className="font-weight-bold">%</small></th>
                    <th className="text-center"><small className="font-weight-bold">Omitidas</small></th>
                    <th className="text-center"><small className="font-weight-bold">%</small></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td className="text-center"><small>{correctas_curso_cant}</small></td>
                <td className="text-center"><small>{correctas_curso_porcent}</small></td>
                <td className="text-center"><small>{incorrectas_curso_cant}</small></td>
                <td className="text-center"><small>{incorrectas_curso_porcent}</small></td>
                <td className="text-center"><small>{omitidas_curso_cant}</small></td>
                <td className="text-center"><small>{omitidas_curso_porcent}</small></td>
                </tr>
            </tbody>
        </Table>
        <Table size="sm" striped borderless hover variant="secondary" responsive> 
            <thead>
                <tr>
                    <th colSpan={9} className="">
                        <small className="font-weight-bold d-flex justify-content-center text-info">Alumnos</small>
                    </th>
                </tr>
                <tr>
                    <th></th>
                    <th><small className="font-weight-bold">Nombre</small></th>
                    <th><small className="font-weight-bold">Email</small></th>
                    <th className="text-center"><small className="font-weight-bold">Respuestas correctas</small></th>
                    <th className="text-center"><small className="font-weight-bold">%</small></th>
                    <th className="text-center"><small className="font-weight-bold">Incorrectas</small></th>
                    <th className="text-center"><small className="font-weight-bold">%</small></th>
                    <th className="text-center"><small className="font-weight-bold">Omitidas</small></th>
                    <th className="text-center"><small className="font-weight-bold">%</small></th>
                </tr>
            </thead>
            <tbody>
                {puntajeUsuarios.map((usuario, index) =>{
                        
                    const {nombre, email, 
                            correctas_alumno_cant, correctas_alumno_porcent,
                            incorrectas_alumno_cant, incorrectas_alumno_porcent,
                            omitidas_alumno_cant, omitidas_alumno_porcent,
                        } = usuario
                    
                    return(
                        <tr key={index}>
                            <td><small>{index + 1}</small></td>
                            <td><small>{nombre}</small></td> 
                            <td><small>{email}</small></td>            
                            <td className="text-center"><small>{correctas_alumno_cant}</small></td>
                            <td className="text-center"><small>{correctas_alumno_porcent}</small></td>
                            <td className="text-center"><small>{incorrectas_alumno_cant}</small></td>
                            <td className="text-center"><small>{incorrectas_alumno_porcent}</small></td>
                            <td className="text-center"><small>{omitidas_alumno_cant}</small></td>
                            <td className="text-center"><small>{omitidas_alumno_porcent}</small></td>
                        </tr>
                    )
                })}                
            </tbody>
        </Table>
        </>
    )
}
 
export default TableCuestionarioUsuarioVsCurso;