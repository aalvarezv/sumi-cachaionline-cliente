import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import { RiAlertFill } from 'react-icons/ri'

const AlertText = ({text}) => {
    return ( 
        <>
        {text.trim() !== ''
        &&
            <Container>
            <Row className="d-flex justify-content-center ">
                <Col xs="auto"><RiAlertFill size={"1.6rem"} color={"#FFC300"}/></Col>
                <Col xs="auto" className="mt-0"><h5 className="text-dark">{text}</h5></Col>
            </Row>
            </Container>
        }
        </>
     )
}
 
export default AlertText