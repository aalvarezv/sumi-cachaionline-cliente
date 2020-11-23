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
import InputSelectTipoJuego from '../ui/InputSelectTipoJuego';
import InputSelectNivelAcademico from '../../components/ui/InputSelectNivelAcademico';
import InputSelectMateria from '../../components/ui/InputSelectMateria';
import InputSelectTipoDuracionPregunta from '../../components/ui/InputSelectTipoDuracionPregunta';
import { date } from 'yup';
 

const RingForm = ({ring_modificar, handleMostrarBusquedaRings}) => {

    const {usuario} = useContext(AuthContext);
    const [formulario, setFormulario] = useState({
        codigo: '',
        nombre: '',
        descripcion: '',
        fecha_hora_inicio: new Date(),
        fecha_hora_fin: new Date(),
        rut_usuario_creador: usuario.rut,
        cantidad_usuarios: '',
        codigo_nivel_academico: '0',
        codigo_materia: '0',
        tipo_duracion_pregunta: '0',
        duracion_pregunta: '',
        codigo_tipo_juego: '0',
        privado: true,
        inactivo: false,
    });
 
    const [showDuracionPregunta, setShowDuracionPregunta] = useState(false)

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
                cantidad_usuarios: ring_modificar.cantidad_usuarios,
                codigo_nivel_academico: ring_modificar.codigo_nivel_academico,
                codigo_materia: ring_modificar.codigo_materia,
                tipo_duracion_pregunta: ring_modificar.tipo_duracion_pregunta,
                duracion_pregunta: ring_modificar.duracion_pregunta,
                codigo_tipo_juego: ring_modificar.codigo_tipo_juego,
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

        if(formulario.codigo_tipo_juego.trim() === '' || formulario.codigo_tipo_juego.trim() === '0'){
            errors = {
                ...errors,
                codigo_tipo_juego: 'Requerido'
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
            cantidad_usuarios: '',
            codigo_nivel_academico: '0',
            codigo_materia: '0',
            tipo_duracion_pregunta: '0',
            duracion_pregunta: '',
            codigo_tipo_juego: '0',
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
            //ring a enviar
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
                <Form.Label>Tipo de Juego</Form.Label>
                <InputSelectTipoJuego
                    id="codigo_tipo_juego"
                    name="codigo_tipo_juego"
                    as="select"
                    value={formulario.codigo_tipo_juego}
                    onChange={e => setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.value
                    })}
                    isInvalid={errores.hasOwnProperty('codigo_tipo_juego')}
                    onBlur={validarFormulario}
                />
                <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('codigo_tipo_juego') && errores.codigo_tipo_juego}
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
             <Form.Group>
                 <Form.Label>Cantidad Usuario</Form.Label>
                 <Form.Control
                     id="cantidad_usuarios"
                     name="cantidad_usuarios"
                     type="text" 
                     placeholder="CANTIDAD DE USUARIOS" 
                     value={formulario.cantidad_usuarios}
                     onChange={e => {setFormulario({
                             ...formulario,
                            [e.target.name]: e.target.value.toUpperCase()
                         })
                     }}
                     isInvalid={errores.hasOwnProperty('cantidad_usuarios')}
                     onBlur={validarFormulario}
                 />
                 <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('cantidad_usuarios') && errores.cantidad_usuarios}
                 </Form.Control.Feedback>
             </Form.Group>
             <Form.Group>
                <Form.Label>Nivel Academico</Form.Label>
                <InputSelectNivelAcademico
                    id="codigo_nivel_academico"
                    name="codigo_nivel_academico"
                    as="select"
                    value={formulario.codigo_nivel_academico}
                    onChange={e => setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.value
                    })}
                    isInvalid={errores.hasOwnProperty('codigo_nivel_academico')}
                    onBlur={validarFormulario}
                />
                <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('codigo_nivel_academico') && errores.codigo_nivel_academico}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>Materia</Form.Label>
                <InputSelectMateria
                    id="codigo_materia"
                    name="codigo_materia"
                    as="select"
                    value={formulario.codigo_materia}
                    onChange={e => setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.value
                    })}
                    isInvalid={errores.hasOwnProperty('codigo_materia')}
                    onBlur={validarFormulario}
                />
                <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('codigo_materia') && errores.codigo_materia}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>Tipo de duración de las preguntas</Form.Label>
                <InputSelectTipoDuracionPregunta
                    id="tipo_duracion_pregunta"
                    name="tipo_duracion_pregunta"
                    as="select"
                    value={formulario.tipo_duracion_pregunta}
                    onChange={e => {
                        setFormulario({
                            ...formulario,
                            [e.target.name]: e.target.value,
                            duracion_pregunta: '0',
                        })
                        if(e.target.value === '2'){
                            setShowDuracionPregunta(true);
                        }else{
                            setShowDuracionPregunta(false);
                        }
                    }}
                    isInvalid={errores.hasOwnProperty('tipo_duracion_pregunta')}
                    onBlur={validarFormulario}
                />
                <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('tipo_duracion_pregunta') && errores.tipo_duracion_pregunta}
                </Form.Control.Feedback>
            </Form.Group>
            {showDuracionPregunta && 
               <Form.Group>
               <Form.Label>Tiempo de duración de las preguntas</Form.Label>
               <Form.Control
                  id="duracion_pregunta"
                  name="duracion_pregunta"
                  type="text" 
                  placeholder="DURACION DE PREGUNTA" 
                  value={formulario.duracion_pregunta}
                  onChange={e => {setFormulario({
                        ...formulario,
                    [e.target.name]: e.target.value.toUpperCase()
                    })
                  }}
                  isInvalid={errores.hasOwnProperty('duracion_pregunta')}
                  onBlur={validarFormulario}
                />
               <Form.Control.Feedback type="invalid">
                {errores.hasOwnProperty('duracion_pregunta') && errores.duracion_pregunta}
               </Form.Control.Feedback>
               </Form.Group>
            }
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