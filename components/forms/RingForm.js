import React, { useState, useContext, createRef, useEffect} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import ToastMultiline from '../ui/ToastMultiline';
import { Container, Form, Button, Row, Col, ButtonGroup, ToggleButton } from 'react-bootstrap';
import {handleError } from '../../helpers';
import clienteAxios from '../../config/axios';
import CustomDateInput from '../ui/CustomDateInput';
import DatePicker, {CalendarContainer} from 'react-datepicker';
import AuthContext from '../../context/auth/AuthContext';
 

const RingForm = ({ring_modificar, handleMostrarBusquedaRings}) => {

    const {usuario} = useContext(AuthContext);
    const [formulario, setFormulario] = useState({
        codigo: '',
        nombre: '',
        descripcion: '',
        fecha_hora_inicio: new Date(),
        fecha_hora_fin: new Date(),
        rut_usuario_creador: usuario.rut,
        privado: true,
        inactivo: false,
    });
 
    const radios_estado_ring = [
        { name: 'Privado', value: true },
        { name: 'Público', value: false },
    ];

    const ref_custom_date_desde = createRef();
    const ref_custom_date_hasta = createRef();
    
    const [errores, setErrores] = useState({});

    useEffect(() => {
        if(ring_modificar){
            setFormulario({
                codigo: ring_modificar.codigo,
                nombre: ring_modificar.nombre,
                descripcion: ring_modificar.descripcion,
                fecha_hora_inicio: new Date(ring_modificar.fecha_hora_inicio),
                fecha_hora_fin: new Date(ring_modificar.fecha_hora_fin),
                rut_usuario_creador: ring_modificar.rut_usuario_creador,
                privado: ring_modificar.privado,
                inactivo: ring_modificar.inactivo,
            })
        }
    }, [ring_modificar]);
    
    const validarFormulario = () => {
        
        let errors = {}

        if(formulario.nombre.trim() === ''){
            errors = {
                ...errors,
                nombre: 'Requerido'
            }
        }
        
        if(formulario.descripcion.trim() === ''){
            errors = {
                ...errors,
                descripcion: 'Requerido'
            }
        }

        setErrores(errors);

        return errors;

    }

    const reseteaFormulario = () => {
        setFormulario({
            codigo: '',
            nombre: '',
            descripcion: '',
            fecha_hora_inicio: new Date(),
            fecha_hora_fin: new Date(),
            rut_usuario_creador: usuario.rut,
            privado: true,
            inactivo: false
        });
    }

    const handleCrearRing = async e => {
        
        try{
            //previne el envío
            e.preventDefault();
            //valida el formulario
            const errors = validarFormulario();
            //verifica que no hayan errores
            if(Object.keys(errors).length > 0){
                return;
            }
            //curso a enviar
            let ring = formulario;
            ring.codigo = uuidv4();

            const resp = await clienteAxios.post('/api/rings/crear', ring);
            ring = resp.data;
            reseteaFormulario();
            toast.success('RING CREADO', {containerId: 'sys_msg'});
        
        }catch(e){
            handleError(e);
        }                                                
    }

    const handleActualizarRing = async e => {

        try{
            //previne el envío
            e.preventDefault();
            //valida el formulario
            const errors = validarFormulario();
            //verifica que no hayan errores
            if(Object.keys(errors).length > 0){
                return;
            }

            let ring = formulario;
          
            const resp = await clienteAxios.put('/api/rings/actualizar', ring);
            ring = resp.data;
            toast.success('RING ACTUALIZADO', {containerId: 'sys_msg'});


        }catch(e){
            handleError(e);
        }

    }

    return (
        <Container>
        
        <Form>
             <Form.Group>
                 <Form.Label>Nombre</Form.Label>
                 <Form.Control
                     id="nombre"
                     name="nombre"
                     type="text" 
                     placeholder="NOMBRE" 
                     value={formulario.nombre}
                     onChange={e => {setFormulario({
                             ...formulario,
                            [e.target.name]: e.target.value.toUpperCase()
                         })
                     }}
                     isInvalid={errores.hasOwnProperty('nombre')}
                     onBlur={validarFormulario}
                 />
                 <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('nombre') && errores.nombre}
                 </Form.Control.Feedback>
             </Form.Group>
             <Form.Group>
                 <Form.Label>Instrucciones</Form.Label>
                 <Form.Control
                     id="descripcion"
                     name="descripcion"
                     as = "textarea"
                     rows = "2"
                     placeholder="INSTRUCCIONES" 
                     value={formulario.descripcion}
                     onChange={e => {setFormulario({
                             ...formulario,
                            [e.target.name]: e.target.value.toUpperCase()
                         })
                     }}
                     isInvalid={errores.hasOwnProperty('descripcion')}
                     onBlur={validarFormulario}
                 />
                 <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('descripcion') && errores.descripcion}
                 </Form.Control.Feedback>
             </Form.Group>
            
             <Row className="ml-0">
                 <Col xs="auto">
                     <Row>
                        <Form.Label>Inicio del juego </Form.Label>
                     </Row>
                     <Row>
                        <DatePicker
                            id="fecha_hora_inicio"
                            name="fecha_hora_inicio"
                            selected={formulario.fecha_hora_inicio}
                            showTimeInput
                            timeFormat = 'HH:mm'
                            dateFormat="dd/MM/yyyy HH:mm aa"
                            onChange={date => {
                                setFormulario({
                                    ...formulario,
                                    fecha_hora_inicio : date
                                })
                            }}
                            customInput={
                                <CustomDateInput 
                                    ref = {ref_custom_date_desde}
                                />
                            }
                        />
                     </Row>
                </Col>
                <Col className="ml-3">
                     <Row>
                        <Form.Label>Fin del juego</Form.Label>
                     </Row>
                     <Row>
                        <DatePicker
                            id='fecha_hora_fin'
                            name='fecha_hora_fin'
                            selected={formulario.fecha_hora_fin}
                            showTimeInput
                            timeFormat="HH:mm"
                            dateFormat="dd/MM/yyyy HH:mm aa"
                            onChange={date => {
                                setFormulario({
                                    ...formulario,
                                    fecha_hora_fin : date
                                })
                            }}
                            customInput={
                                <CustomDateInput 
                                    ref = {ref_custom_date_hasta}
                                />
                            }
                        />
                     </Row>
                </Col>
            </Row>
            
            <ButtonGroup toggle style={{zIndex: 0}}>
        
            {radios_estado_ring.map((radio, idx) => (
                <ToggleButton
                    key={idx}
                    type="radio"
                    variant="outline-info"
                    name="privado"
                    value={radio.value}
                    checked={formulario.privado === radio.value}
                    onChange={e => {
                        setFormulario({
                            ...formulario,
                            [e.target.name]: radio.value,
                        });
                    }
                    }
                >
                    {radio.name}
                </ToggleButton>
            ))}
            
            </ButtonGroup>

             <Form.Check 
                id="inactivo"
                name="inactivo"
                type="checkbox"
                label="Inactivo"
                className="my-3"
                checked={formulario.inactivo}
                onChange={e => {
                    setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.checked
                    });
                }}
            />
            <Row className="justify-content-center">
                <Col className="mb-3 mb-sm-0" xs={12} sm={"auto"}>
                    {!ring_modificar
                    ?
                        <Button 
                            variant="info"
                            size="lg"
                            onClick={handleCrearRing}
                        >Crear</Button>
                    :
                        <Button
                            variant="outline-info"
                            size="lg"
                            onClick={handleActualizarRing}
                        >
                           Actualizar 
                        </Button>
                    }
                    
                </Col>
                
                <Col xs={12} sm={"auto"}>
                    <Button 
                        variant="outline-primary"
                        size="lg"
                        className="btn-block"
                        onClick={handleMostrarBusquedaRings}
                    >Ir a buscar</Button>
                </Col>
            </Row>
        </Form>
     </Container> );
}
 
export default RingForm;