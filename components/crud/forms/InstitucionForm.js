import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ToastMultiline from '../../../components/ui/ToastMultiline';
import { Container, Form, Button } from 'react-bootstrap';
import {handleError } from '../../../helpers';
import  clienteAxios from '../../../config/axios';
import InputSearch from '../../ui/InputSearch';

const InstitucionForm = () => {

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
            reseteaFormulario();
            toast.success(<ToastMultiline mensajes={[{msg: 'NIVEL ACADEMICO'},
                                                     {msg: `CODIGO: ${institucion.codigo}`},
                                                     {msg: `DESCRIPCION: ${institucion.descripcion}`},
                                                     {msg: 'CREADA CORRECTAMENTE'}
                                                    ]}/>, {containerId: 'sys_msg'});
        
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
            toast.success(<ToastMultiline mensajes={[{msg: 'NIVEL ACADEMICO'},
                                                     {msg: `CODIGO: ${(institucion.codigo)}`},
                                                     {msg: `NOMBRE: ${institucion.descripcion}`},
                                                     {msg: 'ACTUALIZADA CORRECTAMENTE'}
                                                    ]}/>, {containerId: 'sys_msg'});
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
        <Form>
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
             <Form.Group>
                 <Form.Label>Logo</Form.Label>
                 <Form.Control
                     id="logo"
                     name="logo"
                     type="text" 
                     placeholder="LOGO" 
                     value={formulario.logo}
                     onChange={e => {setFormulario({
                            ...formulario,
                            [e.target.name]: e.target.value.toUpperCase()
                        })
                    }}
                     isInvalid={errores.hasOwnProperty('logo')}
                     onBlur={validarFormulario}
                 />
                 <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('logo') && errores.logo}
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
            {result_select
             ?
                <Button 
                    variant="outline-info"
                    onClick={handleClickActualizar}
            >   Actualizar</Button>
             :
                <Button 
                    variant="info"
                    onClick={handleClickCrear}
                >Crear</Button>
             }
        </Form>
        </Container> );
}
 
export default InstitucionForm;