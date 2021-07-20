import React, {useState} from 'react'
import { Stepper, Step } from 'react-form-stepper';
import { Card, Col, Container, Form, Button, Row } from 'react-bootstrap'
import { handleError } from '../helpers'
import  clienteAxios from '../config/axios'
import { toast } from 'react-toastify'
import Layout from '../components/layout/Layout';


const IngresaRut = ({rut, onChangeValue}) => {

    return (
        <>
            <Row className="d-flex mb-2">
                <Col>
                <Form.Label>RUT</Form.Label>
                    <Form.Control
                        id="rut"
                        name="rut"
                        type="text" 
                        placeholder="RUT" 
                        //autoComplete="off"
                        value={rut}
                        onChange={onChangeValue}
                    />
                </Col>
            </Row>
        </>
    )
}

const ConfirmaEmail = ({email}) => {
    return(
        <>
        <Container>
            <Row className="d-flex mb-2">
                <Col>
                <Form.Label>{email}</Form.Label>
                </Col>
            </Row>
        </Container>
        </>

    )

}

const ActualizaClave = ({formulario, onChangeValue}) => {


    const { codigoRecuperaClave, clave, confirmaClave } = formulario

    return (
        <>
            <Row className="d-flex mb-2">
                <Col>
                <Form.Label>CÓDIGO</Form.Label>
                    <Form.Control
                        id="codigoRecuperaClave"
                        name="codigoRecuperaClave"
                        type="text" 
                        placeholder="CÓDIGO RECIBIDO" 
                        //autoComplete="off"
                        value={codigoRecuperaClave}
                        onChange={onChangeValue}
                    />
                </Col>
            </Row>
            <Row className="d-flex mb-2">
                <Col>
                <Form.Label>CLAVE NUEVA</Form.Label>
                    <Form.Control
                        id="clave"
                        name="clave"
                        type="password" 
                        placeholder="CLAVE NUEVA" 
                        //autoComplete="off"
                        value={clave}
                        onChange={onChangeValue} 
                    />
                </Col>
            </Row>
            <Row className="d-flex mb-2">
                <Col>
                <Form.Label>CONFIRMAR CLAVE</Form.Label>
                    <Form.Control
                        id="confirmaClave"
                        name="confirmaClave"
                        type="password" 
                        placeholder="CONFIRMA CLAVE" 
                        //autoComplete="off"
                        value={confirmaClave}
                        onChange={onChangeValue}
                    />
                </Col>
            </Row>
        </>
    )
}

const RecuperaClave = () => {
    
    const [formulario, setFormulario] = useState({
        codigoRecuperaClave: '',
        rut: '',
        email: '',
        clave: '',
        confirmaClave: '',
        
    })   
    const [step, setStep] = useState(0) 


    const onChangeValue = e => {
        setFormulario({
        ...formulario,
        [e.target.name]: e.target.value
        })
    }

    //ingresa rut
    const handleClickObtieneEmail = async () => {
        try{

            if(formulario.rut.trim() === ''){
                toast.error('El Rut es obligatorio', {containerId: 'sys_msg'})
                return
            }

            const resp = await clienteAxios.get('/api/recupera-clave/obtieneEmailUsuario',{
                params:{
                    rut:formulario.rut,
                }
            })

            setFormulario({
                ...formulario,
                email:resp.data.email
            })
            setStep(step+1)

        }catch(e){
            handleError(e)
        }
    }

    //ConfirmaEmail
    const handleClickEnviaEmailUsuario = async () => {

        try{
            const resp = await clienteAxios.post('/api/recupera-clave/enviaEmail',{
                rut:formulario.rut
            })
            setStep(step+1)
        }catch(e){
            handleError(e)
        }

    }

    //ActualizaClave
    const handleClickActualizarClave = async () => {
        
        try{

            if(formulario.codigoRecuperaClave.trim() === ''){
                toast.error('El código de recuperación es obligatorio', {containerId: 'sys_msg'})
                return
            }
    
            if(formulario.confirmaClave.trim() !== formulario.clave.trim()){
                toast.error('Las claves no coinciden', {containerId: 'sys_msg'})
                return
            }
            
            const resp = await clienteAxios.put('/api/recupera-clave/actualizaClave',{
                rut:formulario.rut,
                clave:formulario.clave,
                codigoRecuperaClave: formulario.codigoRecuperaClave,
            })
            toast.success('Clave recuperada con exito', {containerId: 'sys_msg'})
            return         
        }catch(e){
            handleError(e)
        }

    }


    
    return ( 
        <Layout>
            <Container>
                <Row>
                    <Col>
                        <Card>
                        <Card.Body>
                        <Stepper activeStep={step}>
                            <Step label="Ingresar RUT" />
                            <Step label="Confirmar Email" />
                            <Step label="Recuperar Clave" />
                        </Stepper>
                        {step === 0 &&
                        <>
                            <Row className="d-flex justify-content-center">
                                <Col sm="auto">
                                    <IngresaRut
                                        rut={formulario.rut}
                                        onChangeValue={onChangeValue}
                                    />
                                </Col>
                            </Row>
                            <Row className="d-flex justify-content-center"> 
                                <Col sm="auto">
                                    <Button 
                                        variant="info"
                                        size="lg"
                                        onClick={handleClickObtieneEmail}
                                    >Verfica Usuario
                                    </Button>
                                </Col>
                            </Row>
                        </>
                        }
                        {step === 1 &&
                        <>
                            <Row className="d-flex justify-content-center">
                                <Col sm="auto">
                                    <ConfirmaEmail
                                        email={formulario.email}
                                    />
                                </Col>
                            </Row>
                            <Row className="d-flex justify-content-center">
                                <Col sm="auto">
                                    <Button 
                                        variant="info"
                                        size="lg"
                                        className="btn-block"
                                        onClick={handleClickEnviaEmailUsuario}
                                    >Enviar Código
                                    </Button>
                                </Col>
                            </Row>
                        </>
                        }
                        {step === 2 &&
                        <>
                            <Row className="d-flex justify-content-center">
                                <Col sm="auto">
                                    <ActualizaClave 
                                    onChangeValue={onChangeValue}
                                    formulario={formulario}
                                    />
                                </Col>
                            </Row>
                            <Row className="d-flex justify-content-center">
                                <Col sm="auto">
                                    <Button 
                                        variant="info"
                                        size="lg"
                                        onClick={handleClickActualizarClave}
                                    >Recuperar Clave
                                    </Button>
                                </Col>
                            </Row>
                        </>
                        }    
                        </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Layout>
     );
}
 
export default RecuperaClave;