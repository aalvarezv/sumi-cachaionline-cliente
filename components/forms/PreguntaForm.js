import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { Container, Row, Col, Form, Image, Button, Card, Nav, Alert } from 'react-bootstrap';
import { TiDelete } from 'react-icons/ti';
import  clienteAxios from '../../config/axios';
import { getBase64, letras, handleError, getBase64FromURL } from '../../helpers';
import AuthContext from '../../context/auth/AuthContext';
import PreguntaModalConfig from './PreguntaModalConfig';
import AlternativaPregunta from '../ui/AlternativaPregunta';
import PistaPregunta from '../ui/PistaPregunta';
import SolucionPregunta from '../ui/SolucionPregunta';
import Uploader from '../ui/Uploader';


const PreguntaForm = ({pregunta_modificar, handleMostrarBusquedaPreguntas}) => {

    const { usuario:{rut}} = useContext(AuthContext);

    const [show_config, setShowConfig] = useState(true);
    const [pregunta, setPregunta] = useState({
        rut_usuario_creador: rut,
        texto:'',
        imagen: '',
        audio: '',
        video: '',
    });
    const [alternativas, setAlternativas] = useState([]);
    const [pistas, setPistas] = useState([]);
    const [soluciones, setSoluciones] = useState([]);
    const [modulos, setModulos] = useState([]);
    const [numero_alternativas, setNumeroAlternativas] = useState(5);
    const [tab_select, setTabSelect] = useState('#tab_pregunta_imagen')

    const [error_solucion, setErrorSolucion] = useState([]);
    const [error_pista, setErrorPista] = useState([]);

    //setea por defecto con el numero_alternativas para la pregunta.
    const iniciarAlternativas = () => {
        const letras_default = [
            ...letras
        ];
         const alternativas_default = letras_default.splice(0, numero_alternativas).map( (letra, index) => {
            return {
                codigo: uuidv4(),
                letra,
                correcta: false,
                numero: index + 1,
            }
        });
        setAlternativas(alternativas_default);
    } 

    useEffect(() => {
        iniciarAlternativas();
    }, [])
    
    //efecto que obtiene los datos de la pregunta a modificar.
    useEffect(() => {
        
        if(pregunta_modificar){
            const getDatosPregunta = async () => {
                
                //leer modulo y modulo_contenidos para ajustar a la estructura del state.
                /**
                 * {
                 *  codigo: '1', 
                 *  descripcion: 'modulo', 
                 *  contenidos: [{codigo: '1', descripcion: 'PROP 1'}]
                 * }
                 */
                const modulos = pregunta_modificar.pregunta_modulos.map(mod => {
                    
                    let modulo = {
                        codigo: mod.codigo_modulo,
                        descripcion: mod.modulo.descripcion
                    }
                    //Recorre los contenidos de la pregunta.
                    for(const contenido of pregunta_modificar.pregunta_modulo_contenido){
                        console.log('ENTRA A RECORRER EL CONTENIDO');
                        //Si el codigo modulo del contenido es igual al módulo en curso, entonces se la agrega.
                        if(contenido.modulo_contenido.codigo_modulo === mod.codigo_modulo){

                            //verifica si existe el atributo propiedades en el módulo
                            if(modulo.hasOwnProperty('contenidos')){
                               
                                modulo = {
                                    ...modulo,
                                    contenidos: [
                                        ...modulo.contenidos,
                                        {
                                            codigo: contenido.modulo_contenido.codigo,
                                            descripcion: contenido.modulo_contenido.descripcion,
                                        }
                                    ]
                                }
                            
                            //si no existe se la agrega
                            }else{
                                modulo = {
                                    ...modulo,
                                    contenidos: [{
                                        codigo: contenido.modulo_contenido.codigo,
                                        descripcion: contenido.modulo_contenido.descripcion,
                                    }]
                                }
                            }

                        }

                    }
                    return modulo;

                });

                setModulos(modulos);

                setAlternativas(pregunta_modificar.pregunta_alternativa);

                setPregunta({
                    ...pregunta,
                    rut_usuario_creador: pregunta_modificar.rut_usuario_creador,
                    texto: pregunta_modificar.texto,
                    imagen: await getBase64FromURL(pregunta_modificar.imagen),
                    audio: pregunta_modificar.audio,
                    video: pregunta_modificar.video,
                });

                let new_pregunta_solucion = [];
                for(const pregunta_solucion of pregunta_modificar.pregunta_solucion){
                    new_pregunta_solucion.push({
                        ...pregunta_solucion,
                        imagen: await getBase64FromURL(pregunta_solucion.imagen),
                    });
                }
                setSoluciones(new_pregunta_solucion);

                let new_pregunta_pista = [];
                for(const pregunta_pista of pregunta_modificar.pregunta_pista){
                    new_pregunta_pista.push({
                        ...pregunta_pista,
                        imagen: await getBase64FromURL(pregunta_pista.imagen),
                    });
                }
                setPistas(new_pregunta_pista);

            }
            getDatosPregunta();

        }

    },[]);

    
    //funcion que recibe el componente Uploader donde retorna los archivos a subir.
    const getMultimediaPregunta = async archivo => {

        const base64 = await getBase64(archivo[0]);
        setPregunta({
            ...pregunta,
            imagen: base64,
        });
    }

    const handleQuitarImagenPregunta = () => {
        setPregunta({
            ...pregunta,
            imagen: '',
        });
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
        ]);
    }

    const handleAgregarPista = () => {
        setPistas([
            ...pistas,
            {   
                codigo: uuidv4(),
                numero: pistas.length + 1,
                texto: '',
                imagen: '',
            }
        ]);
    }

    const handleAgregarSolucion = () => {
        setSoluciones([
            ...soluciones,
            {   
                codigo: uuidv4(),
                numero: soluciones.length + 1,
                texto: '',
                imagen: '',
            }
        ]);
    }

    const handleSetModulos = modulos => {
        setModulos(modulos);
    }
    
    const validarFormulario = () => {
        
        setErrorSolucion([]);
        setErrorPista([]);
        //Verifica que haya ingresado una imagen a la pregunta.
        if(pregunta.imagen.trim() === ''){
            toast.warning('Agregue la imagen de la pregunta.', {containerId: 'sys_msg'});
            return false;
        }

        //Verifica que exista al menos 2 alternativas posibles.
        if(alternativas.length < 2){
            toast.warning('La pregunta debe tener al menos dos alternativas posible.', {containerId: 'sys_msg'});
            return false;
        }
        //Verifica que existe al menos 1 alternativa seleccionada como correcta.
        if(alternativas.filter(alternativa => alternativa.correcta === true).length === 0 ){
            toast.warning('Seleccione al menos una alternativa como la opción correcta.', {containerId: 'sys_msg'});
            return false;
        }

        //Verifica que existe al menos una solución.
        if(soluciones.length === 0){
            toast.warning('La pregunta debe tener al menos una solución posible.', {containerId: 'sys_msg'});
            return false;
        }

        //Verifica que las soluciones tengan texto o una imagen.
        let new_error_solucion = soluciones.filter(solucion => solucion.texto === '' && solucion.imagen === '')
        if(new_error_solucion.length > 0){
            toast.warning('Verifique que todas las soluciones ingresadas tengan al menos un texto ó imagen asignados.', {containerId: 'sys_msg'});
            setErrorSolucion(new_error_solucion);
            return false;
        }

        //Si ha agregado alguna pista entonces.
        if(pistas.length > 0){
            //Verifica que las soluciones tengan texto o una imagen.
            let new_error_pista = pistas.filter(pista => pista.texto === '' && pista.imagen === '')
            if(new_error_pista.length > 0){
                toast.warning('Verifique que todas las pistas ingresadas tengan al menos un texto ó imagen asignados.', {containerId: 'sys_msg'});
                setErrorPista(new_error_pista)
                return false;
            }
        }

        return true;

    }

    const handleCreaPregunta = async () => {

        if(!validarFormulario()) return;

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
            }

            await clienteAxios.post('/api/preguntas/crear', pregunta_full);
            
            setPregunta({
                rut_usuario_creador: rut,
                texto:'',
                imagen: '',
                audio: '',
                video: '',
            });
            iniciarAlternativas();
            setPistas([]);
            setSoluciones([]);

            toast.success('PREGUNTA CREADA', {containerId: 'sys_msg'});
        
        }catch(e){
            handleError(e);
        } 
    }

    const handleActualizaPregunta = async () => {
        //Verifica que existe un código a modificar
        if(!pregunta_modificar){
            toast.error('No existe una pregunta para actualizar', {containerId: 'sys_msg'});
            return;
        } 

        //Valida que toda la información esté ingresada correctamente.
        if(!validarFormulario()) return;
        //Primero elimina la pregunta, con sus alternativas, soluciones, imagenes (en disco), etc.
        try{
            //Elimina.
            await clienteAxios.delete(`/api/preguntas/eliminar/${pregunta_modificar.codigo}`);
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
            }

            await clienteAxios.post('/api/preguntas/crear', pregunta_full);
            toast.success('PREGUNTA ACTUALIZADA', {containerId: 'sys_msg'});

        }catch(e){
            handleError(e);
        }

    }
    
    return ( 
        <>
        <PreguntaModalConfig 
            show={show_config}
            setShow={setShowConfig}
            modulos_init = {modulos}
            handleSetModulos = {handleSetModulos}
        />
        <Container className="p-3">
        <Row>
            <Col>
                <Alert variant="info" className="text-muted">
                    Aquí va una instrucción para crear la pregunta.
                </Alert>
            </Col>
            <Col xs="auto">
                <Button
                    variant="outline-dark"
                    size="lg"
                    onClick={() => {
                        setShowConfig(true);
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
                   Ir a buscar
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
                            <Col xs="auto">
                                <div
                                 style={{width: 200, position:"relative"}}
                                >
                                    <Image 
                                        src={pregunta.imagen.trim() === '' ? '/static/no-image.png' : pregunta.imagen.trim()} 
                                        thumbnail
                                    />
                                    {pregunta.imagen.trim() !== '' &&
                                        <span
                                            onClick={handleQuitarImagenPregunta}
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
                                    }
                                </div>
                            </Col>
                            <Col>
                                <Uploader 
                                    titulo={"HAZ CLICK O ARRASTRA Y SUELTA UNA IMAGEN"}
                                    getArchivos={getMultimediaPregunta}
                                />
                            </Col>  
                        </Row>  
                    </Form.Group> 
                }  
                <Row>
                    <Col xs={9}>
                        <Alert variant="info" className="text-muted"> 
                            Aquí va la instrucción para crear las alternativas.
                        </Alert> 
                    </Col>
                    <Col xs={3}>
                        <Button
                            variant="info"
                            size="lg"
                            onClick={handleAgregarAlternativa}
                            block
                        >
                        + Alternativa
                        </Button>
                    </Col>
                </Row>
                <Row className="px-3">
                    <AlternativaPregunta 
                        alternativas = {alternativas}
                        setAlternativas = {setAlternativas}
                    /> 
                </Row>
                <Row>
                    <Col xs={9}>
                        <Alert variant="info" className="text-muted"> 
                            Aquí va la instrucción para crear la solución.
                        </Alert> 
                    </Col>
                    <Col xs={3}>
                        <Button
                            variant="info"
                            size="lg"
                            onClick={handleAgregarSolucion}
                            block
                        >
                        + Soluciones
                        </Button>
                    </Col>
                </Row>
                <Row className="px-3">
                    <SolucionPregunta  
                        soluciones = {soluciones}
                        errores = {error_solucion}
                        setSoluciones = {setSoluciones}
                    />
                </Row>
                <Row>
                    <Col xs={9}>
                        <Alert variant="info" className="text-muted"> 
                            Aquí va la instrucción para crear las pistas.
                        </Alert> 
                    </Col>
                    <Col xs={3}>
                        <Button
                            variant="info"
                            size="lg"
                            onClick={handleAgregarPista}
                            block
                        >
                        + Pistas
                        </Button>
                    </Col>
                </Row>
                <Row className="px-3">
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
     );
}
 
export default PreguntaForm;