import React, { useState, useEffect, useContext } from 'react'
import {Card, Button, Row} from 'react-bootstrap'
import { handleError } from '../../helpers'
import clienteAxios from '../../config/axios'
import AuthContext from '../../context/auth/AuthContext'

const CardRingsUsuario = ({handleObtenerPreguntasRing}) => {

    const { usuario, institucion_select } = useContext(AuthContext)
    const [rings_usuario, setRingsUsuario] = useState([])

    const listarRingsUsuario = async () => {
        try {

            const resp = await clienteAxios.get('/api/ring-usuarios/listar/rings-usuario-institucion',{
                params:{
                    rut_usuario: usuario.rut,
                    codigo_institucion: institucion_select.codigo,
                }
            })
            setRingsUsuario(resp.data.rings_usuario)
           
        } catch (e) {
            handleError(e)
        }
    }

    useEffect(() => {
        if(usuario){
            listarRingsUsuario()
        }
    }, [])


    return ( 
        <>
            {rings_usuario.map((ring_usuario, index) => {
                const {ring} = ring_usuario
                return(
                    <Card
                        bg={'light'}
                        key={index}
                        text={'dark'}
                        style={{ width: '18rem' }}
                        className="m-2"
                    >
                        <Card.Header>
                            {ring.nombre}
                        </Card.Header>
                        <Card.Body>
                        <Card.Title></Card.Title>
                        <Card.Text>
                            {ring.descripcion}
                        </Card.Text>
                        <Row className="d-flex justify-content-end">
                            <small>{`Inicio: ${ring.fecha_hora_inicio}`}</small>
                        </Row>
                        <Row className="d-flex justify-content-end"> 
                            <small>{`Fin: ${ring.fecha_hora_fin}`}</small>
                        </Row>
                        
                        </Card.Body>
                        <Card.Footer>
                            <Button 
                                variant="info" 
                                block
                                onClick={() => handleObtenerPreguntasRing(ring_usuario.codigo_ring)}
                            >Ingresar</Button>
                        </Card.Footer>
                    </Card>
                )

            })}
        </>

     )
}
 
export default CardRingsUsuario