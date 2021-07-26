import React, {useState} from 'react'
import { Stepper, Step } from 'react-form-stepper';
import { Card, Col, Container, Form, Button, Row } from 'react-bootstrap'
import { handleError } from '../helpers'
import  clienteAxios from '../config/axios'
import { toast } from 'react-toastify'
import Layout from '../components/layout/Layout';
import Spinner from '../components/ui/Spinner';
import { useRouter } from 'next/router';


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
            <Row className="mb-2">
                <Col>
                <Form.Label className="text-center">Se enviará un código de verificación a su correo electrónico <h6>{email}</h6></Form.Label>
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
                <Form.Label>Código confirmación</Form.Label>
                    <Form.Control
                        id="codigoRecuperaClave"
                        name="codigoRecuperaClave"
                        type="text" 
                        placeholder="Código" 
                        //autoComplete="off"
                        value={codigoRecuperaClave}
                        onChange={onChangeValue}
                    />
                </Col>
            </Row>
            <Row className="d-flex mb-2">
                <Col>
                <Form.Label>Clave nueva</Form.Label>
                    <Form.Control
                        id="clave"
                        name="clave"
                        type="password" 
                        placeholder="Clave nueva" 
                        //autoComplete="off"
                        value={clave}
                        onChange={onChangeValue} 
                    />
                </Col>
            </Row>
            <Row className="d-flex mb-2">
                <Col>
                <Form.Label>Confirmar clave</Form.Label>
                    <Form.Control
                        id="confirmaClave"
                        name="confirmaClave"
                        type="password" 
                        placeholder="Confirma clave" 
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
    
    const router = useRouter()
    const [formulario, setFormulario] = useState({
        codigoRecuperaClave: '',
        rut: '',
        email: '',
        clave: '',
        confirmaClave: '',
    })   
    const [step, setStep] = useState(0) 
    const [isLoading, setIsLoading] = useState(false)

    
    const resetForm = () => {
        setFormulario({
            codigoRecuperaClave: '',
            rut: '',
            email: '',
            clave: '',
            confirmaClave: '',
        })
    }

    const onChangeValue = e => {
        setFormulario({
        ...formulario,
        [e.target.name]: e.target.value
        })
    }

    const handleClickObtieneEmail = async () => {
        

        if(formulario.rut.trim() === ''){
            toast.error('El RUT es obligatorio', {containerId: 'sys_msg'})
            return
        }

        setIsLoading(true)
        setTimeout(async () => {
            try{
                
                const resp = await clienteAxios.get('/api/recupera-clave/obtieneEmailUsuario',{
                    params:{
                        rut:formulario.rut,
                    }
                })
    
                setFormulario({
                    ...formulario,
                    email:resp.data.email
                })
                toast.success('Usuario válido', {containerId: 'sys_msg'})
                setStep(step+1)
                setIsLoading(false)

            }catch(e){
                setIsLoading(false)
                handleError(e)
            }

        }, 1000);
        
    }

    const handleClickEnviaEmailUsuario = async () => {
        
        setIsLoading(true)
        setTimeout(async () => {
            
            try{

                const resp = await clienteAxios.post('/api/recupera-clave/enviaEmail',{
                    rut:formulario.rut
                })
                toast.success('Código de confirmación enviado', {containerId: 'sys_msg'})
                setStep(step+1)
                setIsLoading(false)

            }catch(e){
                setIsLoading(false)
                handleError(e)
            }
        }, 1000);

    }

    const handleClickActualizarClave = async () => {
        
        if(formulario.codigoRecuperaClave.trim() === ''){
            toast.error('El código de recuperación es obligatorio', {containerId: 'sys_msg'})
            return
        }

        if(formulario.confirmaClave.trim() !== formulario.clave.trim()){
            toast.error('Las claves no coinciden', {containerId: 'sys_msg'})
            return
        }

        setIsLoading(true)
        setTimeout(async () => {
            try{

                const resp = await clienteAxios.put('/api/recupera-clave/actualizaClave',{
                    rut:formulario.rut,
                    clave:formulario.clave,
                    codigoRecuperaClave: formulario.codigoRecuperaClave,
                })
                resetForm()
                toast.success('Clave actualizada', {containerId: 'sys_msg'})
                setIsLoading(false)
                setTimeout(() => {
                    setStep(step + 1) 
                }, 1500);
                
            }catch(e){
                setIsLoading(false)
                handleError(e)
            }

        }, 1000);
        
    }

    if(step > 2){
        router.push('/login')
    }


    return ( 
        <Layout>
            <Container className="mt-5">
                <h5 className="text-center my-4">Recuperar Clave</h5>
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
                                    {isLoading 
                                    ?
                                        <Spinner />
                                    :
                                        <Button 
                                            variant="info"
                                            size="md"
                                            onClick={handleClickObtieneEmail}
                                        >Verfica Usuario
                                        </Button>
                                    }
                                    
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
                                    {isLoading 
                                    ?
                                        <Spinner />
                                    :
                                        <Button 
                                            variant="info"
                                            size="md"
                                            className="btn-block"
                                            onClick={handleClickEnviaEmailUsuario}
                                        >Enviar Código
                                        </Button>
                                    }
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
                                    {isLoading
                                    ?
                                        <Spinner />
                                    :
                                        <Button 
                                            variant="info"
                                            size="md"
                                            onClick={handleClickActualizarClave}
                                        >Actualizar Clave
                                        </Button>
                                    }
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