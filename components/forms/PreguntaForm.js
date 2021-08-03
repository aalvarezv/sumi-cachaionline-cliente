import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import { Container, Row, Col, Form, Image as ImageBt, Button, Card, Nav, Alert } from 'react-bootstrap'
import { TiDelete } from 'react-icons/ti'
import  clienteAxios from '../../config/axios'
import { getBase64, letras, handleError, getBase64FromURL, getMeta } from '../../helpers'
import AuthContext from '../../context/auth/AuthContext'
import ModalPreguntaConfig from '../ui/ModalPreguntaConfig'
import AlternativaPregunta from '../ui/AlternativaPregunta'
import PistaPregunta from '../ui/PistaPregunta'
import SolucionPregunta from '../ui/SolucionPregunta'
import Uploader from '../ui/Uploader'


const PreguntaForm = ({pregunta_modificar, handleMostrarBusquedaPreguntas}) => {

    const { usuario:{rut}} = useContext(AuthContext)

    const [show_config, setShowConfig] = useState(true)
    
    const [soluciones, setSoluciones] = useState([])
    const [modulos, setModulos] = useState([])
    const [contenidos, setContenidos] = useState([])
    const [temas, setTemas] = useState([])
    const [conceptos, setConceptos] = useState([])

    const [pregunta, setPregunta] = useState({
        rut_usuario_creador: rut,
        texto:'',
        imagen: '',
        imagen_ancho: 0,
        imagen_alto: 0,
        audio: '',
        video: '',
        duracion: 30,
        recordar: 0,
        comprender: 0,
        aplicar: 0,
        analizar: 0,
        evaluar: 0,
        crear: 0,
    })

    const [alternativas, setAlternativas] = useState([])
    const [numero_alternativas, setNumeroAlternativas] = useState(5)
    const [tab_select, setTabSelect] = useState('#tab_pregunta_imagen')

    const [pistas, setPistas] = useState([])

    const [error_solucion, setErrorSolucion] = useState([])
    const [error_pista, setErrorPista] = useState([])

    const [errores, setErrores] = useState({})

    //setea por defecto con el numero_alternativas para la pregunta.
    const iniciarAlternativas = () => {
        const letras_default = [
            ...letras
        ]
         const alternativas_default = letras_default.splice(0, numero_alternativas).map( (letra, index) => {
            return {
                codigo: uuidv4(),
                letra,
                correcta: false,
                numero: index + 1,
            }
        })
        setAlternativas(alternativas_default)
    } 

    useEffect(() => {
        iniciarAlternativas()
    }, [])
    
    //efecto que obtiene los datos de la pregunta a modificar.
    useEffect(() => {
 
        if(pregunta_modificar){
            const getDatosPregunta = async () => {
                
                let new_modulos = pregunta_modificar.pregunta_modulos.map(pregunta_modulo => {
                    return {
                        codigo: pregunta_modulo.codigo_modulo,
                        descripcion: pregunta_modulo.modulo.descripcion,
                    }
                })
                setModulos(new_modulos)

                let new_contenidos = pregunta_modificar.pregunta_modulo_contenidos.map(pregunta_modulo_contenido => {
                    return {
                        codigo: pregunta_modulo_contenido.codigo_modulo_contenido,
                        descripcion: pregunta_modulo_contenido.modulo_contenido.descripcion,
                        codigo_modulo: pregunta_modulo_contenido.modulo_contenido.codigo_modulo,
                    }
                })
                setContenidos(new_contenidos)

                let new_temas = pregunta_modificar.pregunta_modulo_contenido_temas.map(pregunta_modulo_contenido_tema => {
                    return {
                        codigo: pregunta_modulo_contenido_tema.codigo_modulo_contenido_tema,
                        descripcion: pregunta_modulo_contenido_tema.modulo_contenido_tema.descripcion,
                        codigo_contenido: pregunta_modulo_contenido_tema.modulo_contenido_tema.codigo_modulo_contenido,
                    }
                })
                setTemas(new_temas)

                let new_conceptos = pregunta_modificar.pregunta_modulo_contenido_tema_conceptos.map(pregunta_modulo_contenido_tema_concepto =>{
                    return {
                        codigo: pregunta_modulo_contenido_tema_concepto.codigo_modulo_contenido_tema_concepto,
                        descripcion: pregunta_modulo_contenido_tema_concepto.modulo_contenido_tema_concepto.descripcion,
                        codigo_tema: pregunta_modulo_contenido_tema_concepto.modulo_contenido_tema_concepto.codigo_modulo_contenido_tema,
                    }
                })
                setConceptos(new_conceptos)

                setPregunta({
                    ...pregunta,
                    rut_usuario_creador: pregunta_modificar.rut_usuario_creador,
                    texto: pregunta_modificar.texto,
                    imagen: pregunta_modificar.imagen,
                    audio: pregunta_modificar.audio,
                    video: pregunta_modificar.video,
                    duracion: pregunta_modificar.duracion,
                    recordar: pregunta_modificar.recordar,
                    comprender: pregunta_modificar.comprender,
                    aplicar: pregunta_modificar.aplicar,
                    analizar: pregunta_modificar.analizar,
                    evaluar: pregunta_modificar.evaluar,
                    crear: pregunta_modificar.crear,
                })
                setAlternativas(pregunta_modificar.pregunta_alternativa)
                setSoluciones(pregunta_modificar.pregunta_solucion)
                setPistas(pregunta_modificar.pregunta_pista)

            }
            getDatosPregunta()

        }

    },[])   
    

    //funcion que recibe el componente Uploader donde retorna los archivos a subir.
    const getMultimediaPregunta = async archivo => {

        const base64 = await getBase64(archivo[0]) 

        switch (archivo[0].type.split('/')[0]) {
            
            case 'image':
                const meta = await getMeta(base64)
                setPregunta({
                    ...pregunta,
                    imagen: base64,
                    imagen_ancho: meta.width,
                    imagen_alto: meta.height,
                    video: '',
                    audio: '',
                })
                break
            case 'video':
                setPregunta({
                    ...pregunta,
                    imagen: '',
                    imagen_ancho: 0,
                    imagen_alto: 0,
                    video: base64,
                    audio: '',
                })
                break
            case 'audio':{
                setPregunta({
                    ...pregunta,
                    imagen: '',
                    imagen_ancho: 0,
                    imagen_alto: 0,
                    video: '',
                    audio: base64,
                })
                break
            }
        }

    }

    const handleQuitarArchivoPregunta = () => {
        setPregunta({
            ...pregunta,
            imagen: '',
            imagen_ancho: 0,
            imagen_alto: 0,
            audio: '',
            video: '',
        })
    }

    const handleAgregarAlternativa = () => {
        setAlternativas([
            ...alternativas,
            {   
                codigo: uuidv4(),
                letra: letras[alternativas.length],
                correcta: false,
                numero: alternativas.length + 1,
            }
        ])
    }

    const handleAgregarPista = () => {
        setPistas([
            ...pistas,
            {   
                codigo: uuidv4(),
                numero: pistas.length + 1,
                texto: '',
                imagen: '',
                imagen_ancho: 0,
                imagen_alto: 0,
                audio: '',
                video: '',
            }
        ])
    }

    const handleAgregarSolucion = () => {
        setSoluciones([
            ...soluciones,
            {   
                codigo: uuidv4(),
                numero: soluciones.length + 1,
                texto: '',
                imagen: '',
                imagen_ancho: 0,
                imagen_alto: 0,
                audio: '',
                video: '',
            }
        ])
    }

    const handleSetPropiedadesPregunta = (modulos, contenidos, temas, conceptos) => {
        setModulos(modulos)
        setContenidos(contenidos)
        setTemas(temas)
        setConceptos(conceptos)
    }
    
    const validarFormulario = () => {
       
        //Verifica que haya ingresado una imagen a la pregunta.
        if(pregunta.imagen.trim() === '' && pregunta.video.trim() === '' && pregunta.audio.trim() === ''){
            toast.error('Agregue una imagen, video ó audio de la pregunta.', {containerId: 'sys_msg'})
            return false
        }

        if(pregunta.duracion <= 0 && pregunta.duracion === ''){
            toast.error('Debe ingresar el tiempo máximo para responder la pregunta.', {containerId: 'sys_msg'})
            return false
        }

        if(pregunta.recordar < 0 || pregunta.recordar > 1){
            toast.error('Recordar debe ser mayor o igual que 0 y menor o igual que 1', {containerId: 'sys_msg'})
            return false
        }


        if(pregunta.comprender < 0 || pregunta.comprender > 1){
            toast.error('Comprender debe ser mayor o igual que 0 y menor o igual que 1', {containerId: 'sys_msg'})
            return false
        }

        if(pregunta.aplicar < 0 || pregunta.aplicar > 1){
            toast.error('Aplicar debe ser mayor o igual que 0 y menor o igual que 1', {containerId: 'sys_msg'})
            return false
        }

        if(pregunta.analizar < 0 || pregunta.analizar > 1){
            toast.error('Analizar debe ser mayor o igual que 0 y menor o igual que 1', {containerId: 'sys_msg'})
            return false
        }

        if(pregunta.evaluar < 0 || pregunta.evaluar > 1){
            toast.error('Evaluar debe ser mayor o igual que 0 y menor o igual que 1', {containerId: 'sys_msg'})
            return false
        }

        if(pregunta.crear < 0 || pregunta.crear > 1){
            toast.error('Crear debe ser mayor o igual que 0 y menor o igual que 1', {containerId: 'sys_msg'})
            return false
        }

        if(pregunta.recordar+pregunta.comprender+pregunta.aplicar+pregunta.analizar+pregunta.evaluar+pregunta.crear !== 1){
            toast.error('La suma de las habilidades debe ser igual a 1', {containerId: 'sys_msg'})
            return false
        }
        
        
        //Verifica que exista al menos 2 alternativas posibles.
        if(alternativas.length < 2){
            toast.error('La pregunta debe tener al menos dos alternativas posible.', {containerId: 'sys_msg'})
            return false
        }
        //Verifica que existe al menos 1 alternativa seleccionada como correcta.
        if(alternativas.filter(alternativa => alternativa.correcta === true).length === 0 ){
            toast.error('Seleccione al menos una alternativa como la opción correcta.', {containerId: 'sys_msg'})
            return false
        }

        //Verifica que existe al menos una solución.
        if(soluciones.length === 0){
            toast.error('La pregunta debe tener al menos una solución posible.', {containerId: 'sys_msg'})
            return false
        }

        //Verifica que las soluciones tengan texto o una imagen.
        let new_error_solucion = soluciones.filter(solucion => solucion.texto === '' && solucion.imagen === '' && solucion.video === '' && solucion.audio === '')
        if(new_error_solucion.length > 0){
            toast.error('Verifique que todas las soluciones ingresadas tengan al menos un texto ó imagen asignados.', {containerId: 'sys_msg'})
            return false
        }

        //Si ha agregado alguna pista entonces.
        if(pistas.length > 0){
            //Verifica que las soluciones tengan texto o una imagen.
            let new_error_pista = pistas.filter(pista => pista.texto === '' && pista.imagen === '' && pista.video === '' && pista.audio === '')
            if(new_error_pista.length > 0){
                toast.error('Verifique que todas las pistas ingresadas tengan al menos un texto ó imagen asignados.', {containerId: 'sys_msg'})
                return false
            }
        }

        return true

    }

    const handleCreaPregunta = async () => {

        if(!validarFormulario()) return

        try{
            //Al grabar recien se genera el id de la pregunta.
            const codigo_pregunta = uuidv4()
            //Se crea el objeto que contendrá las preguntas, alternativas, soluciones y pistas.
            let pregunta_full = {
                ...pregunta,
                codigo : codigo_pregunta,
                alternativas: alternativas.map(alternativa => ({
                    ...alternativa,
                    codigo_pregunta,
                })),
                soluciones: soluciones.map(solucion => ({
                    ...solucion,
                    codigo_pregunta,
                })),
                pistas: pistas.map(pista => ({
                    ...pista,
                    codigo_pregunta,
                })),
                modulos: modulos.map(modulo => ({
                    ...modulo,
                    codigo_pregunta,
                })),
                contenidos: contenidos.map(contenido => ({
                    ...contenido,
                    codigo_pregunta,
                })),
                temas: temas.map(tema => ({
                    ...tema,
                    codigo_pregunta,
                })),
                conceptos: conceptos.map(concepto => ({
                    ...concepto,
                    codigo_pregunta,
                })),
            }

            await clienteAxios.post('/api/preguntas/crear', pregunta_full)
            
            resetearFormulario()

            toast.success('Pregunta creada', {containerId: 'sys_msg'})
        
        }catch(e){
            handleError(e)
        } 
    }

    const handleActualizaPregunta = async () => {

      
        //Verifica que existe un código a modificar
        if(!pregunta_modificar){
            toast.error('No existe una pregunta para actualizar', {containerId: 'sys_msg'})
            return
        } 

        //Valida que toda la información esté ingresada correctamente.
        if(!validarFormulario()) return
        //Primero elimina la pregunta, con sus alternativas, soluciones, imagenes (en disco), etc.
        try{
            //Crea nuevamente la pregunta con el mismo identificador.
            const codigo_pregunta = pregunta_modificar.codigo
            //Se crea el objeto que contendrá las preguntas, alternativas, soluciones y pistas.
            let pregunta_full = {
                ...pregunta,
                codigo : codigo_pregunta,
                alternativas: alternativas.map(alternativa => ({
                    ...alternativa,
                    codigo_pregunta,
                })),
                soluciones: soluciones.map(solucion => ({
                    ...solucion,
                    codigo_pregunta,
                })),
                pistas: pistas.map(pista => ({
                    ...pista,
                    codigo_pregunta,
                })),
                modulos: modulos.map(modulo => ({
                    ...modulo,
                    codigo_pregunta,
                })),
                contenidos: contenidos.map(contenido => ({
                    ...contenido,
                    codigo_pregunta,
                })),
                temas: temas.map(tema => ({
                    ...tema,
                    codigo_pregunta,
                })),
                conceptos: conceptos.map(concepto => ({
                    ...concepto,
                    codigo_pregunta,
                })),
            }

            await clienteAxios.put('/api/preguntas/actualizar', pregunta_full)
            toast.success('Pregunta actualizada', {containerId: 'sys_msg'})

            setErrores({})

        }catch(e){
            handleError(e)
        }

    }

    const resetearFormulario = () => {

        setPregunta({
            rut_usuario_creador: rut,
            texto:'',
            imagen: '',
            imagen_ancho: 0,
            imagen_alto: 0,
            audio: '',
            video: '',
            duracion: 30,
            recordar: 0,
            comprender: 0,
            aplicar: 0,
            analizar: 0,
            evaluar: 0,
            crear: 0,
        })
        iniciarAlternativas()
        setPistas([])
        setSoluciones([])
        setErrores({})

        setModulos([])
        setContenidos([])
        setTemas([])
        setConceptos([])
        
        setShowConfig(true)
       
    }
    
    return ( 
        <>
        <ModalPreguntaConfig 
            show={show_config}
            setShow={setShowConfig}
            modulos_init = {modulos}
            contenidos_init = {contenidos}
            temas_init = {temas}
            conceptos_init = {conceptos}
            handleSetPropiedadesPregunta = {handleSetPropiedadesPregunta}
            handleMostrarBusquedaPreguntas = {handleMostrarBusquedaPreguntas}
        />
        <Container className="p-3">
        <Row>
            <Col>
                <Alert variant="info">
                    Complete los campos para crear o actualizar la pregunta.
                </Alert>
            </Col>
            <Col xs="auto">
                <Button
                    variant="outline-dark"
                    size="lg"
                    onClick={() => {
                        setShowConfig(true)
                    }}
                >
                   Configuración
                </Button>
            </Col>
            <Col xs="auto">
                {!pregunta_modificar
                ?
                    <Button
                        variant="info"
                        size="lg"
                        onClick={handleCreaPregunta}
                    >
                        Crear
                    </Button>
                    
                :
                    <Button
                        variant="outline-info"
                        size="lg"
                        onClick={handleActualizaPregunta}
                    >
                        Actualizar
                    </Button>                
                }
            </Col>
            <Col xs="auto">
                <Button
                    variant="outline-primary"
                    size="lg"
                    onClick={handleMostrarBusquedaPreguntas}
                >
                   Volver
                </Button>
            </Col>
        </Row>
       
        <Card className="bg-light">
            <Card.Header>
                <Nav variant="tabs" className="text-info" defaultActiveKey={tab_select}>
                <Nav.Item>
                    <Nav.Link 
                        onClick={() => {
                            setTabSelect('#tab_pregunta_imagen')
                        }}
                        className="text-info"
                        href="#tab_pregunta_imagen">Imagen</Nav.Link>
                </Nav.Item>
                </Nav>
            </Card.Header>
            <Card.Body>
                {tab_select === "#tab_pregunta_imagen" &&
                    <Form.Group>
                        <Row>
                            <Col xs="4" className="d-flex justify-content-center">
                                <div
                                 style={{maxWidth: '300px', position:"relative"}}
                                >   
                                    {pregunta.imagen.trim() === '' && pregunta.audio.trim() === '' && pregunta.video.trim() === ''
                                    ?
                                        <ImageBt 
                                            src={'/static/img-pregunta.png'} 
                                            style={{opacity: 0.3}}
                                            thumbnail
                                        />
                                    :
                                        null
                                    }
                                    {pregunta.imagen.trim() !== '' &&
                                        <ImageBt
                                            src={pregunta.imagen.trim()} 
                                            style={{background: 'black'}}
                                            thumbnail
                                        />
                                    }
                                    {pregunta.audio.trim() !== '' &&
                                        <audio 
                                            style={{maxWidth: '100%'}}
                                            controls
                                        >
                                            <source src={pregunta.audio.trim()} />
                                        </audio>
                                    }
                                    {pregunta.video.trim() !== '' &&
                                        <video 
                                            style={{maxWidth: '100%'}}
                                            controls
                                        >
                                            <source src={pregunta.video.trim()} />
                                        </video>
                                    }

                                    {pregunta.imagen.trim() !== '' ||
                                     pregunta.video.trim() !== '' ||
                                     pregunta.audio.trim() !== ''
                                    ?
                                        <span
                                            onClick={handleQuitarArchivoPregunta}
                                            style={{
                                                position: 'absolute', 
                                                top: -16, 
                                                right: -13,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <TiDelete 
                                                size={"1.5rem"} 
                                                color={"red"}
                                            />
                                        </span>
                                    :
                                        null
                                    }
                                </div>
                            </Col>
                            <Col xs="4" className="d-flex justify-content-center">
                                <Nav variant="tabs" activeKey="opciones-pregunta">
                                    <Nav.Item>
                                        <Nav.Link eventKey="opciones-pregunta">Opciones</Nav.Link>
                                        <Container>     
                                        <Row>
                                            <Col>
                                                <Form.Group>
                                                    <Form.Label><small>Tiempo para responder (Segundos)</small></Form.Label>
                                                    <Form.Control
                                                        id="duracion"
                                                        name="duracion"
                                                        type="text" 
                                                        placeholder="DURACIÓN SEGUNDOS" 
                                                        value={pregunta.duracion}
                                                        onChange={e => {
                                                            setPregunta({
                                                                ...pregunta,
                                                            [e.target.name]: parseInt(e.target.value.replace(/\D/,'')),
                                                            })
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        </Container>
                                        
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col xs="4" className="d-flex justify-content-center py-0 ">
                                <Uploader 
                                    titulo={"HAZ CLICK O ARRASTRA Y SUELTA UNA IMAGEN, AUDIO O VIDEO"}
                                    formatosValidos={["image/*","audio/*","video/*"]}
                                    getArchivos={getMultimediaPregunta}
                                /> 
                            </Col>  
                        </Row>  
                    </Form.Group> 
                }
                <Row>
                    <Col>
                        <Alert variant="info">
                            La suma de las habilidades debe ser igual a 1.
                        </Alert>
                    </Col>
                </Row>
                <Row className="px-3">
                    <Col>
                        <Form.Label><small>Recordar</small></Form.Label>
                        <Form.Control
                            id="recordar"
                            name="recordar"
                            type="number" 
                            min={0}
                            max={1}
                            value={pregunta.recordar}
                            onChange={e => {
                                setPregunta({
                                    ...pregunta,
                                    [e.target.name]: parseFloat(e.target.value),
                                })        
                            }}
                        />
                    </Col>
                    <Col>
                        <Form.Label><small>Comprender</small></Form.Label>
                        <Form.Control
                            id="comprender"
                            name="comprender"
                            type="number" 
                            value={pregunta.comprender}
                            onChange={e => {setPregunta({
                                    ...pregunta,
                                [e.target.name]: parseFloat(e.target.value),
                                })
                            }}
                        />
                    </Col>
                    <Col>
                        <Form.Label><small>Aplicar</small></Form.Label>
                        <Form.Control
                            id="aplicar"
                            name="aplicar"
                            type="number" 
                            value={pregunta.aplicar}
                            onChange={e => {setPregunta({
                                    ...pregunta,
                                [e.target.name]: parseFloat(e.target.value),
                                })
                            }}
                        />
                    </Col>
                    <Col>
                        <Form.Label><small>Analizar</small></Form.Label>
                        <Form.Control
                            id="analizar"
                            name="analizar"
                            type="number" 
                            value={pregunta.analizar}
                            onChange={e => {setPregunta({
                                    ...pregunta,
                                [e.target.name]: parseFloat(e.target.value),
                                })
                            }}
                        />
                    </Col>
                    <Col>
                        <Form.Label><small>Evaluar</small></Form.Label>
                        <Form.Control
                            id="evaluar"
                            name="evaluar"
                            type="number" 
                            value={pregunta.evaluar}
                            onChange={e => {setPregunta({
                                    ...pregunta,
                                [e.target.name]: parseFloat(e.target.value),
                                })
                            }}
                        />
                    </Col>
                    <Col>
                        <Form.Label><small>Crear</small></Form.Label>
                        <Form.Control
                            id="crear"
                            name="crear"
                            type="number" 
                            value={pregunta.crear}
                            onChange={e => {setPregunta({
                                    ...pregunta,
                                [e.target.name]: parseFloat(e.target.value),
                                })
                            }}
                        />
                    </Col>
                </Row>
                <Row className="p-3">
                    <Col>
                        <Button
                            variant="info"
                            size="sm"
                            onClick={handleAgregarAlternativa}
                            block
                        >
                        + Pulsa para agregar Alternativas
                        </Button>
                    </Col>
                </Row>
                <Row className="px-2 ml-3">
                    
                    <AlternativaPregunta 
                        alternativas = {alternativas}
                        setAlternativas = {setAlternativas}
                    /> 
                </Row>
                <Row className="px-3"> 
                    <Col>
                        <Button
                            variant="info"
                            size="sm"
                            onClick={handleAgregarSolucion}
                            block
                        >
                        + Pulsa para agregar Soluciones
                        </Button>
                    </Col>
                </Row>
                <Row className="py-2">
                    <SolucionPregunta  
                        soluciones = {soluciones}
                        errores = {error_solucion}
                        setSoluciones = {setSoluciones}
                    />
                </Row>
                <Row className="px-3">
                    <Col>
                        <Button
                            variant="info"
                            size="sm"
                            onClick={handleAgregarPista}
                            block
                        >
                        + Pulsa para agregar Pistas
                        </Button>
                    </Col>
                </Row>
                <Row className="py-2">
                    <PistaPregunta  
                        pistas = {pistas}
                        errores = {error_pista}
                        setPistas = {setPistas}
                    />
                </Row>
                
            </Card.Body>
        </Card>  
        </Container>
        </>
     )
}
 
export default PreguntaForm