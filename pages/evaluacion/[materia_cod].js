import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import UnidadContext from '../../context/unidades/UnidadContext';
import MateriaContext from '../../context/materias/MateriaContext';
import NievelAcademicoContext from '../../context/niveles_academicos/NivelAcademicoContext';
import { Container, Row, Col, Form, Badge,
        Button, ListGroup, Card, Accordion, useAccordionToggle } from 'react-bootstrap';

const EvaluacionFiltros = () => {
    
    const router = useRouter();
    const { materia_cod } = router.query;

    const {unidades_materia, listarUnidadesMateriaNA} = useContext(UnidadContext);
    const {materia_select} = useContext(MateriaContext);
     
    const {niveles_academicos, listarNievelesAcademicos} = useContext(NievelAcademicoContext);

    const [filtro_modulo, setFiltroModulo] = useState([]);
    const [filtro_nivel_academico, setFiltroNivelAcademico] = useState([]);
    const [select_filtro_nivel_academico, setSelectFiltroNivelAcademico] = useState(false);
    const [toggle, setToggle] = useState([]);
    const [filtro_tiempo, setFiltroTiempo] = useState(null);
    const [filtro_cantidad_preguntas, setFiltroCantidadPreguntas] = useState(0);

    

    useEffect(() => {
        //pobla los niveles academicos al iniciar.
        if(!niveles_academicos){
            listarNievelesAcademicos();
        }
        //si tengo el codigo de la materia y los niveles academicos.
        if(materia_cod && niveles_academicos){
            //obtengo los códigos de los niveles academicos
            const niveles = niveles_academicos.map(nivel => {
                return nivel.codigo;
            });
            //seteo los filtros de nivel academico en el state.
            setFiltroNivelAcademico(niveles);
            //lista las unidades de materia por nivel academico.
            listarUnidadesMateriaNA(materia_cod, niveles);
        }
      
    }, [materia_cod, niveles_academicos]);

    //si cambia el state del filtro_nivel_academico, actualiza las unidades_materia.
    useEffect(() => {
        if(materia_cod && niveles_academicos){
            listarUnidadesMateriaNA(materia_cod, filtro_nivel_academico);
        }
    }, [filtro_nivel_academico]);

    
    useEffect(() => {
        //si hizo click en el filtro nivel academico
        if(select_filtro_nivel_academico){
            //obtengo los módulos disponibles según los niveles académicos seleccionados.
            let modulos = [];
            unidades_materia.forEach(unidad => {
                unidad.modulos.forEach(modulo => {
                    modulos.push(modulo.codigo);
                });
            });
            //muta el filtro_modulo para dejar solo aquellos que existen en .
            const new_filtro_modulo = filtro_modulo.filter(item => modulos.includes(item.codigo_modulo));
            setFiltroModulo(new_filtro_modulo);
        }

    }, [unidades_materia]);


    function CustomToggle({ children, eventKey }) {
        const decoratedOnClick = useAccordionToggle(eventKey, () => {
            //verifica si existe el 
            console.log('click toggle', eventKey);
        });
      
        return (
          <Button
            variant="info"
            size="sm"
           //style={{ backgroundColor: 'pink' }}
            onClick={decoratedOnClick}
          >
            {children}
          </Button>
        );
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

        setSelectFiltroNivelAcademico(true);

    }

    const handleClickModulo = (codigo_modulo, codigo_unidad) => {
        
        const is_select = filtro_modulo.some(item => item.codigo_modulo === codigo_modulo)

        if(is_select){
            const new_filtro = filtro_modulo.filter(item => item.codigo_modulo !== codigo_modulo);
            setFiltroModulo(new_filtro);
        }else{
            setFiltroModulo([
                ...filtro_modulo,
                {
                    codigo_modulo,
                    codigo_unidad
                }
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
                        <Accordion defaultActiveKey={`NA_${materia_cod}`}>
                        <Card>
                            <Card.Header className="bg-info">
                                <div className="d-flex justify-content-between">   
                                    <span className="text-light">NIVEL ACADÉMICO</span>
                                    <CustomToggle
                                        eventKey={`NA_${materia_cod}`}>+</CustomToggle>
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
                                    <span>{nivel_academico.descripcion}</span>
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
                                <span className="text-light">UNIDADES</span>
                            </Card.Header>
                            {unidades_materia && unidades_materia.map(unidad => {
                            return(
                                <React.Fragment
                                    key={unidad.codigo}
                                >
                                <Card.Header>
                                    <div className="d-flex justify-content-between align-items-center">   
                                    <span className="text-dark">{unidad.descripcion}</span>
                                        <CustomToggle  
                                            eventKey={`UN_${unidad.codigo}`}
                                        >+</CustomToggle>
                                    </div>
                                </Card.Header>
                                <Accordion.Collapse eventKey={`UN_${unidad.codigo}`}>
                                    <ListGroup>
                                        {unidad.modulos.map(modulo => {
                                            return (
                                                <ListGroup.Item
                                                    key={modulo.codigo}
                                                    onClick={() => { handleClickModulo(modulo.codigo, unidad.codigo)}}
                                                    variant={filtro_modulo.some(item => item.codigo_modulo === modulo.codigo) ? "info"
                                                    : "light"}
                                                >
                                                    <span>{modulo.descripcion}</span>
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