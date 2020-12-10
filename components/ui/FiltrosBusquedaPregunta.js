import React, { useState, forwardRef } from 'react';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import InputSelectMateria from './InputSelectMateria';
import InputSelectUnidadesMateria from './InputSelectUnidadesMateria';
import InputSelectModulosUnidad from './InputSelectModulosUnidad';
import InputSelectModulosContenido from './InputSelectModulosContenido';
import InputSelectModulosContenidoTema from './InputSelectModulosContenidoTema';
import InputSelectModulosContenidoTemaConcepto from './InputSelectModulosContenidoTemaConcepto';

const FiltrosBusquedaPregunta = ({handleClickBuscar}) => {

    const [filtros, setFiltros] = useState({
        codigo_materia: '0',
        codigo_unidad: '0',
        codigo_modulo: '0',
        codigo_modulo_contenido: '0',
        codigo_modulo_contenido_tema: '0',
        codigo_modulo_contenido_tema_concepto: '0',
        nombre_usuario_creador: '',
    });
    
    const { codigo_materia, codigo_unidad, codigo_modulo, codigo_modulo_contenido,
            codigo_modulo_contenido_tema, codigo_modulo_contenido_tema_concepto,
            nombre_usuario_creador } = filtros;


    return ( 
    <Container>     
        <Row className="mb-2">
            <Col>
                <InputSelectMateria
                    id="codigo_materia"
                    name="codigo_materia"
                    as="select"
                    size="sm"
                    label="TODAS LAS MATERIAS"
                    value={codigo_materia}
                    onChange={e => setFiltros({
                        ...filtros,
                        codigo_unidad: '0',
                        codigo_modulo: '0',
                        codigo_modulo_contenido: '0',
                        codigo_modulo_contenido_tema: '0',
                        codigo_modulo_contenido_tema_concepto: '0',
                        [e.target.name]: e.target.value,
                    })}
                />
            </Col>
            <Col>
                <InputSelectUnidadesMateria
                    id="codigo_unidad"
                    name="codigo_unidad"
                    /*codigo materia se le pasa a las props del componente
                    para filtrar las unidades de la materia seleccionada.*/
                    codigo_materia= {codigo_materia}
                    as="select"
                    size="sm"
                    label="TODAS LAS UNIDADES"
                    value={codigo_unidad}
                    onChange={e => setFiltros({
                        ...filtros,
                        codigo_modulo: '0',
                        codigo_modulo_contenido: '0',
                        codigo_modulo_contenido_tema: '0',
                        codigo_modulo_contenido_tema_concepto: '0',
                        [e.target.name]: e.target.value,
                    })}
                />
            </Col>
            <Col>
                <InputSelectModulosUnidad
                    id="codigo_modulo"
                    name="codigo_modulo"
                    /*codigo unidad se le pasa a las props del componente
                    para filtrar los modulos de la unidad seleccionada.*/
                    codigo_unidad= {codigo_unidad}
                    as="select"
                    size="sm"
                    label="TODOS LOS MÓDULOS"
                    value={codigo_modulo}
                    onChange={e => setFiltros({
                        ...filtros,
                        codigo_modulo_contenido: '0',
                        codigo_modulo_contenido_tema: '0',
                        codigo_modulo_contenido_tema_concepto: '0',
                        [e.target.name]: e.target.value
                    })}
                />  
            </Col>
        </Row>
        <Row className="mb-2">
            <Col>
                <InputSelectModulosContenido
                    id="codigo_modulo_contenido"
                    name="codigo_modulo_contenido"
                
                    /*codigo modulo se le pasa a las props del componente
                    para filtrar las propiedades del modulo seleccionado.*/
                    codigo_modulo={codigo_modulo}
                    as="select"
                    size="sm"
                    label="TODOS LOS CONTENIDOS"
                    value={codigo_modulo_contenido}
                    onChange={e => setFiltros({
                        ...filtros,
                        codigo_modulo_contenido_tema: '0',
                        codigo_modulo_contenido_tema_concepto: '0',
                        [e.target.name]: e.target.value
                    })}
                />
            </Col>
            <Col>
                <InputSelectModulosContenidoTema
                    id="codigo_modulo_contenido_tema"
                    name="codigo_modulo_contenido_tema"
                    
                    /*codigo contenido se le pasa a las props del componente
                    para filtrar las propiedades del modulo seleccionado.*/
                    codigo_modulo_contenido={codigo_modulo_contenido}
                    as="select"
                    size="sm"
                    label="TODOS LOS TEMAS"
                    value={codigo_modulo_contenido_tema}
                    onChange={e => setFiltros({
                        ...filtros,
                        codigo_modulo_contenido_tema_concepto: '0',
                        [e.target.name]: e.target.value
                    })}
                />  
            </Col>
            <Col>
                <InputSelectModulosContenidoTemaConcepto
                    id="codigo_modulo_contenido_tema_concepto"
                    name="codigo_modulo_contenido_tema_concepto"

                    /*codigo contenido se le pasa a las props del componente
                    para filtrar las propiedades del modulo seleccionado.*/
                    codigo_modulo_contenido_tema={codigo_modulo_contenido_tema}
                    as="select"
                    size="sm"
                    label="TODOS LOS CONCEPTOS"
                    value={codigo_modulo_contenido_tema_concepto}
                    onChange={e => setFiltros({
                    ...filtros,
                    [e.target.name]: e.target.value
                    })}
                />
            </Col>
        </Row>
        <Row>
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
            <Col xs="4">
                <Button
                    size="sm"
                    variant="info"
                    className="align-self-end mb-2"
                    onClick={e => {
                        handleClickBuscar({
                            codigo_materia,
                            codigo_unidad,
                            codigo_modulo,
                            codigo_modulo_contenido,
                            codigo_modulo_contenido_tema,
                            codigo_modulo_contenido_tema_concepto,
                            nombre_usuario_creador,
                        })
                    }}
                    block
                >
                    Buscar
                </Button>
            </Col>
        </Row>
     </Container>    );
}
 
export default FiltrosBusquedaPregunta;