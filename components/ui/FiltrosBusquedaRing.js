import React from 'react'
import { Form, ButtonGroup, ToggleButton, Row, Col, Button } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import CustomDateInput from './CustomDateInput'
import InputSelectMateria from './InputSelectMateria'


const FiltrosBusquedaRing = ({filtros, setFiltros, setRingEnProceso, setMostrarBusqueda, setTextAlert, handleClickBuscar}) => {

    const { fecha_desde, fecha_hasta, codigo_materia, 
            nombre_ring, privado } = filtros
    
    const ref_custom_date_desde = React.createRef()
    const ref_custom_date_hasta = React.createRef()
 
    const radios_estado_ring = [
       { name: 'Privado', value: true },
       { name: 'Público', value: false },
    ]

    return ( 

        <Row className="d-flex justify-content-center">
            <Col xs={12} lg={8}>
                <Row>
                <Col xs={12} className="d-flex justify-content-end"> 
                    <ButtonGroup toggle>
                        {radios_estado_ring.map((radio, idx) => (
                            <ToggleButton
                            key={idx}
                            type="radio"
                            variant="outline-info"
                            name="privado"
                            size="md"
                            value={radio.value}
                            checked={privado === radio.value}
                            onChange={e => {
                                setFiltros({
                                        ...filtros,
                                        [e.target.name]: radio.value,
                                })
                            }}
                            >
                            {radio.name}
                            </ToggleButton>
                        ))}
                    </ButtonGroup>
                </Col>
                </Row>
                <Row className="mb-2">
                <Col xs={12} md={6} className="mb-2 mb-md-0">
                    <DatePicker
                        selected={fecha_desde}
                        dateFormat="dd/MM/yyyy"
                        popperPlacement="top-end"
                        popperModifiers={{
                            offset: {
                            enabled: true,
                            offset: "5px, 10px"
                            },
                            preventOverflow: {
                                enabled: true,
                                escapeWithReference: false,
                                boundariesElement: "viewport"
                            }
                        }}
                        onChange={date => setFiltros({
                            ...filtros,
                            fecha_desde: date,
                        })}
                        customInput={
                            <CustomDateInput 
                                label="Creación Desde"
                                ref = {ref_custom_date_desde}
                            />
                        }
                    />
                </Col>
                <Col xs={12} md={6}>
                    <DatePicker
                        selected={fecha_hasta}
                        dateFormat="dd/MM/yyyy"
                        popperPlacement="top-end"
                        popperModifiers={{
                            offset: {
                            enabled: true,
                            offset: "5px, 5px"
                            },
                            preventOverflow: {
                                enabled: true,
                                escapeWithReference: false,
                                boundariesElement: "viewport"
                            }
                        }}
                        onChange={date => setFiltros({
                            ...filtros,
                            fecha_hasta: date,
                        })}
                        customInput={
                            <CustomDateInput 
                                label="Hasta"
                                ref = {ref_custom_date_hasta}
                            />
                        }
                    /> 
                </Col>
                </Row>
                <Row className="mb-2">
                <Col xs={12} md={6} className="mb-2 mb-md-0">
                    <InputSelectMateria
                        id="codigo_materia"
                        name="codigo_materia"
                        as="select"
                        size="sm"
                        value={codigo_materia}
                        onChange={e => {
                            setFiltros({
                                ...filtros,
                                [e.target.name]: e.target.value,
                            })
                        }}
                    />
                </Col>
                <Col xs={12} md={6}>
                    <Form.Control
                        id="nombre_ring"
                        name="nombre_ring"
                        type="text" 
                        size="md"
                        placeholder="NOMBRE RING..." 
                        value={nombre_ring}
                        onChange={e => {
                        setFiltros({
                            ...filtros,
                            [e.target.name]: e.target.value
                        })
                        }} 
                    />
                </Col>
                </Row>   
            </Col>
            <Col className="d-flex align-items-end mb-2 mb-md-0" xs={12} md={3} lg="auto">
                <Button
                variant="info"
                className="align-self-end"
                onClick={handleClickBuscar}
                block
                >
                Buscar
                </Button>                 
            </Col>
            <Col className="d-flex align-items-end mb-2 mb-md-0" xs={12} md={3} lg="auto">
                <Button 
                variant="info"
                className="btn-block"
                onClick={e =>{
                    setRingEnProceso(null)
                    setMostrarBusqueda(false)
                    setTextAlert('')
                }}>
                + Agregar
                </Button>
            </Col>
        </Row>
     );
}
 
export default FiltrosBusquedaRing;