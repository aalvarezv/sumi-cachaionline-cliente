import React from 'react'
import { Alert, Button, Col, Row } from 'react-bootstrap'


const AlertMostrarBusqueda = props => {

    const {label = '', handleClickMostrarBusqueda} = props
    return (  
        <Alert
            variant="info"
            className="mt-4"
        >
            <Row>
                <Col className="d-flex align-items-center">
                    <h5 >{label}</h5>
                </Col>
                <Col className="d-flex justify-content-end">
                    {props.children}
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleClickMostrarBusqueda}
                    >Ir a Búsqueda</Button>
                </Col>
            </Row>
        </Alert>
    );
}
 
export default AlertMostrarBusqueda;