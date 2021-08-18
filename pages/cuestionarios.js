import React, { createRef, useContext, useState, useEffect } from 'react'
import { Button,Card, Col, Container, Form, Row, Tabs, Tab } from 'react-bootstrap'
import CustomDateInput from '../components/ui/CustomDateInput'
import InputSelectMateria from '../components/ui/InputSelectMateria'
import Uploader from '../components/ui/Uploader'
import { getBase64, handleError, validURL } from '../helpers'
import DatePicker from 'react-datepicker'
import clienteAxios from '../config/axios'
import AuthContext from '../context/auth/AuthContext'
import Layout from '../components/layout/Layout'
import { toast } from 'react-toastify'
import InputSelectCuestionario from '../components/ui/InputSelectCuestionario'
import Spinner from '../components/ui/Spinner'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { TiDelete } from 'react-icons/ti'
import EstadisticaCuestionario from '../components/ui/EstadisticaCuestionario'



const CargaCuestionarioSugerencias = ({activeTab}) => {

    const { usuario } = useContext(AuthContext)
    const ref_fecha_cuestionario = createRef()

    const [isLoading, setIsLoading] = useState(false)

    const [cuestionario, setCuestionario] = useState({
        codigo_materia: '0',
        nombre_cuestionario: '',
        fecha_cuestionario: new Date(),
        link_cuestionario: '',
        archivo_base64: '',
    })

    const {
        codigo_materia, 
        nombre_cuestionario, 
        fecha_cuestionario, 
        link_cuestionario,
        archivo_base64
    } = cuestionario

    useEffect(() => {
        reseteaFiltros()
    }, [activeTab])

    //funcion que recibe el componente Uploader donde retorna los archivos a subir.
    const getArchivos = async archivos => {
    
        const base64 = await getBase64(archivos[0])
        setCuestionario({
            ...cuestionario,
            archivo_base64: base64
        })

    }

    const reseteaFiltros = () => {
        setCuestionario({
            codigo_materia: '0',
            nombre_cuestionario: '',
            fecha_cuestionario: new Date(),
            link_cuestionario: '',
            archivo_base64: '',
        })
    }

    const handleCargarArchivo = async () => {

        if(codigo_materia === '0'){
            toast.error('Seleccione materia', {containerId: 'sys_msg'})
            return
        }

        if(nombre_cuestionario.trim() === ''){
            toast.error('Ingrese nombre del cuestionario', {containerId: 'sys_msg'})
            return
        }

        if(link_cuestionario.trim() !== ''){
            if(!validURL(link_cuestionario)){
                toast.error('Ingrese una url valida', {containerId: 'sys_msg'})
                return
            }
        }
      
        if(archivo_base64.trim() === ''){
            toast.error('Seleccione archivo excel para cargar las sugerencias', {containerId: 'sys_msg'})
            return
        }

        setIsLoading(true)
        setTimeout(async() => {

            try {

                const resp = await clienteAxios.post('/api/cuestionario-sugerencias/cargar-preguntas', {
                    rut_usuario: usuario.rut, 
                    nombre_cuestionario,
                    codigo_materia,
                    fecha_cuestionario,
                    link_cuestionario,
                    archivo_base64
                })
                setIsLoading(false)
                toast.success('Sugerencias cargadas correctamente', {containerId: 'sys_msg'})
                reseteaFiltros()

            } catch (e) {
                setIsLoading(false)
                handleError(e)
            }
            
        }, 2000)
            
    }
    
    return (
        <Container>
            <Row className="mb-1">
                <Col>
                    <DatePicker
                        id="fecha_cuestionario"
                        name="fecha_cuestionario"
                        selected={fecha_cuestionario}
     
                        dateFormat="dd/MM/yyyy"
                        onChange={(date) => {
                            setCuestionario({
                                ...cuestionario,
                                fecha_cuestionario : date,
                            })
                        }}
                        customInput={
                            <CustomDateInput 
                                label="Fecha cuestionario"
                                ref = {ref_fecha_cuestionario}
                            />
                        }
                    />
                </Col>
            </Row>
            <Row className="mb-1">
                <Col>
                    <InputSelectMateria
                        id="codigo_materia"
                        name="codigo_materia"
                        as="select"
                        label="SELECCIONE MATERIA"
                        value={codigo_materia}
                        onChange={e => {
                            setCuestionario({
                                ...cuestionario,
                                [e.target.name]: e.target.value 
                            })
                        }}
                    />
                </Col>
            </Row>
            <Row className="mb-1">
                <Col>
                    <Form.Control
                        id="nombre_cuestionario"
                        name="nombre_cuestionario"
                        type="text" 
                        placeholder="NOMBRE CUESTIONARIO" 
                        value={nombre_cuestionario}
                        onChange={e => {
                            setCuestionario({
                                ...cuestionario,
                                [e.target.name]: e.target.value
                            })
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Control
                        id="link_cuestionario"
                        name="link_cuestionario"
                        type="text" 
                        placeholder="LINK CUESTIONARIO EJEMPLO: https://www.cachaionline.com" 
                        value={link_cuestionario}
                        onChange={e => {
                            setCuestionario({
                                ...cuestionario,
                                [e.target.name]: e.target.value
                            })
                        }}
                    />
                </Col>
            </Row>
            <Row style={{height: 150}}>
                <Col className="p-3">
                    {archivo_base64.trim() === ''
                    ?
                        <Uploader 
                            titulo={"HAZ CLICK O ARRASTRA Y SUELTA UN ARCHIVO EXCEL"}
                            formatosValidos={[
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                "application/vnd.ms-excel"
                            ]}
                            getArchivos={getArchivos}
                        />
                    :
                    <div className="d-flex justify-content-center">
                        <span
                            style={{
                                position: 'relative',
                                
                            }}
                        >
                            <TiDelete 
                                size={"1.5rem"} 
                                color={"red"}
                                style={{
                                    position:'absolute',
                                    top: -10,
                                    right: -10,
                                    cursor: 'pointer'
                                }}
                                onClick={() => setCuestionario({
                                    ...cuestionario,
                                    archivo_base64: ''
                                })}
                            />
                            <RiFileExcel2Fill
                                size={"6rem"} 
                                color={"green"}
                            />
                            
                        </span>
                    </div>
                    }
                    
                </Col>
            </Row> 
            <Row className="mt-5">
                
                <Col className="d-flex justify-content-center">
                    {isLoading
                    ?
                        <Spinner/>
                    :
                        <Button
                            variant="info"
                            size="lg"
                            onClick={handleCargarArchivo}
                        >
                            Cargar Sugerencias
                        </Button>
                    }
                </Col>
            </Row>           
        </Container>
    )

}

const EnviaRespuestasCuestionario = ({activeTab}) => {

    const { usuario } = useContext(AuthContext)
    const ref_fecha_cuestionario_desde = createRef()
    const ref_fecha_cuestionario_hasta = createRef()

    const [isLoading, setIsLoading] = useState(false)

    const [cuestionario, setCuestionario] = useState({
        fecha_cuestionario_desde: new Date(),
        fecha_cuestionario_hasta: new Date(),
        codigo_materia: '0',
        codigo_cuestionario: '0',
        archivo_base64: '',
    })

    const {
        fecha_cuestionario_desde, 
        fecha_cuestionario_hasta, 
        codigo_materia, 
        codigo_cuestionario, 
        archivo_base64 } = cuestionario

    useEffect(() => {
        reseteaFiltros()
    }, [activeTab])

    const getArchivos = async archivos => {
    
        const base64 = await getBase64(archivos[0])
        setCuestionario({
            ...cuestionario,
            archivo_base64: base64
        })

    }

    const reseteaFiltros = () => {
        setCuestionario({
            fecha_cuestionario_desde: new Date(),
            fecha_cuestionario_hasta: new Date(),
            codigo_materia: '0',
            codigo_cuestionario: '0',
            archivo_base64: '',
        })
    }

    const handleEnviarSugerencias = async () => {

        if(codigo_materia === '0'){
            toast.error('Seleccione materia', {containerId: 'sys_msg'})
            return
        }

        if(codigo_cuestionario.trim() === '0'){
            toast.error('Seleccione cuestionario', {containerId: 'sys_msg'})
            return
        }

        if(archivo_base64.trim() === ''){
            toast.error('Seleccione archivo excel con resultados del cuestionario', {containerId: 'sys_msg'})
            return
        }

        setIsLoading(true)
        setTimeout(async() => {

            try {
                
                const resp = await clienteAxios.post('/api/cuestionario-respuestas/enviar', {
                    codigo_cuestionario,
                    archivo_base64
                })
                setIsLoading(false)
                toast.success('Respuestas enviadas correctamente', {containerId: 'sys_msg'})
                reseteaFiltros()

            } catch (e) {
                setIsLoading(false)
                handleError(e)
            }

        }, 500);
            
    }

    return(
        <Container>
        <Row className="mb-1">
            <Col sm="auto">
                <DatePicker
                    id="fecha_cuestionario_desde"
                    name="fecha_cuestionario_desde"
                    selected={fecha_cuestionario_desde}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => {
                        setCuestionario({
                            ...cuestionario,
                            fecha_cuestionario_desde : date,
                            codigo_cuestionario: '0',
                        })
                    }}
                    customInput={
                        <CustomDateInput 
                            label="Fecha cuestionario Desde"
                            ref = {ref_fecha_cuestionario_desde}
                        />
                    }
                />
            </Col>
            <Col>
                <DatePicker
                    id="fecha_cuestionario_hasta"
                    name="fecha_cuestionario_hasta"
                    selected={fecha_cuestionario_hasta}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => {
                        setCuestionario({
                            ...cuestionario,
                            fecha_cuestionario_hasta : date,
                            codigo_cuestionario: '0',
                        })
                    }}
                    customInput={
                        <CustomDateInput 
                            label="Fecha cuestionario Hasta"
                            ref = {ref_fecha_cuestionario_hasta}
                        />
                    }
                />
            </Col>
        </Row>
        <Row className="mb-1">
            <Col>
                <InputSelectMateria
                    id="codigo_materia"
                    name="codigo_materia"
                    as="select"
                    label="SELECCIONE MATERIA"
                    value={codigo_materia}
                    onChange={e => {
                        setCuestionario({
                            ...cuestionario,
                            [e.target.name]: e.target.value,
                            codigo_cuestionario: '0', 
                        })
                    }}
                />
            </Col>
        </Row>
        <Row>
            <Col>
                {usuario &&
                    <InputSelectCuestionario
                        id="codigo_cuestionario"
                        name="codigo_cuestionario"
                        rut_usuario={usuario.rut}
                        codigo_materia={codigo_materia}
                        fecha_cuestionario_desde={fecha_cuestionario_desde}
                        fecha_cuestionario_hasta={fecha_cuestionario_hasta}
                        as="select"
                        value={codigo_cuestionario}
                        onChange={e => setCuestionario({
                            ...cuestionario,
                            [e.target.name]: e.target.value
                        })}
                    
                    />
                }
            </Col>    
        </Row>
        <Row style={{height: 150}}>
            <Col className="p-3">
                {archivo_base64.trim() === ''
                ?
                    <Uploader 
                        titulo={"HAZ CLICK O ARRASTRA Y SUELTA UN ARCHIVO EXCEL"}
                        formatosValidos={[
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            "application/vnd.ms-excel"
                        ]}
                        getArchivos={getArchivos}
                    />
                :
                    <div className="d-flex justify-content-center">
                        <span
                            style={{
                                position: 'relative',
                                
                            }}
                        >
                            <TiDelete 
                                size={"1.5rem"} 
                                color={"red"}
                                style={{
                                    position:'absolute',
                                    top: -10,
                                    right: -10,
                                    cursor: 'pointer'
                                }}
                                onClick={() => setCuestionario({
                                    ...cuestionario,
                                    archivo_base64: ''
                                })}
                            />
                            <RiFileExcel2Fill
                                size={"6rem"} 
                                color={"green"}
                            />
                            
                        </span>
                    </div>
                }
            </Col>
        </Row>
        <Row className="mt-5">
            <Col className="d-flex justify-content-center">
                {isLoading
                ?
                    <Spinner/>
                :
                    <Button
                        variant="info"
                        size="lg"
                        onClick={handleEnviarSugerencias}
                    >
                        Enviar Respuestas
                    </Button>
                }
            </Col>
        </Row>      
        </Container>
    )

}

const Cuestionario = () => {

    const [tabKey, setTabKey] = useState('carga-respuestas-sugerencias');

    return ( 
        <Layout>
            <Container className="mt-5">
                <h5 className="text-center my-4">Cuestionarios</h5>
                <Row className="justify-content-sm-center">
                    <Col>
                        <Card>
                            <Card.Body>
                                <Tabs 
                                    defaultActiveKey="carga-respuestas-sugerencias" 
                                    id="quest-tab" 
                                    className="mb-3"
                                    activeKey={tabKey}
                                    onSelect={(k) => setTabKey(k)}
                                >
                                <Tab eventKey="carga-respuestas-sugerencias" title="Respuestas correctas y sugerencias">
                                    <CargaCuestionarioSugerencias 
                                        activeTab={tabKey}
                                    />
                                </Tab>
                                <Tab eventKey="respuesta-alumnos" title="Respuesta alumnos">
                                    <EnviaRespuestasCuestionario 
                                        activeTab={tabKey}
                                    />
                                </Tab>
                                <Tab eventKey="estadistica" title="Estadísticas">
                                    <EstadisticaCuestionario 
                                        activeTab={tabKey}
                                    />
                                </Tab>
                                </Tabs>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Layout>
     );
}
 
export default Cuestionario