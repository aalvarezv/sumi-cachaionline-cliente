import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Container, Form, Table, Row, Col, Button, Alert } from 'react-bootstrap';
import { handleError } from '../../helpers';
import clienteAxios from '../../config/axios';

const ModuloFormTabConfig = ({codigo_modulo}) => {

    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        codigo_modulo,
    });
    const [modulo_propiedades, setModuloPropiedades] = useState([]);
    const [errores, setErrores] = useState({});

    useEffect(() => {
        
        const listarPropiedadesModulo = async () => {
            const resp = await clienteAxios.get(`/api/modulo-propiedades/listar/${codigo_modulo}`);
            setModuloPropiedades(resp.data.modulo_propiedades);
        }

        if(codigo_modulo){
            listarPropiedadesModulo();
        }

    }, [codigo_modulo])

    const validarFormulario = () => {
        //setea los errores para que no exista ninguno.
        let errors = {}

        //valida la descripcion.
        if(formulario.descripcion.trim() === ''){
            errors = {
                ...errors,
                descripcion: 'Requerido'
            }
        }

        setErrores(errors);

        return errors;

    }

    const handleClickAgregarPropiedadModulo = async e => {
        e.preventDefault();

        try{

            const errors = validarFormulario();
            //verifica que no hayan errores
            if(Object.keys(errors).length > 0){
                return;
            }
            //modulo a enviar
            let modulo_propiedad = {
                ...formulario,
                codigo : uuidv4(),
            }

            const resp = await clienteAxios.post('/api/modulo-propiedades/crear', modulo_propiedad);
            setModuloPropiedades(resp.data.modulo_propiedades);
            resetearFormulario();

        }catch(e){
            console.log(e);
            handleError(e);
        }

    }

    const handleClickEliminarPropiedadModulo = async (e, codigo) => {

        e.preventDefault();
        
        try{
            const resp = await clienteAxios.delete(`/api/modulo-propiedades/eliminar/${codigo}`,{
                params:{
                    codigo_modulo
                }
            });
            setModuloPropiedades(resp.data.modulo_propiedades);
            resetearFormulario();
        }catch(e){
            console.log(e);
            handleError(e);
        }
       
    }

    const resetearFormulario = () => {
        setFormulario({
            codigo: '',
            descripcion: '',
            codigo_modulo,
        })
    }

    return (
        <Container>
        <Form className="p-3">
            <Row className="mb-3">
                <Col>
                    <Alert variant="info" className="text-center text-uppercase">
                        Asignar propiedades al módulo.
                    </Alert>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group>
                        <Form.Control
                            id="descripcion"
                            name="descripcion"
                            type="text" 
                            placeholder="Ingresa el nombre de la propiedad" 
                            value={formulario.descripcion}
                            onChange={e => setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value.toUpperCase()
                            })}
                            isInvalid={errores.hasOwnProperty('descripcion')}
                            onBlur={validarFormulario}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.hasOwnProperty('descripcion') && errores.descripcion}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col xs="auto">
                    <Form.Group>
                        <Button 
                            variant="info"
                            size="sm"
                            className="btn-block" 
                            onClick={handleClickAgregarPropiedadModulo}
                        >Agregar</Button>
                    </Form.Group>
                </Col>
            </Row>
        </Form>
        {modulo_propiedades.length > 0 &&
            <Row>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Propiedad</th>
                            <th className="w-25"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {modulo_propiedades.map(item => {
                            return (
                            <tr key={item.codigo}>
                                <td>{item.descripcion}</td>
                                <td className="d-flex justify-content-center">
                                    <Button 
                                        variant="danger"
                                        size="sm"
                                        onClick={e => {handleClickEliminarPropiedadModulo(e, item.codigo)}}
                                    >Quitar</Button>
                                </td>
                            </tr>
                            );
                        })}
                    </tbody>
                </Table>
                </Row>
            }
        </Container> 
    )
}

export default ModuloFormTabConfig
