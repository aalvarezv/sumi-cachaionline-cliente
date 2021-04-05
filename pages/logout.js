import { useContext, useEffect } from "react"
import { Col, Container, Row } from "react-bootstrap"
import Layout from "../components/layout/Layout"
import AuthContext from "../context/auth/AuthContext"


const Logout = () => {

    const { cerrarSesion } = useContext(AuthContext)

    useEffect(() => {
        setTimeout(() => {
            cerrarSesion()
        }, 1500)
    }, [])

    return ( 
        <Layout>
            <Container className="mt-5">
                <Row>
                    <Col className="text-center">
                        <h5>Sesión finalizada...</h5>
                    </Col>
                </Row>
            </Container>
            
        </Layout>
     )
}
 
export default Logout