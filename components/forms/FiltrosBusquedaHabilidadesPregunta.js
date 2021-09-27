import React, { useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'


const FiltrosBusquedaHabilidadesPregunta = ({handleHabilidades}) => {

    const [habilidades, setHabilidades] = useState({
        recordar: false,
        comprender: false,
        aplicar: false,
        analizar: false,
        evaluar: false,
        crear: false
    })

    const {recordar, comprender, aplicar, analizar, evaluar, crear } = habilidades

    const handleChangeHabilidad = e => {
        const newHabilidades = {
            ...habilidades,
            [e.target.name]: e.target.checked
        }

        setHabilidades(newHabilidades)
        handleHabilidades(newHabilidades)
    }

    return (  
        <Row>
            <Col xs={4} lg={2}>
                <Form.Check>
                    <Form.Check.Input 
                        name="recordar"
                        value={recordar}
                        type="checkbox" 
                        onChange={handleChangeHabilidad} 
                    />
                    <Form.Check.Label>
                        <small>Recordar</small>
                    </Form.Check.Label>
                </Form.Check>
            </Col>
            <Col xs={4} lg={2}>
                <Form.Check>
                    <Form.Check.Input 
                        name="comprender"
                        value={comprender}
                        type="checkbox" 
                        onChange={handleChangeHabilidad} 
                    />
                    <Form.Check.Label>
                        <small>Comprender</small>
                    </Form.Check.Label>
                </Form.Check>
            </Col>
            <Col xs={4} lg={2}>
                <Form.Check>
                    <Form.Check.Input 
                        name="aplicar"
                        value={aplicar}
                        type="checkbox" 
                        onChange={handleChangeHabilidad} 
                    />
                    <Form.Check.Label>
                        <small>Aplicar</small>
                    </Form.Check.Label>
                </Form.Check>
            </Col>
            <Col xs={4} lg={2}>
                <Form.Check>
                    <Form.Check.Input 
                        name="analizar"
                        value={analizar}
                        type="checkbox" 
                        onChange={handleChangeHabilidad} 
                    />
                    <Form.Check.Label>
                        <small>Analizar</small>
                    </Form.Check.Label>
                </Form.Check>
            </Col>
            <Col xs={4} lg={2}>
                <Form.Check>
                    <Form.Check.Input 
                        name="evaluar"
                        value={evaluar}
                        type="checkbox" 
                        onChange={handleChangeHabilidad} 
                    />
                    <Form.Check.Label>
                        <small>Evaluar</small>
                    </Form.Check.Label>
                </Form.Check>
            </Col>
            <Col xs={4} lg={2}>
                <Form.Check>
                    <Form.Check.Input 
                        name="crear"
                        value={crear}
                        type="checkbox" 
                        onChange={handleChangeHabilidad} 
                    />
                    <Form.Check.Label>
                        <small>Crear</small>
                    </Form.Check.Label>
                </Form.Check>
            </Col>
        </Row>

    )
}
 
export default FiltrosBusquedaHabilidadesPregunta;