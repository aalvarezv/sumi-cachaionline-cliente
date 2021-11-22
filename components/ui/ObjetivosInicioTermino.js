import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { AiFillAlert } from 'react-icons/ai';
import clienteAxios from '../../config/axios';
import { handleError } from '../../helpers';



const ObjetivosInicioTermino = ({codigoObjetivo, fechaInicio, fechaTermino, estadoObjetivo, setObjetivos}) => {
    
    const [fechaInicioSelect, setFechaInicioSelect] = useState(fechaInicio)
    const [fechaTerminoSelect, setFechaTerminoSelect] = useState(fechaTermino)
   
    const handleActualizarFechasObjetivo = async (codigoObjetivo, fechaInicioSelected, fechaTerminoSelected) => {

        try{
    
            await clienteAxios.put('/api/mineduc-tablero-objetivo/actualizar-fechas',{
                codigo_objetivo: codigoObjetivo,
                fecha_inicio: fechaInicioSelected,
                fecha_termino: fechaTerminoSelected,
            })

            if(fechaInicioSelected !== undefined){
                setObjetivos(objetivos => {
                    return objetivos.map(objetivo => {
                        if(objetivo.codigo === codigoObjetivo){
                            return {
                                ...objetivo,
                                fecha_inicio: fechaInicioSelected
                            }
                        }else{
                            return objetivo
                        }
                    })
                })
            }
            if(fechaTerminoSelected !== undefined){
                setObjetivos(objetivos => {
                    return objetivos.map(objetivo => {
                        if(objetivo.codigo === codigoObjetivo){
                            return {
                                ...objetivo,
                                fecha_termino: fechaTerminoSelected
                            }
                        }else{
                            return objetivo
                        }
                    })
                })
            }
            
        }catch(e){
            handleError(e)
        }


    }   

    if(estadoObjetivo === 2){
        console.log(new Date().toISOString().split('T')[0], fechaTerminoSelect, fechaTerminoSelect <= new Date().toISOString().split('T')[0])
    }

    return ( 
        <Row className="mb-1">
            <Col sm="auto">
                <label 
                    for="fecha_inicio" 
                    className="mr-2 text-muted"
                >Inicio</label>
                <input 
                    id="fecha_inicio" 
                    name="fecha_inicio"
                    value={fechaInicioSelect}
                    className="form-control"
                    type="date"
                    onChange={e => {
                        handleActualizarFechasObjetivo(codigoObjetivo, e.target.value, undefined)
                        setFechaInicioSelect(e.target.value)
                    }}
                />
            </Col>
            <Col sm="auto">
                <label 
                    for="fecha_termino" 
                    className="mr-2 text-muted"
                >Término</label>
                <input 
                    id="fecha_termino" 
                    name="fecha_termino"
                    value={fechaTerminoSelect}
                    className="form-control"
                    type="date" 
                    onChange={e => {
                        handleActualizarFechasObjetivo(codigoObjetivo, undefined, e.target.value)
                        setFechaTerminoSelect(e.target.value)
                    }}
                />
            </Col>
            <Col className="d-flex align-items-end justify-content-end">
                    {(estadoObjetivo !== 3 && fechaTerminoSelect <= new Date().toISOString().split('T')[0]) &&
                        <AiFillAlert 
                            className="alert-icon"
                            size={"2.4rem"} 
                        />
                    }
            </Col>
        </Row>
     );
}
 
export default ObjetivosInicioTermino;