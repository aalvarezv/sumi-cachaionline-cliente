import React, { useState, createRef, Fragment, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Row, Col, Form, Modal, ListGroup, Button} from 'react-bootstrap';
import { RiDeleteBin5Line } from 'react-icons/ri';
import InputSelectMateria from '../ui/InputSelectMateria';
import InputSelectUnidadesMateria from '../ui/InputSelectUnidadesMateria';
import InputSelectModulosUnidad from '../ui/InputSelectModulosUnidad';
import InputSelectPropiedadesModulo from '../ui/InputSelectPropiedadesModulo';

const PreguntaModalConfig = ({ show, setShow, modulos_init, handleSetModulos }) => {

    
    const [codigo_materia, setCodigoMateria] = useState('0');
    const [codigo_unidad, setCodigoUnidad] = useState('0');
    const [modulo, setModulo] = useState({
        codigo: '0',
        descripcion: ''
    });
    const [propiedad_modulo, setPropiedadModulo] = useState({
        codigo: '0',
        descripcion: '',
    });
    const modulo_ref = createRef();
    const propiedad_modulo_ref = createRef();

    const [modulos, setModulos] = useState([]);
    //Carga los módulos iniciales en caso que sea una pregunta a modificar.
    useEffect(() => {
        setModulos(modulos_init);
    }, [modulos_init])

    const handleAddModulo = () => {

        const {codigo, descripcion} = modulo;
        if(codigo === "0") return
                           
        if(modulos.filter(modulo => modulo.codigo === codigo).length > 0) return

        setModulos([
            ...modulos,
            { 
                codigo: codigo,
                descripcion: descripcion,
            }
        ]);
    }

    const handleQuitarModulo = codigo => {
        const new_modulos = modulos.filter(modulo => modulo.codigo !== codigo);
        setModulos(new_modulos);
    }

    const handleAddPropiedadModulo = () => {

        if(propiedad_modulo.codigo === "0") return

        //Si el modulo no se ha agregado y pincha agregar la propiedad, agrega ambos.
        if(modulos.filter(mod => mod.codigo === modulo.codigo).length === 0 ){
           
            setModulos([
                ...modulos,
                {
                    codigo: modulo.codigo,
                    descripcion: modulo.descripcion,
                    propiedades: [{
                        codigo: propiedad_modulo.codigo,
                        descripcion: propiedad_modulo.descripcion,
                    }],
                }
            ]);
            return;
        } 

        
        //Asigna la propiedad al módulo es esté seleccionado.
        let new_modulos = modulos.map(mod => {
            //si el modulo recorrido actual es igual al modulo seleccionado.
            if(mod.codigo === modulo.codigo){
                //verifica si ya existe el atributo propiedades.
                if(mod.propiedades){
                    //si la propiedad no existe, entonces la agrega
                    if(mod.propiedades.filter(propiedad => propiedad.codigo === propiedad_modulo.codigo).length === 0){
                        mod.propiedades.push({
                            codigo : propiedad_modulo.codigo,
                            descripcion : propiedad_modulo.descripcion,
                        });
                    }
                //si no existe lo crea por primera vez y agrega la propiedad.
                }else{
                    mod.propiedades = [{
                        codigo : propiedad_modulo.codigo,
                        descripcion : propiedad_modulo.descripcion,
                    }];
                }
            }
            return mod
        }) 
        
        setModulos(new_modulos);
      
    }

    const handleQuitarPropiedadModulo = codigo => {
        
        const new_modulos = modulos.map(modulo => modulo.propiedades ? { 
                ...modulo,
                propiedades: modulo.propiedades.filter(propiedad => propiedad.codigo !== codigo)
            } : modulo);

        setModulos(new_modulos);

    }

    const handleClickAceptar = () => {
        
        if(modulos.length === 0){
             toast.warning('La pregunta debe estar asociada al menos a un módulo.', {containerId: 'sys_msg'});
             return;
        }

        handleSetModulos(modulos)
        
        setShow(false);
    }

    return (
        <Modal show={show} onHide={() => {}}>
        <Modal.Header>
          <Modal.Title>Configura tu pregunta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Row>
                <Col>
                    <Form.Group>
                        <InputSelectMateria
                            id="codigo_materia"
                            name="codigo_materia"
                            as="select"
                            size="sm"
                            value={codigo_materia}
                            onChange={e => setCodigoMateria(e.target.value)}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group>
                        <InputSelectUnidadesMateria
                            id="codigo_unidad"
                            name="codigo_unidad"
                            /*codigo materia se le pasa a las props del componente
                            para filtrar las unidades de la materia seleccionada.*/
                            codigo_materia={codigo_materia}
                            as="select"
                            size="sm"
                            value={codigo_unidad}
                            onChange={e => setCodigoUnidad(e.target.value)}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group>
                        <InputSelectModulosUnidad
                            id="codigo_modulo"
                            name="codigo_modulo"
                            ref={modulo_ref}
                            /*codigo unidad se le pasa a las props del componente
                            para filtrar los modulos de la unidad seleccionada.*/
                            codigo_unidad={codigo_unidad}
                            as="select"
                            size="sm"
                            value={modulo.codigo}
                            onChange={e => {
                                let index = modulo_ref.current.selectedIndex;
                                let descripcion = modulo_ref.current[index].text

                                setModulo({
                                    codigo: e.target.value,
                                    descripcion,
                                });
                                //reinicia la propiedad.
                                setPropiedadModulo({
                                    codigo: '0',
                                    descripcion: '',
                                });
                            }}
                        />
                    </Form.Group>
                </Col>
                <Col xs="auto">
                    <Button
                        variant="success"
                        size="sm"
                        onClick={handleAddModulo}
                    >+ Agregar</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group>
                        <InputSelectPropiedadesModulo
                            id="codigo_propiedad_modulo"
                            name="codigo_propiedad_modulo"
                            ref={propiedad_modulo_ref}
                            /*codigo modulo se le pasa a las props del componente
                            para filtrar las unidades de la materia seleccionada.*/
                            codigo_modulo={modulo.codigo}
                            as="select"
                            size="sm"
                            value={propiedad_modulo.codigo}
                            onChange={e => {
                                
                                let index = propiedad_modulo_ref.current.selectedIndex;
                                let descripcion = propiedad_modulo_ref.current[index].text

                                setPropiedadModulo({
                                    codigo: e.target.value,
                                    descripcion,
                                })
                            }}
                        />
                    </Form.Group>
                </Col>
                <Col xs="auto">
                    <Button
                        variant="success"
                        size="sm"
                        onClick={handleAddPropiedadModulo}
                    >+ Agregar</Button>
                </Col>
            </Row>
            {modulos.length > 0 &&
            <Row>
                <Col>
                    <ListGroup variant="flush">
                        {modulos.map(modulo =>  {
                            return (
                            <Fragment
                                key={modulo.codigo}
                            >
                                <ListGroup.Item
                                    className="d-flex justify-content-between align-items-center py-0"
                                >
                                    <small>{modulo.descripcion}</small>
                                    <a href="#"
                                        className="nav-link"
                                        onClick={() => handleQuitarModulo(modulo.codigo)}
                                    >
                                        <RiDeleteBin5Line size={"1.2rem"} color={"gray"}/>
                                    </a>
                                </ListGroup.Item>

                                {modulo.propiedades && 
                                    <ListGroup variant="flush">
                                    {modulo.propiedades.map(propiedad =>{
                                        return (
                                            <ListGroup.Item
                                                key={propiedad.codigo}
                                                className="d-flex align-items-center justify-content-end py-0"
                                                variant="info"
                                            >
                                                <small>{propiedad.descripcion}</small>
                                                <a href="#"
                                                    className="nav-link"
                                                    onClick={() => handleQuitarPropiedadModulo(propiedad.codigo)}
                                                >
                                                    <RiDeleteBin5Line size={"1.2rem"} color={"gray"}/>
                                                </a>
                                            </ListGroup.Item>
                                        )

                                    })}
                                    </ListGroup>
                                }
                            </Fragment>
                            )
                        })}
                    </ListGroup>
                </Col>
            </Row>
            }
        </Modal.Body>
        <Modal.Footer>
            <Button variant="info" onClick={handleClickAceptar}>
                Aceptar
            </Button>
        </Modal.Footer>
        </Modal>
    )
}

export default PreguntaModalConfig;
