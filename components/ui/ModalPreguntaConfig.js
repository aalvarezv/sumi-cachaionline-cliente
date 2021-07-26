import React, { useState, createRef, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Row, Col, Form, Modal, Button, Badge} from 'react-bootstrap'
import { TiDelete } from 'react-icons/ti'
import InputSelectMateria from './InputSelectMateria'
import InputSelectUnidadesMateria from './InputSelectUnidadesMateria'
import InputSelectModulosUnidad from './InputSelectModulosUnidad'
import InputSelectModulosContenido from './InputSelectModulosContenido'
import InputSelectModulosContenidoTema from './InputSelectModulosContenidoTema'
import InputSelectModulosContenidoTemaConcepto from './InputSelectModulosContenidoTemaConcepto'

const ModalPreguntaConfig = ({ show, setShow, modulos_init, contenidos_init, temas_init, conceptos_init, handleSetPropiedadesPregunta, handleMostrarBusquedaPreguntas }) => {


    const [codigo_materia, setCodigoMateria] = useState('0')
    const [codigo_unidad, setCodigoUnidad] = useState('0')
    const [modulo, setModulo] = useState({
        codigo: '0',
        descripcion: ''
    })
    const [contenido, setContenido] = useState({
        codigo: '0',
        descripcion: '',
    })
    const [tema, setTema] = useState({
        codigo: '0',
        descripcion: '',
    })
    const [concepto, setConcepto] = useState({
        codigo: '0',
        descripcion: '',
    })

    const modulo_ref = createRef()
    const contenido_ref = createRef()
    const tema_ref = createRef()
    const concepto_ref = createRef()

    const [modulos, setModulos] = useState([])
    const [contenidos, setContenidos] = useState([])
    const [temas, setTemas] = useState([])
    const [conceptos, setConceptos] = useState([])
    //Carga los módulos iniciales en caso que sea una pregunta a modificar.
    useEffect(() => {
        setModulos(modulos_init)
        setContenidos(contenidos_init)
        setTemas(temas_init)
        setConceptos(conceptos_init)
    }, [modulos_init, contenidos_init, temas_init, conceptos_init])

    const handleAddModulo = () => {
        //Modulo actual seleccionado.
        const {codigo, descripcion} = modulo

        if(codigo === "0") return
        //Si el modulo ya existe, no lo vuelve a agregar.                   
        if(modulos.filter(modulo => modulo.codigo === codigo).length > 0) return

        //Agrega el modulo.
        setModulos([
            ...modulos,
            { 
                codigo: codigo,
                descripcion: descripcion,
            }
        ])
    }

    const handleQuitarModulo = codigo => {

        //Quita el modulo.
        const new_modulos = modulos.filter(modulo => modulo.codigo !== codigo)
        setModulos(new_modulos)
        //Quita los contenidos del modulo.
        const new_contenidos = contenidos.filter(contenido => contenido.codigo_modulo !== codigo)
        setContenidos(new_contenidos)
        //Quita los temas del contenido, deja aquellos temas que existen en new_contenidos.
        const new_temas = temas.filter(tema => new_contenidos.filter(contenido => contenido.codigo === tema.codigo_contenido).length > 0)
        setTemas(new_temas)
        //Quita los conceptos de los temas, deja aquellos conceptos que existe en new_temas.
        const new_conceptos = conceptos.filter(concepto => new_temas.filter(tema => tema.codigo === concepto.codigo_tema).length > 0)
        setConceptos(new_conceptos)
    }

    const handleAddContenido = () => {   
        //Contenido actual seleccionado.
        const {codigo, descripcion} = contenido
        
        if(codigo === "0") return

        //Si el contenido ya existe, no lo vuelve a agregar.                   
        if(contenidos.filter(contenido => contenido.codigo === codigo).length > 0) return

        //Agrega el modulo del contenido si no existe.                   
        if(modulos.filter(mod => mod.codigo === modulo.codigo).length === 0){
            setModulos([
                ...modulos,
                { 
                    codigo: modulo.codigo,
                    descripcion: modulo.descripcion,
                }
            ])
        }
        //Agrega el contenido.
        setContenidos([
            ...contenidos,
            { 
                codigo: codigo,
                descripcion: descripcion,
                codigo_modulo: modulo.codigo,
            }
        ])
    }   

    const handleQuitarContenido = codigo => {  

        //Quita el contenido.
        const new_contenidos = contenidos.filter(contenido => contenido.codigo !== codigo)
        setContenidos(new_contenidos)
        //Quita los temas del contenido.
        const new_temas = temas.filter(tema => tema.codigo_contenido !== codigo)
        setTemas(new_temas)
        //Si el concepto.codigo_tema existe en new_temas entonces lo retorna.
        const new_conceptos = conceptos.filter(concepto => new_temas.filter(tema => tema.codigo === concepto.codigo_tema).length > 0)
        setConceptos(new_conceptos)
        
    }

    const handleAddTema = () => {   
        //Contenido actual seleccionado.
        const {codigo, descripcion} = tema
        
        if(codigo === "0") return

        //Si el tema ya existe, no lo vuelve a agregar.                   
        if(temas.filter(tema => tema.codigo === codigo).length > 0) return

        //Agrega el modulo del tema si no existe.                   
        if(modulos.filter(mod => mod.codigo === modulo.codigo).length === 0){
            setModulos([
                ...modulos,
                { 
                    codigo: modulo.codigo,
                    descripcion: modulo.descripcion,
                }
            ])
        }
        
        //Agrega el contenido del tema si no existe.                 
        if(contenidos.filter(cont => cont.codigo === contenido.codigo).length === 0){
            setContenidos([
                ...contenidos,
                { 
                    codigo: contenido.codigo,
                    descripcion: contenido.descripcion,
                    codigo_modulo: modulo.codigo,
                }
            ])
        }
        //Agrega el tema.
        setTemas([
            ...temas,
            { 
                codigo: codigo,
                descripcion: descripcion,
                codigo_contenido: contenido.codigo,
            }
        ])
    }   

    const handleQuitarTema = codigo => {  
        
        //Quita el tema.
        const new_temas = temas.filter(tema => tema.codigo !== codigo)
        setTemas(new_temas)
        //Quita los conceptos del tema.
        const new_conceptos = conceptos.filter(concepto => concepto.codigo_tema !== codigo)
        setConceptos(new_conceptos)

    }

    const handleAddConcepto = () => {   
        //Contenido actual seleccionado.
        const {codigo, descripcion} = concepto
        
        if(codigo === "0") return
        //Si el contenido ya existe, no lo vuelve a agregar.                   
        if(conceptos.filter(concepto => concepto.codigo === codigo).length > 0) return

        //Agrega el modulo del concepto si no existe.                  
        if(modulos.filter(mod => mod.codigo === modulo.codigo).length === 0){
            setModulos([
                ...modulos,
                { 
                    codigo: modulo.codigo,
                    descripcion: modulo.descripcion,
                }
            ])
        }
        
        //Agrega el contenido del concepto si no existe.                    
        if(contenidos.filter(cont => cont.codigo === contenido.codigo).length === 0){
            setContenidos([
                ...contenidos,
                { 
                    codigo: contenido.codigo,
                    descripcion: contenido.descripcion,
                    codigo_modulo: modulo.codigo,
                }
            ])
        }

        //Agrega el tema del concepto si no existe.                  
        if(temas.filter(tem => tem.codigo === tema.codigo).length === 0){
            setTemas([
                ...temas,
                { 
                    codigo: tema.codigo,
                    descripcion: tema.descripcion,
                    codigo_contenido: contenido.codigo,
                }
            ])
        }
        //Agrega el concepto.
        setConceptos([
            ...conceptos,
            { 
                codigo: codigo,
                descripcion: descripcion,
                codigo_tema: tema.codigo,
            }
        ])
    }   

    const handleQuitarConcepto = codigo => {  
        const new_conceptos = conceptos.filter(concepto => concepto.codigo !== codigo)
        setConceptos(new_conceptos)
    }

    const handleClickAceptar = () => {
        
        if(modulos.length === 0 && contenidos.length === 0 && temas.length === 0 && conceptos.length === 0){
             toast.error('La pregunta debe estar asociada al menos a una propiedad.', {containerId: 'sys_msg'})
             return
        }

        handleSetPropiedadesPregunta(modulos, contenidos, temas, conceptos)
        setCodigoMateria('0')
        //reinicia la unidad
        setCodigoUnidad('0')
        //reinicia el modulo
        setModulo({ codigo:'0', descripcion: '' })
        //reinicia el contenido.
        setContenido({ codigo: '0', descripcion: '' })
        //reinicia el tema.
        setTema({ codigo: '0', descripcion: '' })
        //reinicia el concepto.
        setConcepto({ codigo: '0', descripcion: '' })
        
        setShow(false)
    }

    return (
        <Modal show={show} onHide={() => {}} size="md">
        <Modal.Header>
          <Modal.Title>Configura tu pregunta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Row>
                <Col>
                    <Form.Group>
                        <InputSelectMateria
                            as="select"
                            size="sm"
                            value={codigo_materia}
                            onChange={e => {
                                setCodigoMateria(e.target.value)
                                //reinicia la unidad
                                setCodigoUnidad('0')
                                //reinicia el modulo
                                setModulo({
                                    codigo:'0',
                                    descripcion: '',
                                })
                                //reinicia el contenido.
                                setContenido({
                                    codigo: '0',
                                    descripcion: '',
                                })
                                //reinicia el tema.
                                setTema({
                                    codigo: '0',
                                    descripcion: '',
                                })
                                //reinicia el concepto.
                                setConcepto({
                                    codigo: '0',
                                    descripcion: '',
                                })
                            }}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group>
                        <InputSelectUnidadesMateria
                            /*codigo materia se le pasa a las props del componente
                            para filtrar las unidades de la materia seleccionada.*/
                            codigo_materia={codigo_materia}
                            as="select"
                            size="sm"
                            value={codigo_unidad}
                            onChange={e => {
                                setCodigoUnidad(e.target.value)
                                //reinicia el modulo
                                setModulo({
                                    codigo:'0',
                                    descripcion: '',
                                })
                                //reinicia el contenido.
                                setContenido({
                                    codigo: '0',
                                    descripcion: '',
                                })
                                //reinicia el tema.
                                setTema({
                                    codigo: '0',
                                    descripcion: '',
                                })
                                //reinicia el concepto.
                                setConcepto({
                                    codigo: '0',
                                    descripcion: '',
                                })
                            }}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group>
                        <InputSelectModulosUnidad
                            ref={modulo_ref}
                            /*codigo unidad se le pasa a las props del componente
                            para filtrar los modulos de la unidad seleccionada.*/
                            codigo_unidad={codigo_unidad}
                            as="select"
                            size="sm"
                            value={modulo.codigo}
                            onChange={e => {
                                let index = modulo_ref.current.selectedIndex
                                let descripcion = modulo_ref.current[index].text

                                setModulo({
                                    codigo: e.target.value,
                                    descripcion,
                                })
                                //reinicia el contenido.
                                setContenido({
                                    codigo: '0',
                                    descripcion: '',
                                })
                                //reinicia el tema.
                                setTema({
                                    codigo: '0',
                                    descripcion: '',
                                })
                                //reinicia el concepto.
                                setConcepto({
                                    codigo: '0',
                                    descripcion: '',
                                })

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
            {modulos.length > 0 &&
            <Row>
                <Col className="d-flex flex-wrap">
                {modulos.map(modulo => {
                    const {codigo, descripcion} = modulo
                    return(
                        <div
                            className="mx-1"
                            key={codigo}
                        >   
                            <h6>
                                <Badge pill variant="light">
                                    {descripcion}
                                    <span
                                        onClick={() => handleQuitarModulo(codigo)}
                                        style={{
                                            cursor: 'pointer',
                                            marginLeft: "5px",
                                        }}
                                    >
                                        <TiDelete 
                                            size={"1.3rem"} 
                                            color={"red"}
                                        />
                                    </span>
                                </Badge>
                            </h6>
                        </div>
                    )
                })}
                </Col>
            </Row>
            }
            <Row>
                <Col>
                    <Form.Group>
                        <InputSelectModulosContenido
                            ref={contenido_ref}
                            /*codigo modulo se le pasa a las props del componente
                            para filtrar los contenidos del modulo.*/
                            codigo_modulo={modulo.codigo}
                            as="select"
                            size="sm"
                            label="SELECCIONE CONTENIDO"
                            value={contenido.codigo}
                            onChange={e => {
                                
                                let index = contenido_ref.current.selectedIndex
                                let descripcion = contenido_ref.current[index].text

                                setContenido({
                                    codigo: e.target.value,
                                    descripcion,
                                })
                                //reinicia el tema.
                                setTema({
                                    codigo: '0',
                                    descripcion: '',
                                })
                                //reinicia el concepto.
                                setConcepto({
                                    codigo: '0',
                                    descripcion: '',
                                })
                            }}
                        />
                    </Form.Group>
                </Col>
                <Col xs="auto">
                    <Button
                        variant="success"
                        size="sm"
                        onClick={handleAddContenido}
                    >+ Agregar</Button>
                </Col>
            </Row>
            {contenidos.length > 0 &&
            <Row>
                <Col className="d-flex flex-wrap">
                {contenidos.map(contenido => {
                    const {codigo, descripcion} = contenido
                    return(
                        <div
                            className="mx-1"
                            key={codigo}
                        >   
                            <h6>
                                <Badge pill variant="light">
                                    {descripcion}
                                    <span
                                        onClick={() => handleQuitarContenido(codigo)}
                                        style={{
                                            cursor: 'pointer',
                                            marginLeft: "5px",
                                        }}
                                    >
                                        <TiDelete 
                                            size={"1.3rem"} 
                                            color={"red"}
                                        />
                                    </span>
                                </Badge>
                            </h6>
                        </div>
                    )
                })}
                </Col>
            </Row>
            }
            <Row>
                <Col>
                    <Form.Group>
                        <InputSelectModulosContenidoTema
                            ref={tema_ref}
                            /*codigo modulo contenido se le pasa a las props del componente
                            para filtrar los temas de un contenido*/
                            codigo_modulo_contenido={contenido.codigo}
                            as="select"
                            size="sm"
                            label="SELECCIONE  TEMA"
                            value={tema.codigo}
                            onChange={e => {
                                
                                let index = tema_ref.current.selectedIndex
                                let descripcion = tema_ref.current[index].text

                                setTema({
                                    codigo: e.target.value,
                                    descripcion,
                                })
                                //reinicia el concepto.
                                setConcepto({
                                    codigo: '0',
                                    descripcion: '',
                                })
                            }}
                        />
                    </Form.Group>
                </Col>
                <Col xs="auto">
                    <Button
                        variant="success"
                        size="sm"
                        onClick={handleAddTema}
                    >+ Agregar</Button>
                </Col>
            </Row>
            {temas.length > 0 &&
            <Row>
                <Col className="d-flex flex-wrap">
                {temas.map(tema => {
                    const {codigo, descripcion} = tema
                    return(
                        <div
                            className="mx-1"
                            key={codigo}
                        >   
                            <h6>
                                <Badge pill variant="light">
                                    {descripcion}
                                    <span
                                        onClick={() => handleQuitarTema(codigo)}
                                        style={{
                                            cursor: 'pointer',
                                            marginLeft: "5px",
                                        }}
                                    >
                                        <TiDelete 
                                            size={"1.3rem"} 
                                            color={"red"}
                                        />
                                    </span>
                                </Badge>
                            </h6>
                        </div>
                    )
                })}
                </Col>
            </Row>
            }
            <Row>
                <Col>
                    <Form.Group>
                        <InputSelectModulosContenidoTemaConcepto
                            ref={concepto_ref}
                            /*codigo modulo contenido se le pasa a las props del componente
                            para filtrar los conceptos de un tema*/
                            codigo_modulo_contenido_tema={tema.codigo}
                            as="select"
                            size="sm"
                            label="SELECCIONE CONCEPTO"
                            value={concepto.codigo}
                            onChange={e => {
                                
                                let index = concepto_ref.current.selectedIndex
                                let descripcion = concepto_ref.current[index].text

                                setConcepto({
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
                        onClick={handleAddConcepto}
                    >+ Agregar</Button>
                </Col>
            </Row>
            {conceptos.length > 0 &&
            <Row>
                <Col className="d-flex flex-wrap">
                {conceptos.map(concepto => {
                    const {codigo, descripcion} = concepto
                    return(
                        <div
                            className="mx-1"
                            key={codigo}
                        >   
                            <h6>
                                <Badge pill variant="light">
                                    {descripcion}
                                    <span
                                        onClick={() => handleQuitarConcepto(codigo)}
                                        style={{
                                            cursor: 'pointer',
                                            marginLeft: "5px",
                                        }}
                                    >
                                        <TiDelete 
                                            size={"1.3rem"} 
                                            color={"red"}
                                        />
                                    </span>
                                </Badge>
                            </h6>
                        </div>
                    )
                })}
                </Col>
            </Row>
            }
        </Modal.Body>
        <Modal.Footer>
            <Button
                variant="outline-primary"
                onClick={() => handleMostrarBusquedaPreguntas()}
            >
                Volver
            </Button>
            <Button 
                variant="info" 
                onClick={handleClickAceptar}
            >
                Aceptar
            </Button>
        </Modal.Footer>
        </Modal>
    )
}

export default ModalPreguntaConfig
