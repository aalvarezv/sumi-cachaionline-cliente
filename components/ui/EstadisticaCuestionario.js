
import React, { createRef, useContext, useState, useEffect } from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import CustomDateInput from './CustomDateInput'
import InputSelectMateria from './InputSelectMateria'
import DatePicker from 'react-datepicker'
import InputSelectCuestionario from './InputSelectCuestionario'
import AuthContext from '../../context/auth/AuthContext'
import TableCuestionarioMejores10 from './TableCuestionarioMejores10'
import TableCuestionarioPeores10 from './TableCuestionarioPeores10'
import ChartPieCuestionarioPromedioGeneral from './ChartPieCuestionarioPromedioGeneral'
import TableCuestionarioUsuarioVsCurso from './TableCuestionarioUsuarioVsCurso'
import InfoCuestionario from './InfoCuestionario'
import TableCuestionarioPreguntasAcertadas from './TableCuestionarioPreguntasAcertadas'
import TableCuestionarioPreguntasErradas from './TableCuestionarioPreguntasErradas'
import TableCuestionarioPreguntasOmitidas from './TableCuestionarioPreguntasOmitidas'


const EstadisticaCuestionario = ({activeTab}) => {

    const { usuario } = useContext(AuthContext)
    const ref_fecha_cuestionario_desde = createRef()
    const ref_fecha_cuestionario_hasta = createRef()

     const [cuestionario, setCuestionario] = useState({
        fecha_cuestionario_desde: new Date(),
        fecha_cuestionario_hasta: new Date(),
        codigo_materia: '0',
        codigo_cuestionario: '0',
    })

    const {
        fecha_cuestionario_desde, 
        fecha_cuestionario_hasta, 
        codigo_materia, 
        codigo_cuestionario } = cuestionario
    
    useEffect(() => {
        reseteaFiltros()
    }, [activeTab])    


    const reseteaFiltros = () => {
        setCuestionario({
            fecha_cuestionario_desde: new Date(),
            fecha_cuestionario_hasta: new Date(),
            codigo_materia: '0',
            codigo_cuestionario: '0',
        })
    }

    return(
        
        <>
        <Container>
        <Row className="mb-1">
            <Col sm="auto">
                <DatePicker
                    id="fecha_cuestionario_desde"
                    name="fecha_cuestionario_desde"
                    selected={fecha_cuestionario_desde}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => {
                        setCuestionario({
                            ...cuestionario,
                            fecha_cuestionario_desde : date,
                            codigo_cuestionario: '0',
                        })
                    }}
                    customInput={
                        <CustomDateInput 
                            label="Fecha cuestionario Desde"
                            ref = {ref_fecha_cuestionario_desde}
                        />
                    }
                />
            </Col>
            <Col>
                <DatePicker
                    id="fecha_cuestionario_hasta"
                    name="fecha_cuestionario_hasta"
                    selected={fecha_cuestionario_hasta}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => {
                        setCuestionario({
                            ...cuestionario,
                            fecha_cuestionario_hasta : date,
                            codigo_cuestionario: '0',
                        })
                    }}
                    customInput={
                        <CustomDateInput 
                            label="Fecha cuestionario Hasta"
                            ref = {ref_fecha_cuestionario_hasta}
                        />
                    }
                />
            </Col>
        </Row>
        <Row className="mb-1">
            <Col>
                <InputSelectMateria
                    id="codigo_materia"
                    name="codigo_materia"
                    as="select"
                    label="SELECCIONE MATERIA"
                    value={codigo_materia}
                    onChange={e => {
                        setCuestionario({
                            ...cuestionario,
                            [e.target.name]: e.target.value,
                            codigo_cuestionario: '0', 
                        })
                    }}
                />
            </Col>
        </Row>
        <Row>
            <Col>
                {usuario &&
                    <InputSelectCuestionario
                        id="codigo_cuestionario"
                        name="codigo_cuestionario"
                        rut_usuario={usuario.rut}
                        codigo_materia={codigo_materia}
                        fecha_cuestionario_desde={fecha_cuestionario_desde}
                        fecha_cuestionario_hasta={fecha_cuestionario_hasta}
                        as="select"
                        value={codigo_cuestionario}
                        onChange={e => setCuestionario({
                            ...cuestionario,
                            [e.target.name]: e.target.value
                        })}
                    
                    />
                }
            </Col>    
        </Row>
        </Container>
        
        <Container>
        {(codigo_cuestionario !== '0' && usuario) &&
        <>  
            <Row>
                <Col sm={4} className="pt-4">
                    <InfoCuestionario 
                        codigo_cuestionario={codigo_cuestionario}
                    />
                </Col>
                <Col>
                    <ChartPieCuestionarioPromedioGeneral
                        codigo_cuestionario={codigo_cuestionario}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <TableCuestionarioMejores10
                        codigo_cuestionario={codigo_cuestionario}
                    />
                </Col>
                <Col>
                    <TableCuestionarioPeores10
                        codigo_cuestionario={codigo_cuestionario}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <TableCuestionarioUsuarioVsCurso
                        codigo_cuestionario={codigo_cuestionario}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <TableCuestionarioPreguntasAcertadas
                        codigo_cuestionario={codigo_cuestionario}
                    />
                </Col>
                <Col>
                    <TableCuestionarioPreguntasOmitidas
                        codigo_cuestionario={codigo_cuestionario}
                    />
                </Col>
                <Col>
                    <TableCuestionarioPreguntasErradas
                        codigo_cuestionario={codigo_cuestionario}
                    />
                </Col>
            </Row>
            
        </>
        }
        </Container>
        </>
    )

}


export default EstadisticaCuestionario