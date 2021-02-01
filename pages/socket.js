
import React, { useState } from 'react'
import { Container, Form, Row, Col, Button } from 'react-bootstrap'
import io from 'socket.io-client'
const socket = io.connect('http://localhost:4000')

export default function Socket(){

    
    const [mensajes, setMensajes] = useState([])
    const [mensaje, setMensaje] = useState('')

    socket.on('connect', function() {
        console.log('Conectado al servidor');
    });
    
    socket.on('disconnect', function() {
        console.log('Perdimos conexión con el servidor');
    });

    socket.on('mensajeAll', data => {
        setMensajes(data)  
    })

    const handleDisconnect = () => {
        socket.disconnect();
    }

    const mandaMensaje = () => {
        socket.emit('join', mensaje)
        setMensaje('')
    }

    return (
        <Container className="bg-dark mt-5" >
        <Row className="d-flex justify-content-center">
            <Col xs={6} className="d-flex flex-column justify-content-center mt-5">
                <Form.Control 
                    type="text"  
                    name="mensaje"
                    placeholder="Mensaje"
                    onChange={e => setMensaje(e.target.value)}
                    value={mensaje}
                    autoComplete="off"
                />
                <Button
                    className="mt-3 btn-blcok"
                    variant="primary"
                    onClick={mandaMensaje}
                >
                    Enviar Mensaje
                </Button>
                <Button
                    className="mt-3 btn-blcok"
                    variant="secondary"
                    onClick={handleDisconnect}
                >
                    Desconectar
                </Button>
                <ul className="text-white">
                    {mensajes.map(m => {
                        return <li>{m.mensaje}</li>
                    })}
                </ul>
            </Col>
        </Row>
        </Container>
    )
}
