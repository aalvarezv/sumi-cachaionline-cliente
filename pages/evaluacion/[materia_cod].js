import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import UnidadContext from '../../context/unidades/UnidadContext';
import MateriaContext from '../../context/materias/MateriaContext';
import NievelAcademicoContext from '../../context/niveles_academicos/NivelAcademicoContext';
import { Container, Row, Col, Form, Badge,
        Button, ListGroup, Card, Accordion, useAccordionToggle } from 'react-bootstrap';

const EvaluacionFiltros = () => {
 
    const {unidades_materia, listarUnidadesMateriaNA} = useContext(UnidadContext);
    const {materia_select, seleccionarMateria} = useContext(MateriaContext);
     
    const {niveles_academicos, listarNievelesAcademicos, seleccionaFiltroNA} = useContext(NievelAcademicoContext);

    const [filtro_modulos, setFiltroModulos] = useState([]);
    const [filtro_nivel_academico, setFiltroNivelAcademico] = useState([]);
    const [toggle, setToggle] = useState([]);
    const [filtro_tiempo, setFiltroTiempo] = useState(null);
    const [filtro_cantidad_preguntas, setFiltroCantidadPreguntas] = useState(0);

    const router = useRouter();
    const { materia_cod } = router.query;

   
    useEffect(() => {
        //pobla los niveles academicos al iniciar.
        if(!niveles_academicos){
            listarNievelesAcademicos();
        }

        if(materia_cod && niveles_academicos){
      
            const niveles = niveles_academicos.map(nivel => {
                return nivel.codigo;
            });
            
            setFiltroNivelAcademico(niveles);
            listarUnidadesMateriaNA(materia_cod, niveles);
        }
      

    }, [materia_cod, niveles_academicos]);

    useEffect(() => {

        listarUnidadesMateriaNA(materia_cod, filtro_nivel_academico);

    }, [filtro_nivel_academico]);


    function CustomToggle({ children, eventKey }) {
        const decoratedOnClick = useAccordionToggle(eventKey, () => {
            //verifica si existe el 
            console.log('click toggle', eventKey);
        });
      
        return (
          <Button
            variant="light"
            size="sm"
           //style={{ backgroundColor: 'pink' }}
            onClick={decoratedOnClick}
          >
            {children}
          </Button>
        );
    }

    const handleCheckUnidad = e => {

    }
    const handleCheckModulo = e => {
        if(e.target.checked){
            const modulo = unidades_materia.map(unidad => unidad.modulos.filter(modulo => modulo.codigo === e.target.name)).filter(res => res.length > 0)[0];
            setFiltroModulos([
                ...filtro_modulos,
                modulo[0]
            ]);
        }else{
            const filtro_modulos_new = filtro_modulos.filter(modulo => modulo.codigo !== e.target.name);
            setFiltroModulos(filtro_modulos_new);
        }
    }
    //NA = NIVEL ACADEMICO
    const handleClickNA = codigo_nivel_academico => {
        //revisa si el item de niveles academicos existe en el arreglo, 
        //si existe entonces lo quita del state, de lo contrario lo agrega.
        //esto me permite identificar los elementos seleccionados para luego
        //filtrar las preguntas.
        const is_select = filtro_nivel_academico.includes(codigo_nivel_academico);

        if(is_select){
            const new_filtro = filtro_nivel_academico.filter(item => item !== codigo_nivel_academico);
            setFiltroNivelAcademico(new_filtro);
        }else{
            setFiltroNivelAcademico([
                ...filtro_nivel_academico,
                codigo_nivel_academico
            ]);
        }
    }

    return ( 
        <Layout>
            
            <Container className="mt-5">
                <h3 className="mb-4 text-center">{materia_select && materia_select[0].nombre}</h3>
                <Card
                    bg="light"
                    text="info"
                    className="mb-2"
                >
                    <Card.Body>
                    <Card.Title>Ayuda</Card.Title>
                    <Card.Text>
                        Selecciona al menos una Unidad de la materia que deseas estudiar. Tu Nivel Académico 
                    </Card.Text>
                    </Card.Body>
                </Card>
                <Row>
                    <Col lg="4">
                        <Accordion>
                        <Card>
                            <Card.Header className="bg-info">
                                <div className="d-flex justify-content-between">   
                                    <h5 className="text-light">Nivel Académico</h5>
                                    <CustomToggle
                                        eventKey={`NA_${materia_cod}`}><h6>+</h6></CustomToggle>
                                </div>
                            </Card.Header>
                            <Accordion.Collapse eventKey={`NA_${materia_cod}`}>
                            <ListGroup>
                            {niveles_academicos && niveles_academicos.map(nivel_academico => {
                               
                                return (
                                <ListGroup.Item
                                    key={nivel_academico.codigo}
                                    onClick={() => { handleClickNA(nivel_academico.codigo)}}
                                    variant={filtro_nivel_academico.includes(nivel_academico.codigo) ? "info"
                                    : "light"}
                                >
                                    <h6>{nivel_academico.descripcion}</h6>
                                </ListGroup.Item>
                                )
                            })}
                            </ListGroup>
                            </Accordion.Collapse> 
                        </Card>
                        </Accordion>
                    </Col>
                    <Col className="mt-3 mt-lg-0" lg="4">
                        <Accordion>
                        <Card>
                            <Card.Header className="bg-info">
                                <h5 className="text-light text-center">Unidades</h5>
                            </Card.Header>
                            {unidades_materia && unidades_materia.map(unidad => {
                            return(
                                <React.Fragment
                                    key={unidad.codigo}
                                >
                                <Card.Header>
                                    <Form.Check 
                                        type="checkbox"
                                        id={unidad.codigo}
                                        name={unidad.codigo}
                                        label={unidad.descripcion}
                                        onChange={handleCheckUnidad}
                                    />
                                    <CustomToggle  eventKey={`UN_${unidad.codigo}`}>+</CustomToggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey={`UN_${unidad.codigo}`}>
                                    <ListGroup>
                                        {unidad.modulos.map(modulo => {
                                            return (
                                                <ListGroup.Item
                                                    key={modulo.codigo}
                                                >
                                                    <Form.Check 
                                                        type="checkbox"
                                                        id={modulo.codigo}
                                                        name={modulo.codigo}
                                                        label={modulo.descripcion}
                                                        onChange={handleCheckModulo}
                                                    />
                                                </ListGroup.Item>
                                            )
                                        })}
                                    </ListGroup>
                                </Accordion.Collapse> 
                                </React.Fragment>
                            );
                            })}
                        </Card>
                        </Accordion>
                    </Col>              
                    <Col className="mt-3 mt-lg-0" lg="4">
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGriTiempoPrueba">
                                <Form.Label>Duración (T)</Form.Label>
                                <Form.Control 
                                    name="tiempo_duracion"
                                    type="time"
                                    required
                                />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridNumeroPreguntas">
                                <Form.Label>Nº Preguntas</Form.Label>
                                <Form.Control 
                                    name="cantidad_preguntas"
                                    type="number" 
                                    min="5" max="100"
                                />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Button 
                                variant="info" 
                                block
                            >
                               Iniciar Prueba  
                            </Button>
                        </Form.Row>
                    </Col>
                </Row>
            </Container>
        </Layout>
     );
}
 
export default EvaluacionFiltros;