import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Container, Form, Tabs, Tab, Button, Row, Col } from 'react-bootstrap';
import ToastMultiline from '../ui/ToastMultiline';
import { handleError } from '../../helpers';
import  clienteAxios from '../../config/axios';
import InputSelectMateria from '../ui/InputSelectMateria';
import InputSelectUnidadesMateria from '../ui/InputSelectUnidadesMateria';
import ButtonBack from '../ui/ButtonBack';
import InputSelectModulosUnidad from '../ui/InputSelectModulosUnidad';
import InputSelectModulosContenido from '../../components/ui/InputSelectModulosContenido';
import InputSelectModulosContenidoTema from '../../components/ui/InputSelectModulosContenidoTema';


const ConceptoForm = ({concepto_modificar, handleClickVolver}) => {
    
    const [codigo_materia, setCodigoMateria] = useState('0');
    const [codigo_unidad, setCodigoUnidad] = useState('0');
    const [codigo_modulo, setCodigoModulo] = useState('0');
    const [codigo_modulo_contenido, setCodigoModuloContenido] = useState('0');
    const [codigo_modulo_contenido_tema, setCodigoModuloContenidoTema] = useState('0');

    const router = useRouter();
    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        codigo_modulo_contenido_tema: '',
        codigo_modulo_contenido: '',
        codigo_modulo: '',
        codigo_unidad: '',
        codigo_materia: '',
        inactivo: false,
    });

    const [errores, setErrores] = useState({});

    useEffect(() => {
        

        //cuando se selecciona o cambia el result_select
        if(concepto_modificar){

            setCodigoModuloContenido(concepto_modificar.modulo_contenido_tema.codigo_modulo_contenido);
            setCodigoModulo(concepto_modificar.modulo_contenido_tema.modulo_contenido.codigo_modulo);
            setCodigoUnidad(concepto_modificar.modulo_contenido_tema.modulo_contenido.modulo.codigo_unidad);
            setCodigoMateria(concepto_modificar.modulo_contenido_tema.modulo_contenido.modulo.unidad.codigo_materia);

            setFormulario({
                codigo: concepto_modificar.codigo,
                descripcion: concepto_modificar.descripcion,
                codigo_modulo_contenido_tema: concepto_modificar.codigo_modulo_contenido_tema,
                inactivo: concepto_modificar.inactivo
            });


        }else{
            reseteaFormulario();
        }
        setErrores({});

    }, [concepto_modificar]);

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
        if(formulario.codigo_modulo_contenido_tema.trim() === '' || formulario.codigo_modulo_contenido_tema.trim() === '0'){
            errors = {
                ...errors,
                codigo_modulo_contenido_tema: 'Requerido'
            }
        }

        setErrores(errors);

        return errors;

    }

    const reseteaFormulario = () => {
        setFormulario({
            codigo: '',
            descripcion: '',
            codigo_modulo_contenido_tema: '',
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
            //concepto a enviar
            let concepto = {
                ...formulario,
             }

             const resp = await clienteAxios.post('/api/modulo-contenidos/crear', concepto);
             //respuesta del concepto recibido.
             concepto = resp.data;
             reseteaFormulario();
             toast.success(<ToastMultiline mensajes={[{msg: 'CONCEPTO CREADO'}]}/>, {containerId: 'sys_msg'});
 
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
            //concepto a enviar
            let concepto = formulario;

            await clienteAxios.put('/api/modulo-contenido-tema-conceptos/actualizar', concepto);
            //respuesta del usuario recibido.
            toast.success(<ToastMultiline mensajes={[{msg: 'CONCEPTO ACTUALIZADO'}]}/>, {containerId: 'sys_msg'});
 
        }catch(e){
             handleError(e);
        }
    }


    return ( 
        <Container>
            <Form className="p-3">
                <Form.Group>
                    <Form.Label>Codigo</Form.Label>
                        <Form.Control
                            id="codigo"
                            name="codigo"
                            type="text" 
                            placeholder="CODIGO" 
                            value={formulario.codigo}
                            onChange={e => setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value.toUpperCase()
                            })}
                            isInvalid={errores.hasOwnProperty('codigo')}
                            onBlur={validarFormulario}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.hasOwnProperty('codigo') && errores.codigo}
                        </Form.Control.Feedback>
                </Form.Group> 
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
                <Form.Group>
                    <Form.Label>Matateria</Form.Label>
                        <InputSelectMateria
                            id="codigo_materia"
                            name="codigo_materia"
                            as="select"
                            size="sm"
                            value={codigo_materia}
                            onChange={e => {
                                setCodigoMateria(e.target.value)
                                setCodigoUnidad('0')
                                setCodigoModulo('0')
                                setCodigoModuloContenido('0')
                                setCodigoModuloContenidoTema('0')  
                            }}
                        />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Unidad</Form.Label>
                        <InputSelectUnidadesMateria
                            id="codigo_unidad"
                            name="codigo_unidad"
                            /*codigo materia se le pasa a las props del componente
                            para filtrar las unidades de la materia seleccionada.*/
                            codigo_materia={codigo_materia}
                            as="select"
                            size="sm"
                            value={codigo_unidad}
                            onChange={e => {
                                setCodigoUnidad(e.target.value)
                                setCodigoModulo('0')
                                setCodigoModuloContenido('0')
                                setCodigoModuloContenidoTema('0')  
                            }}
                        />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Modulos</Form.Label>
                        <InputSelectModulosUnidad
                            id="codigo_modulo"
                            name="codigo_modulo"
                            /*codigo unidad se le pasa a las props del componente
                            para filtrar los modulos de la unidad seleccionada.*/
                            codigo_unidad={codigo_unidad}
                            as="select"
                            size="sm"
                            value={codigo_modulo}
                            onChange={e => {
                                setCodigoModulo(e.target.value)
                                setCodigoModuloContenido('0')
                                setCodigoModuloContenidoTema('0')  
                            }}
                        />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Contenido</Form.Label>
                        <InputSelectModulosContenido
                            id="codigo_modulo_contenido"
                            name="codigo_modulo_contenido"
                            /*codigo modulo se le pasa a las props del componente
                            para filtrar las propiedades del modulo seleccionado.*/
                            codigo_modulo={codigo_modulo}
                            as="select"
                            size="sm"
                            label="TODOS LOS CONTENIDOS"
                            value={codigo_modulo_contenido}
                            onChange={e => {
                                setCodigoModuloContenido(e.target.value)
                                setCodigoModuloContenidoTema('0') 
                            }}
                        />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Tema</Form.Label>
                    <InputSelectModulosContenidoTema
                            id="codigo_modulo_contenido_tema"
                            name="codigo_modulo_contenido_tema"
                                
                            /*codigo contenido se le pasa a las props del componente
                            para filtrar las propiedades del modulo seleccionado.*/
                            codigo_modulo_contenido={codigo_modulo_contenido}
                            as="select"
                            size="sm"
                            label="TODOS LOS TEMAS"
                            value={formulario.codigo_modulo_contenido_tema}
                            onChange={e => {
                                setFormulario({
                                    ...formulario,
                                    [e.target.name]: e.target.value
                                });
                            }}
                    />
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
                {concepto_modificar
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
                <Button 
                        variant="info"
                        size="lg"
                        onClick={handleClickVolver}
                    >Volver</Button>
            </Row>
            </Form>
        </Container> 
     );
}
 
export default ConceptoForm;
