import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import ToastMultiline from '../ui/ToastMultiline';
import { Container, Form, Button, Image, Row, Col } from 'react-bootstrap';
import {handleError, getBase64 } from '../../helpers';
import  clienteAxios from '../../config/axios';
import InputSearch from '../ui/InputSearch';
import Uploader from '../ui/Uploader';


const InstitucionForm = () => {

    const router = useRouter(); 
    const [filtro_busqueda, setFiltroBusqueda] = useState('');
    const [result_busqueda, setResultBusqueda] = useState([]);
    const [result_select, setResultSelect]     = useState(null);
    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        logo: '',
        inactivo: false
    });

    const [errores, setErrores] = useState({});
   
    const buscarInstitucion = async () => {
        const resp = await clienteAxios.get(`/api/instituciones/busqueda/${filtro_busqueda}`);
        console.log('estoy aqui', resp)
        setResultBusqueda(resp.data.instituciones);
    }

    useEffect(() => {

        if(filtro_busqueda.trim() !== '' && !result_select){
            buscarInstitucion();
        }else{
            setResultBusqueda([]);
        }

        if(result_select){
            setFormulario({
                codigo: result_select.codigo,
                descripcion: result_select.descripcion,
                logo: result_select.logo,
                inactivo: result_select.inactivo
            });
        }else{
            reseteaFormulario();
        }
        setErrores({});

    }, [filtro_busqueda, result_select])

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
            <InputSearch
                setFilter={setFiltroBusqueda}
                results={result_busqueda}
                setResultSelect={setResultSelect}
                id="codigo"
                label="descripcion"
            />
        <Form>
            <Form.Group as={Row}>
                <Col
                    //style={{marginBottom: 10}}
                >
                    <Image 
                        src={formulario.logo.trim() === '' ? '/static/no-image.png' : formulario.logo.trim()} 
                        thumbnail
                    />
                </Col>
                <Col md={9}>
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
                    readOnly={result_select} 
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
            <Row>
                <Col xs={12} sm={6} >
                    {result_select
                    ?  
                        <Button 
                            variant="outline-info"
                            size="lg"
                            onClick={handleClickActualizar}
                        >Actualizar</Button>
                    :
                        <Button 
                            variant="info"
                            onClick={handleClickCrear}
                            size="lg"
                        >Crear</Button>
                    }
                </Col>
                <Col xs={12} sm={6}>
                    <Button 
                        variant="success"
                        onClick={() => {
                            router.push({
                                pathname: '/administrar/cursos',
                                query: { institucion: formulario.codigo },
                            })
                        }}
                        disabled={!result_select}
                        size="lg"
                    >+ Agregar Cursos</Button>
                </Col>
            </Row>
        </Form>
        </Container> );
}
 
export default InstitucionForm;