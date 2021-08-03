import React, { createRef, useContext, useState } from 'react'
import { Button,Card, Col, Container, Form, Row, Tabs, Tab } from 'react-bootstrap'
import CustomDateInput from '../components/ui/CustomDateInput'
import InputSelectMateria from '../components/ui/InputSelectMateria'
import Uploader from '../components/ui/Uploader'
import { getBase64, handleError } from '../helpers'
import DatePicker from 'react-datepicker'
import clienteAxios from '../config/axios'
import AuthContext from '../context/auth/AuthContext'
import Layout from '../components/layout/Layout'
import { toast } from 'react-toastify'
import InputSelectFormSugerencias from '../components/ui/InputSelectFormSugerencias'
import Spinner from '../components/ui/Spinner'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { TiDelete } from 'react-icons/ti'



const CargaRespuestasSugerencias = () => {

    const { usuario } = useContext(AuthContext)
    const ref_fecha_formulario = createRef()

    const [isLoading, setIsLoading] = useState(false)

    const [formulario, setFormulario] = useState({
        codigo_materia: '0',
        nombre_formulario: '',
        fecha_formulario: new Date(),
        archivo_base64: '',
    })

    const {
        codigo_materia, 
        nombre_formulario, 
        fecha_formulario, 
        archivo_base64} = formulario


    //funcion que recibe el componente Uploader donde retorna los archivos a subir.
    const getArchivos = async archivos => {
    
        const base64 = await getBase64(archivos[0])
        setFormulario({
            ...formulario,
            archivo_base64: base64
        })

    }

    const reseteaFormulario = () => {
        setFormulario({
            codigo_materia: '0',
            nombre_formulario: '',
            fecha_formulario: new Date(),
            archivo_base64: '',
        })
    }

    const handleCargarArchivo = async () => {

        if(codigo_materia === '0'){
            toast.error('Seleccione materia', {containerId: 'sys_msg'})
            return
        }

        if(nombre_formulario.trim() === ''){
            toast.error('Ingrese nombre del formulario', {containerId: 'sys_msg'})
            return
        }

        if(archivo_base64.trim() === ''){
            toast.error('Seleccione archivo excel para cargar las sugerencias', {containerId: 'sys_msg'})
            return
        }

        setIsLoading(true)
        setTimeout(async() => {

            try {

                const resp = await clienteAxios.post('/api/sugerencia-alternativa-pregunta/cargar-preguntas', {
                    rut_usuario: usuario.rut, 
                    nombre_formulario,
                    codigo_materia,
                    fecha_formulario,
                    archivo_base64
                })
                setIsLoading(false)
                toast.success('Sugerencias cargadas correctamente', {containerId: 'sys_msg'})
                reseteaFormulario()

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
                        id="fecha_formulario"
                        name="fecha_formulario"
                        selected={fecha_formulario}
     
                        dateFormat="dd/MM/yyyy"
                        onChange={(date) => {
                            setFormulario({
                                ...formulario,
                                fecha_formulario : date,
                            })
                        }}
                        customInput={
                            <CustomDateInput 
                                label="Fecha Formulario"
                                ref = {ref_fecha_formulario}
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
                            setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value 
                            })
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Control
                        id="nombre_formulario"
                        name="nombre_formulario"
                        type="text" 
                        placeholder="NOMBRE FORMULARIO" 
                        value={nombre_formulario}
                        onChange={e => {
                            setFormulario({
                                ...formulario,
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
                                onClick={() => setFormulario({
                                    ...formulario,
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


const EnviaRespuestas = () => {

    const { usuario } = useContext(AuthContext)
    const ref_fecha_formulario_desde = createRef()
    const ref_fecha_formulario_hasta = createRef()

    const [isLoading, setIsLoading] = useState(false)

    const [formulario, setFormulario] = useState({
        fecha_formulario_desde: new Date(),
        fecha_formulario_hasta: new Date(),
        codigo_materia: '0',
        nombre_formulario: '0',
        archivo_base64: '',
    })

    const {
        fecha_formulario_desde, 
        fecha_formulario_hasta, 
        codigo_materia, 
        nombre_formulario, 
        archivo_base64 } = formulario

    const getArchivos = async archivos => {
    
        const base64 = await getBase64(archivos[0])
        setFormulario({
            ...formulario,
            archivo_base64: base64
        })

    }

    const reseteaFormulario = () => {
        setFormulario({
            fecha_formulario_desde: new Date(),
            fecha_formulario_hasta: new Date(),
            codigo_materia: '0',
            nombre_formulario: '0',
            archivo_base64: '',
        })
    }

    const handleEnviarSugerencias = async () => {

        if(codigo_materia === '0'){
            toast.error('Seleccione materia', {containerId: 'sys_msg'})
            return
        }

        if(nombre_formulario.trim() === '0'){
            toast.error('Seleccione formulario', {containerId: 'sys_msg'})
            return
        }

        if(archivo_base64.trim() === ''){
            toast.error('Seleccione archivo excel con resultados del formulario', {containerId: 'sys_msg'})
            return
        }

        setIsLoading(true)
        setTimeout(async() => {

            try {
                
                const resp = await clienteAxios.post('/api/sugerencia-alternativa-pregunta/enviar-sugerencias', {
                    rut_usuario: usuario.rut, 
                    codigo_materia,
                    nombre_formulario,
                    archivo_base64
                })
                setIsLoading(false)
                toast.success('Sugerencias enviadas correctamente', {containerId: 'sys_msg'})
                reseteaFormulario()

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
                    id="fecha_formulario_desde"
                    name="fecha_formulario_desde"
                    selected={fecha_formulario_desde}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => {
                        setFormulario({
                            ...formulario,
                            fecha_formulario_desde : date,
                            nombre_formulario: '0',
                        })
                    }}
                    customInput={
                        <CustomDateInput 
                            label="Fecha Formulario Desde"
                            ref = {ref_fecha_formulario_desde}
                        />
                    }
                />
            </Col>
            <Col>
                <DatePicker
                    id="fecha_formulario_hasta"
                    name="fecha_formulario_hasta"
                    selected={fecha_formulario_hasta}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => {
                        setFormulario({
                            ...formulario,
                            fecha_formulario_hasta : date,
                            nombre_formulario: '0',
                        })
                    }}
                    customInput={
                        <CustomDateInput 
                            label="Fecha Formulario Hasta"
                            ref = {ref_fecha_formulario_hasta}
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
                        setFormulario({
                            ...formulario,
                            [e.target.name]: e.target.value,
                            nombre_formulario: '0', 
                        })
                    }}
                />
            </Col>
        </Row>
        <Row>
            <Col>
                {usuario &&
                    <InputSelectFormSugerencias
                        id="nombre_formulario"
                        name="nombre_formulario"
                        rut_usuario={usuario.rut}
                        codigo_materia={codigo_materia}
                        fecha_formulario_desde={fecha_formulario_desde}
                        fecha_formulario_hasta={fecha_formulario_hasta}
                        as="select"
                        value={nombre_formulario}
                        onChange={e => setFormulario({
                            ...formulario,
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
                                onClick={() => setFormulario({
                                    ...formulario,
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


const FormSugerencias = () => {

    return ( 
        <Layout>
            <Container className="mt-5">
                <h5 className="text-center my-4">Cuestionarios</h5>
                <Row className="justify-content-sm-center">
                    <Col>
                        <Card>
                            <Card.Body>
                                <Tabs defaultActiveKey="carga-respuestas-sugerencias" id="forms-tab" className="mb-3">
                                <Tab eventKey="carga-respuestas-sugerencias" title="Respuestas correctas y sugerencias">
                                    <CargaRespuestasSugerencias />
                                </Tab>
                                <Tab eventKey="respuesta-alumnos" title="Respuesta alumnos">
                                    <EnviaRespuestas />
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
 
export default FormSugerencias;