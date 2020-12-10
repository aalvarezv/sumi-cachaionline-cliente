import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import ToastMultiline from '../ui/ToastMultiline';
import { handleError } from '../../helpers';
import  clienteAxios from '../../config/axios';
import InputSearch from '../ui/InputSearch';
import InputSelectUnidadesMateria from '../ui/InputSelectUnidadesMateria';
import InputSelectMateria from '../ui/InputSelectMateria';
import ButtonBack from '../ui/ButtonBack';

const ModuloForm = () => {

    const router = useRouter();
    const [filtro_busqueda, setFiltroBusqueda] = useState('');
    const [result_busqueda, setResultBusqueda] = useState([]);
    const [result_select, setResultSelect]     = useState(null);
    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        codigo_unidad: '',
        inactivo: false
    });
    const [codigo_materia, setCodigoMateria] = useState('');
    const [tab_key, setTabKey] = useState("tab_modulo");

    const [errores, setErrores] = useState({});

    const buscarModulo = async () => {
        try{
            const resp = await clienteAxios.get(`/api/modulos/busqueda/${filtro_busqueda}`);
            setResultBusqueda(resp.data.modulos);
        }catch(e){
            handleError(e);
        }
    }

    useEffect(() => {
        
        if(filtro_busqueda.trim() !== '' && !result_select){
            buscarModulo();
        }else{
            setResultBusqueda([]);
        }

        //cuando se selecciona o cambia el result_select
        if(result_select){

            setFormulario({
                codigo: result_select.codigo,
                descripcion: result_select.descripcion,
                codigo_unidad: result_select.codigo_unidad,
                inactivo: result_select.inactivo
            });
            setCodigoMateria(result_select.unidad.codigo_materia);

        }else{
            reseteaFormulario();
        }
        setErrores({});

    }, [filtro_busqueda, result_select]);

    //carga la materia en el formulario si existe en la url.
    useEffect(() => {
        if(router.query.materia){
            setCodigoMateria(router.query.materia);
        }
        if(router.query.unidad){
            setFormulario({
                ...formulario,
                codigo_unidad: router.query.unidad
            })
        }
    }, []);

    const validarFormulario = () => {
        //setea los errores para que no exista ninguno.
        let errors = {}

        //valida la descripcion.
        if(formulario.descripcion.trim() === ''){
            errors = {
                ...errors,
                descripcion: 'Requerido'
            }
        }

        //valida la unidad.
        if(formulario.codigo_unidad.trim() === '' || formulario.codigo_unidad.trim() === '0'){
            errors = {
                ...errors,
                codigo_unidad: 'Requerido'
            }
        }

        setErrores(errors);

        return errors;

    }

    const reseteaFormulario = () => {
        setFormulario({
            codigo: '',
            descripcion: '',
            codigo_unidad: '',
            inactivo: false
        });

        setCodigoMateria('');
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
            //modulo a enviar
            let modulo = {
                ...formulario,
                codigo : uuidv4(),
             }

             const resp = await clienteAxios.post('/api/modulos/crear', modulo);
             //respuesta del modulo recibido.
             modulo = resp.data;
             reseteaFormulario();
             toast.success(<ToastMultiline mensajes={[{msg: 'MODULO CREADO'}]}/>, {containerId: 'sys_msg'});
 
        }catch(e){
             handleError(e);
        }
     
    }

    const handleClickActualizar = async e => {
        
        try{
            e.preventDefault();
            //valida el formulario
            const errors = validarFormulario();
            //verifica que no hayan errores
            if(Object.keys(errors).length > 0){
                return;
            }
            //modulo a enviar
            let modulo = formulario;

            await clienteAxios.put('/api/modulos/actualizar', modulo);
            //respuesta del usuario recibido.
            toast.success(<ToastMultiline mensajes={[{msg: 'MODULO ACTUALIZADO'}]}/>, {containerId: 'sys_msg'});
 
        }catch(e){
             handleError(e);
        }
    }

    return ( 
    <Container>

        <InputSearch
            setFilter={setFiltroBusqueda}
            results={result_busqueda}
            setResultSelect={setResultSelect}
            id="codigo"
            label="descripcion"
        />
        <Form className="p-3">
            <Form.Group>
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                    id="descripcion"
                    name="descripcion"
                    type="text" 
                    placeholder="DESCRIPCIÓN" 
                    value={formulario.descripcion}
                    onChange={e => setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.value.toUpperCase()
                    })}
                    isInvalid={errores.hasOwnProperty('descripcion')}
                    onBlur={validarFormulario}
                />
                <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('descripcion') && errores.descripcion}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group >
                <Row>
                    <Col xs={10}>
                        <Form.Label>Materia</Form.Label>
                    </Col>
                    <Col xs={2}>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InputSelectMateria
                            id="codigo_materia"
                            name="codigo_materia"
                            as="select"
                            value={codigo_materia}
                            onChange={e => setCodigoMateria(e.target.value)}
                            disabled={router.query.materia}
                        />
                    </Col>
                    <Col xs={"auto"}>
                        <Button 
                            variant="success"
                            onClick={()=>{
                                router.push('/administrar/materias')
                            }}
                            size="md"
                        >+</Button>
                    </Col>
                </Row>        
            </Form.Group>
            <Form.Group>
                <Row>
                    <Col xs={10}>
                        <Form.Label>Unidad</Form.Label>
                    </Col>
                    <Col xs={2}>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InputSelectUnidadesMateria
                            id="codigo_unidad"
                            name="codigo_unidad"
                            /*codigo materia se le pasa a las props del componente
                            para filtrar las unidades de la materia seleccionada.*/
                            codigo_materia={codigo_materia}
                            as="select"
                            value={formulario.codigo_unidad}
                            onChange={e => setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value
                            })}
                            isInvalid={errores.hasOwnProperty('codigo_unidad')}
                            onBlur={validarFormulario}
                            disabled={router.query.unidad}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.hasOwnProperty('codigo_unidad') && errores.codigo_unidad}
                        </Form.Control.Feedback>
                    </Col>
                    <Col xs={"auto"}>
                        <Button 
                            variant="success"
                            onClick={()=>{
                                router.push('/administrar/unidades')
                            }}
                            size="md"
                        >+</Button>
                    </Col>
                </Row>
            </Form.Group>  
            <Form.Check 
                id="inactivo"
                name="inactivo"
                type="checkbox"
                label="Inactivo"
                className="mb-3"
                checked={formulario.inactivo}
                onChange={e => setFormulario({
                    ...formulario,
                    [e.target.name]: e.target.checked,
                })}
            />
            <Row className="justify-content-center">
                <Col className="mb-3 mb-sm-0" xs={12} sm={"auto"}>
                    {result_select
                    ?
                        <Button 
                            variant="outline-info"
                            size="lg"
                            className="btn-block"
                            onClick={handleClickActualizar}
                            
                        >Actualizar</Button>
                    :
                        <Button 
                            variant="info"
                            size="lg"
                            className="btn-block"
                            onClick={handleClickCrear}
                        >Crear</Button>
                    }
                </Col>
                <Col xs={12} sm={"auto"}>
                    <ButtonBack />
                </Col>
            </Row>
        </Form>
    </Container> );
}
 
export default ModuloForm;