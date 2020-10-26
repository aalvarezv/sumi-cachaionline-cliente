import React, { useState, useContext} from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import ToastMultiline from '../ui/ToastMultiline';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import {handleError } from '../../helpers';
import clienteAxios from '../../config/axios';
import ButtonBack from '../ui/ButtonBack';
import DatePicker from 'react-datepicker';
import AuthContext from '../../context/auth/AuthContext';
 


const RingForm = () => {

    const {usuario} = useContext(AuthContext);
    const router = useRouter();
    const [filtro_busqueda, setFiltroBusqueda] = useState('');
    const [result_busqueda, setResultBusqueda] = useState([]);
    const [result_select, setResultSelect]     = useState(null);
    const [formulario, setFormulario] = useState({
        codigo: '',
        nombre: '',
        descripcion: '',
        fecha_hora_inicio: '',
        fecha_hora_fin: '',
        rut_usuario_creador: usuario.rut,
        inactivo: false
    });

    
    const [fechaInicio, setFechaInicio] = useState(new Date());
    const [fechaFin, setFechaFin] = useState(new Date());
    const [errores, setErrores] = useState({});
    
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



        /* if(formulario.codigo_nivel_academico.trim() === '' || formulario.codigo_nivel_academico.trim() === '0'){
            errors = {
                ...errors,
                codigo_nivel_academico: 'Requerido'
            }
        } */

        setErrores(errors);

        return errors;

    }

    const reseteaFormulario = () => {
        setFormulario({
            codigo: '',
            nombre: '',
            descripcion: '',
            fecha_hora_inicio: '',
            fecha_hora_fin: '',
            rut_usuario_creador: '',
            inactivo: false
        });
    }
    const handleClickCrear = async e => {
        
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
            toast.success(<ToastMultiline mensajes={[{msg: 'RING CREADO'}]}/>, {containerId: 'sys_msg'});
        
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
             <Form.Group>
             <Form.Label>Inicio del juego </Form.Label>
             <br/>
                    <DatePicker
                    id="fecha_hora_inicio"
                    name="fecha_hora_inicio"
                    selected={fechaInicio}
                    onChange={date => {
                        
                        setFormulario({
                            ...formulario,
                            fecha_hora_inicio : date
                        })
                        setFechaInicio(date)
                    }}
                    showTimeSelect
                    timeFormat = 'HH:mm'
                    dateFormat="dd/MM/yyyy HH:mm aa"
                    />
             </Form.Group>
             <Form.Group>
             <Form.Label>Fin del juego</Form.Label>
             <br/>
                <DatePicker
                    id='fecha_hora_fin'
                    name='fecha_hora_fin'
                    selected={fechaFin}
                    onChange={date => {

                        setFormulario({
                            ...formulario,
                            fecha_hora_fin : date
                        })
                        setFechaFin(date)
                    }}
                    showTimeSelect
                    timeFormat="HH:mm"
                    dateFormat="dd/MM/yyyy HH:mm aa"
                />
             </Form.Group>
             <Form.Check 
                id="inactivo"
                name="inactivo"
                type="checkbox"
                label="Inactivo"
                className="mb-3"
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
                    
                        <Button 
                        variant="info"
                        size="lg"
                        className="btn-block"
                        onClick={handleClickCrear}
                        >Crear</Button>
                    
                        
                        
                    
                </Col>
                
                <Col xs={12} sm={"auto"}>
                    <ButtonBack />
                </Col>
            </Row>
        </Form>
     </Container> );
}
 
export default RingForm;