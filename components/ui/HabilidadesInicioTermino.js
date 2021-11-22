import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { AiFillAlert } from 'react-icons/ai';
import clienteAxios from '../../config/axios';
import { handleError } from '../../helpers';


const HabilidadesInicioTermino = ({codigoHabilidad, fechaInicio, fechaTermino, estadoHabilidad, setHabilidades}) => {
    
    const [fechaInicioSelect, setFechaInicioSelect] = useState(fechaInicio)
    const [fechaTerminoSelect, setFechaTerminoSelect] = useState(fechaTermino)
    
    const handleActualizarFechasHabilidades = async (codigoHabilidad, fechaInicioSelected, fechaTerminoSelected) => {

        try{
            
            await clienteAxios.put('/api/mineduc-tablero-habilidad/actualizar-fechas',{
                codigo_habilidad: codigoHabilidad,
                fecha_inicio: fechaInicioSelected,
                fecha_termino: fechaTerminoSelected,
            })

            if(fechaInicioSelected !== undefined){
                setHabilidades(habilidades => {
                    return habilidades.map(habilidad => {
                        if(habilidad.codigo === codigoHabilidad){
                            return {
                                ...habilidad,
                                fecha_inicio: fechaInicioSelected
                            }
                        }else{
                            return habilidad
                        }
                    })
                })
            }
            if(fechaTerminoSelected !== undefined){
                setHabilidades(habilidades => {
                    return habilidades.map(habilidad => {
                        if(habilidad.codigo === codigoHabilidad){
                            return {
                                ...habilidad,
                                fecha_termino: fechaTerminoSelected
                            }
                        }else{
                            return habilidad
                        }
                    })
                })
            }
            
        }catch(e){
            handleError(e)
        }
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
                        handleActualizarFechasHabilidades(codigoHabilidad, e.target.value, undefined)
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
                        handleActualizarFechasHabilidades(codigoHabilidad, undefined, e.target.value)
                        setFechaTerminoSelect(e.target.value)
                    }}
                />
            </Col>
            <Col className="d-flex align-items-end justify-content-end">
                    {(estadoHabilidad !== 3 && fechaTerminoSelect <= new Date().toISOString().split('T')[0]) &&
                        <AiFillAlert 
                            className="alert-icon"
                            size={"2.4rem"} 
                        />
                    }
            </Col>
        </Row>
     );
}
 
export default HabilidadesInicioTermino;