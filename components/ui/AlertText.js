import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import { RiAlertFill } from 'react-icons/ri';

const AlertText = ({text}) => {
    return ( 

        <Container>
            <Row className="d-flex justify-content-center">
                <Col xs="auto" className="m-0"><RiAlertFill size={"1.6rem"} color={"gray"}/></Col>
                <Col xs="auto" className="p-0"><h4 className="text-secondary ">{text}</h4></Col>
            </Row>
        </Container>
     );
}
 
export default AlertText;