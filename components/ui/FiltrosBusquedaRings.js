import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, ButtonGroup, ToggleButton } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import CustomDateInput from './CustomDateInput';
import InputSelectNivelAcademico from './InputSelectNivelAcademico';
import InputSelectMateria from './InputSelectMateria';

const FiltrosBusquedaRings = ({handleClickBuscar}) => {

    const [filtros, setFiltros] = useState({
        fecha_desde: new Date(),
        fecha_hasta: new Date(),
        codigo_materia: '0',
        codigo_nivel_academico: '0',
        nombre_ring: '',
        nombre_usuario_creador: '',
        privado: true,
     });
  
    const { fecha_desde, fecha_hasta, codigo_materia, 
            codigo_nivel_academico, nombre_ring, 
            nombre_usuario_creador, privado } = filtros;
    
    const ref_custom_date_desde = React.createRef();
    const ref_custom_date_hasta = React.createRef();

    const radios_estado_ring = [
        { name: 'Privado', value: true },
        { name: 'Público', value: false },
    ];

    return ( 
        <Container>
            <Row>
                <Col xs="auto">
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
                <Col>
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
                <Col>
                    <Form.Control
                        id="nombre_ring"
                        name="nombre_ring"
                        type="text" 
                        size="sm"
                        placeholder="NOMBRE RING..." 
                        value={nombre_ring}
                        onChange={e => {
                        setFiltros({
                            ...filtros,
                            [e.target.name]: e.target.value.toUpperCase()
                        })
                        }} 
                    />
                </Col>
                <Col>
                    <Form.Control
                        id="nombre_usuario_creador"
                        name="nombre_usuario_creador"
                        type="text" 
                        size="sm"
                        placeholder="CREADA POR USUARIO..." 
                        value={nombre_usuario_creador}
                        onChange={e => {
                        setFiltros({
                            ...filtros,
                            [e.target.name]: e.target.value.toUpperCase()
                        })
                        }} 
                    />
                </Col>
                <Col>
                    <ButtonGroup toggle style={{zIndex: 0}}>
                        {radios_estado_ring.map((radio, idx) => (
                            <ToggleButton
                                key={idx}
                                type="radio"
                                variant="outline-info"
                                name="privado"
                                value={radio.value}
                                checked={privado === radio.value}
                                onChange={e => {
                                    setFiltros({
                                        ...filtros,
                                        [e.target.name]: radio.value,
                                    });
                                }
                                }
                            >
                                {radio.name}
                            </ToggleButton>
                        ))}
                    </ButtonGroup>
                </Col>
            </Row>
            <Row className="mb-2">
                <Col>
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
                <Col>
                    <InputSelectNivelAcademico
                        id="codigo_nivel_academico"
                        name="codigo_nivel_academico"
                        as="select"
                        size="sm"
                        value={codigo_nivel_academico}
                        onChange={e => {
                        setFiltros({
                            ...filtros,
                            [e.target.name]: e.target.value,
                        })
                        }}
                    />
                </Col>
                <Col>
                    <Button
                        size="sm"
                        variant="info"
                        className="align-self-end mb-2"
                        onClick={() => {
                            handleClickBuscar({ 
                                fecha_desde, 
                                fecha_hasta, 
                                codigo_materia, 
                                codigo_nivel_academico, 
                                nombre_ring, 
                                nombre_usuario_creador, 
                                privado 
                            })
                        }}
                        block
                    >
                        Buscar
                    </Button>  
                </Col>
            </Row>      
        </Container>

     );
}
 
export default FiltrosBusquedaRings;