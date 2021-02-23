import React, { useContext, useEffect } from 'react'
import Link from 'next/link'
import MateriaContext from '../context/materias/MateriaContext'
import Layout from '../components/layout/Layout'
import { Container, Row, Col, Card, Image } from 'react-bootstrap'


const Home = () => {

    const { materias, listarMaterias, seleccionarMateria } = useContext(MateriaContext)
 
    useEffect(()=> {
      listarMaterias()
    }, [])

    return ( 
    <Layout>
      <Container className="mt-3">

        {materias && materias.map(materia => (
          <Card className="border-bottom-0" key={materia.codigo}>
            <Container className="px-4 py-4">
                <Row>
                    <Col lg={3}>
                      <Row>
                         <Image className= "img-fluid mx-auto" style={{ width: '300px' }} variant="top" src={materia.imagen}/>
                      </Row>
                    </Col>
                    <Col className="mt-3 mt-lg-0" lg={6}>
                      <Row>
                         <Card.Title className="text-info">
                            <Link href="/evaluacion/[materia_cod]" as={`/evaluacion/${materia.codigo}`}>
                              <a onClick={() => seleccionarMateria(materia.codigo)}>{materia.nombre}</a>
                            </Link>
                         </Card.Title>
                      </Row>
                      <Row>
                        <Card.Text>{materia.descripcion}</Card.Text>
                      </Row>
                    </Col>
                    <Col lg={3}>
                      <Row>1</Row>
                      <Row>2</Row>
                    </Col>
                </Row>
            </Container>
          </Card>
          ))}     
      </Container>
    </Layout>   
    )
}
 
export default Home