import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import ToastMultiline from '../ui/ToastMultiline';
import { Container, Form, Button } from 'react-bootstrap';
import {handleError } from '../../helpers';
import clienteAxios from '../../config/axios';
import InputSearch from '../ui/InputSearch';
import ButtonBack from '../ui/ButtonBack';

const RolForm = () => {

    const router = useRouter();
    const [filtro_busqueda, setFiltroBusqueda] = useState('');
    const [result_busqueda, setResultBusqueda] = useState([]);
    const [result_select, setResultSelect]     = useState(null);
    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        inactivo: false
    });

    const [errores, setErrores] = useState({});

    const buscarRol = async () => {
        const resp = await clienteAxios.get(`/api/roles/busqueda/${filtro_busqueda}`)
        setResultBusqueda(resp.data.roles);
    }

    useEffect(() => {

        if(filtro_busqueda.trim() !== '' && !result_select){
            buscarRol();
        }else{
            setResultBusqueda([]);
        }

        if(result_select){
            setFormulario({
                codigo: result_select.codigo,
                descripcion: result_select.descripcion,
                inactivo: result_select.inactivo
            });
        }else{
            reseteaFormulario();
        }
        setErrores({});

    }, [filtro_busqueda, result_select])

    const validarFormulario = () => {
        
        let errors = {}

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
            //Unidad a enviar
            let rol = formulario;
            rol.codigo = uuidv4();

            const resp = await clienteAxios.post('/api/roles/crear', rol);
            
            rol = resp.data;
            reseteaFormulario();
            toast.success(<ToastMultiline mensajes={[{msg: 'ROL CREADO'}]}/>, {containerId: 'sys_msg'});
        
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
            let rol = formulario;
            await clienteAxios.put('/api/roles/actualizar', rol);
            toast.success(<ToastMultiline mensajes={[{msg: 'ROL ACTUALIZADO'}]}/>, {containerId: 'sys_msg'});
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
                    size="lg"
                    onClick={handleClickCrear}
                >Crear</Button>
            }

            <Button 
                variant="success"
                onClick={() => {
                    router.push({
                        pathname: '/administrar/usuarios',
                        query: { 
                            rol: formulario.codigo
                        },
                    })
                }}
                className="ml-3"
                disabled={!result_select}
                size="lg"
            >+ Agregar Usuarios</Button>

            <ButtonBack />
             
        </Form>
     </Container> );
}
 
export default RolForm;