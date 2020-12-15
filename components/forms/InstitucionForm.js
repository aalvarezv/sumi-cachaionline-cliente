import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import ToastMultiline from '../ui/ToastMultiline';
import { Container, Form, Button, Image, Row, Col } from 'react-bootstrap';
import {handleError, getBase64 } from '../../helpers';
import  clienteAxios from '../../config/axios';
import Uploader from '../ui/Uploader';


const InstitucionForm = ({institucion_modificar, handleClickVolver}) => {

    const router = useRouter(); 
    const [filtro_busqueda, setFiltroBusqueda] = useState('');
    //const [result_busqueda, setResultBusqueda] = useState([]);
    //const [result_select, setResultSelect]     = useState(null);
    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        logo: '',
        inactivo: false
    });

    const [errores, setErrores] = useState({});
   
    /*
    const buscarInstitucion = async () => {
        try{
            const resp = await clienteAxios.get(`/api/instituciones/busqueda/${filtro_busqueda}`);
            setResultBusqueda(resp.data.instituciones);
        }catch(e){
            handleError(e);
        }
    }*/

    useEffect(() => {

        /*
        if(filtro_busqueda.trim() !== '' && !result_select){
            buscarInstitucion();
        }else{
            setResultBusqueda([]);
        }*/

        if(institucion_modificar){
            setFormulario({
                codigo: institucion_modificar.codigo,
                descripcion: institucion_modificar.descripcion,
                logo: institucion_modificar.logo,
                inactivo: institucion_modificar.inactivo
            });
        }else{
            reseteaFormulario();
        }
        setErrores({});

    }, [institucion_modificar])

    const validarFormulario = () => {
        
        let errors = {}

        if(formulario.codigo.trim() === ''){
            errors = {
                ...errors,
                codigo: 'Requerido'
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
            descripcion: '',
            logo: '',
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
            //Institucion a enviar
            let institucion = formulario;

            const resp = await clienteAxios.post('/api/instituciones/crear', institucion);
            
            institucion = resp.data;
            //reseteaFormulario();
            setFormulario(institucion);
            setResultSelect(institucion);
            toast.success(<ToastMultiline mensajes={[{msg: 'INSTITUCIÓN CREADA'}]}/>, {containerId: 'sys_msg'});
        
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
            let institucion = formulario;
            await clienteAxios.put('/api/instituciones/actualizar', institucion);
            toast.success(<ToastMultiline mensajes={[{msg: 'INSTITUCIÓN ACTUALIZADA'}]}/>, {containerId: 'sys_msg'});
        }catch(e){
            handleError(e);
        }
    }

    //funcion que recibe el componente Uploader donde retorna los archivos a subir.
    const getArchivos = async archivos => {
    
        const base64 = await getBase64(archivos[0]);
        setFormulario({
            ...formulario,
            logo: base64
        })

    }

    return ( 
        <Container>
            {/* <InputSearch
                setFilter={setFiltroBusqueda}
                results={result_busqueda}
                setResultSelect={setResultSelect}
                id="codigo"
                label="descripcion"
            /> */}
        <Form>
            <Form.Group as={Row}>
                <Col xs="auto">
                    <Image 
                        src={formulario.logo.trim() === '' ? '/static/no-image.png' : formulario.logo.trim()} 
                        style={{width: 150}}
                        thumbnail
                    />
                </Col>
                <Col>
                    <Uploader 
                        titulo={"HAZ CLICK O ARRASTRA Y SUELTA UNA IMAGEN"}
                        getArchivos={getArchivos}
                    />
                </Col>
                    
            </Form.Group>
            <Form.Group>
                <Form.Label>Codigo</Form.Label>
                <Form.Control 
                    id="codigo"
                    name="codigo"
                    type="text" 
                    placeholder="CODIGO"
                    value={formulario.codigo}
                    onChange={e => {
                        setFormulario({
                            ...formulario,
                        [e.target.name]: e.target.value.toUpperCase()
                        })
                    }} 
                    isInvalid={errores.hasOwnProperty('codigo')}
                    onBlur={validarFormulario}
                />
                <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('codigo') && errores.codigo}
                 </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                 <Form.Label>Descripcion</Form.Label>
                 <Form.Control
                     id="descripcion"
                     name="descripcion"
                     type="text" 
                     placeholder="DESCRIPCIÓN" 
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
                <Col className="mb-2 mb-sm-0" xs={12} sm={"auto"}>
                    {institucion_modificar
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
                    <Button 
                        variant="success"
                        size="lg"
                        className="btn-block"
                        disabled={!institucion_modificar}
                        onClick={() => {
                            router.push({
                                pathname: '/administrar/cursos',
                                query: { institucion: formulario.codigo },
                            })
                        }}
                    >+Administrar Cursos</Button>
                </Col>
                <Col>
                    <Button 
                        variant="info"
                        size="lg"
                        onClick={handleClickVolver}
                    >Volver</Button>
                </Col>
            </Row>
        </Form>
        </Container> 
    );
}
 
export default InstitucionForm;