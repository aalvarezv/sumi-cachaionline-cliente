import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ToastMultiline from '../../../components/ui/ToastMultiline';
import { Container, Form, Button } from 'react-bootstrap';
import { rutEsValido, rutFormat, handleError } from '../../../helpers';
import  clienteAxios from '../../../config/axios';
import InputSearch from '../../ui/InputSearch';
import InputSelectRol from '../../ui/InputSelectRol';


const UsuarioForm = () => {

    const [filtro_busqueda, setFiltroBusqueda] = useState('');
    const [result_busqueda, setResultBusqueda] = useState([]);
    const [result_select, setResultSelect]     = useState(null);
    const [formulario, setFormulario] = useState({
        rut: '',
        nombre: '',
        clave: '',
        clave_confirm: '',
        email: '',
        telefono: '',
        codigo_rol: '',
        inactivo: false
    });
    //1.- definir la variable que almacena los errores.
    const [errores, setErrores] = useState({});

    const buscarUsuario = async () => {
        const resp = await clienteAxios.get(`/api/usuarios/busqueda/${filtro_busqueda}`);
        setResultBusqueda(resp.data.usuarios);
    }

    //cuando cambia el filtro de búsqueda.
    useEffect(() => {

        //si tengo un filtro de búsqueda y no hay un usuario seleccionado, entonces busca.
        if(filtro_busqueda.trim() !== '' && !result_select){
            buscarUsuario();
        }else{
            setResultBusqueda([]);
        }

        //cuando se selecciona o cambia el result_select
        if(result_select){
            setFormulario({
                rut: rutFormat(result_select.rut),
                nombre: result_select.nombre,
                clave: result_select.clave,
                clave_confirm: result_select.clave,
                email: result_select.email,
                telefono: result_select.telefono,
                codigo_rol: result_select.codigo_rol,
                inactivo: result_select.inactivo
            });
            
        }else{
            reseteaFormulario();
        }
        setErrores({});

    }, [filtro_busqueda, result_select]);

    //2.- Valida los campos del formulario.
    const validarFormulario = () => {
        //setea los errores para que no exista ninguno.
        let errors = {}
        //valida el rut.
        if(formulario.rut.trim() === ''){
            errors = {
                ...errors,
                rut: 'Requerido'
            }
        }else if(!rutEsValido(formulario.rut)){
            errors = {
                ...errors,
                rut: 'No es un RUT válido'
            }
        }
        //valida el nombre.
        if(formulario.nombre.trim() === ''){
            errors = {
                ...errors,
                nombre: 'Requerido'
            }
        }

        //valida la clave
        if(formulario.clave.trim() === ''){
            errors = {
                ...errors,
                clave: 'Requerido'
            }
        }else if (formulario.clave.length < 8){
            errors = {
                ...errors,
                clave: 'Debe contener al menos 8 caracteres'
            }
        }

        //valida la confirmación de clave
        if(formulario.clave_confirm.trim() === ''){
            errors = {
                ...errors,
                clave_confirm: 'Requerido'
            }
        }
        //valida que la clave y su confirmación sea válida.
        if(formulario.clave_confirm.trim() !== formulario.clave.trim()){
            errors = {
                ...errors,
                clave_confirm: 'No es igual a la clave'
            }
        }

        //valida el email
        if(formulario.email.trim() === ''){
            errors = {
                ...errors,
                email: 'Requerido'
            }
        }else if( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formulario.email) ) {
            errors = {
                ...errors,
                email: 'No es un email válido'
            }
        }

        //valida el rol
        if(formulario.codigo_rol.trim() === '' || formulario.codigo_rol.trim() === '0'){
            errors = {
                ...errors,
                codigo_rol: 'Requerido'
            }
        }

        setErrores(errors);
    }

    const reseteaFormulario = () => {
        setFormulario({
            rut: '',
            nombre: '',
            clave: '',
            clave_confirm: '',
            email: '',
            telefono: '',
            codigo_rol: '',
            inactivo: false
        });
    }

    const handleClickCrear = async e => {
        
       try{
            //previne el envío
            e.preventDefault();
            //verifica que no hayan errores
            if(Object.keys(errores).length > 0){
                return;
            }
            //usuario a enviar
            let usuario = {
                ...formulario,
                rut: formulario.rut.replace('-','')
            }
            const resp = await clienteAxios.post('/api/usuarios/crear', usuario);
            //respuesta del usuario recibido.
            usuario = resp.data;
            reseteaFormulario();
            toast.success(<ToastMultiline mensajes={[{msg: 'USUARIO'},
                                                     {msg: `RUT: ${rutFormat(usuario.rut)}`},
                                                     {msg: `NOMBRE: ${usuario.nombre}`},
                                                     {msg: 'CREADO CORRECTAMENTE'}  
                                                    ]}/>, {containerId: 'sys_msg'});

       }catch(e){
            handleError(e);
       }
    }

    const handleClickActualizar = async e => {
        
        try{
            e.preventDefault();
            //verifica que no hayan errores
            if(Object.keys(errores).length > 0){
                return;
            }
            //usuario a enviar

            let usuario = {
                ...formulario,
                rut: formulario.rut.replace('-','')
            }

            await clienteAxios.put('/api/usuarios/actualizar', usuario);
            //respuesta del usuario recibido.
            toast.success(<ToastMultiline mensajes={[{msg: 'USUARIO'},
                                                     {msg: `RUT: ${rutFormat(usuario.rut)}`},
                                                     {msg: `NOMBRE: ${usuario.nombre}`},
                                                     {msg: 'ACTUALIZADO CORRECTAMENTE'}  
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
            id="rut"
            label="nombre"
        />
        <Form>
            <Form.Group>
                <Form.Label>Rut</Form.Label>
                <Form.Control 
                    id="rut"
                    name="rut"
                    type="text" 
                    placeholder="RUT" 
                    //autoComplete="off"
                    value={formulario.rut}
                    onChange={e => {
                        setFormulario({
                        ...formulario,
                        [e.target.name]: rutFormat(e.target.value.toUpperCase()),
                    })}}
                    readOnly={result_select}
                    isInvalid={errores.hasOwnProperty('rut')}
                    onBlur={validarFormulario}
                />
                <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('rut') && errores.rut}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                    id="nombre"
                    name="nombre"
                    type="text" 
                    placeholder="NOMBRE COMPLETO" 
                    //autoComplete="off"
                    value={formulario.nombre}
                    onChange={e => setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.value.toUpperCase()
                    })}
                    isInvalid={errores.hasOwnProperty('nombre')}
                    onBlur={validarFormulario}
                />
                <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('nombre') && errores.nombre}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>Clave</Form.Label>
                <Form.Control
                    id="clave"
                    name="clave"
                    type="password" 
                    placeholder="CLAVE" 
                    value={formulario.clave}
                    onChange={e => setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.value,
                    })}
                    isInvalid={errores.hasOwnProperty('clave')}
                    onBlur={validarFormulario}
                />
                <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('clave') && errores.clave}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>Confirmar Clave</Form.Label>
                <Form.Control
                    id="clave_confirm"
                    name="clave_confirm"
                    type="password" 
                    placeholder="CONFIRMAR CLAVE" 
                    value={formulario.clave_confirm}
                    onChange={e => setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.value,
                    })}
                    isInvalid={errores.hasOwnProperty('clave_confirm')}
                    onBlur={validarFormulario}
                />
                <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('clave_confirm') && errores.clave_confirm}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control 
                    id="email"
                    name="email"
                    type="email" 
                    placeholder="TU.EMAIL@EJEMPLO.COM"
                    //autoComplete="off"
                    value={formulario.email}
                    onChange={e => setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.value.toUpperCase()
                    })}
                    isInvalid={errores.hasOwnProperty('email')}
                    onBlur={validarFormulario}
                />
                <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('email') && errores.email}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>Teléfono</Form.Label>
                <Form.Control 
                    id="telefono"
                    name="telefono"
                    type="tel" 
                    placeholder="(+56) 9 4567 8323"
                    //autoComplete="off"
                    value={formulario.telefono}
                    onChange={e => setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.value,
                    })}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Rol</Form.Label>
                <InputSelectRol
                    id="codigo_rol"
                    name="codigo_rol"
                    as="select"
                    value={formulario.codigo_rol}
                    onChange={e => setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.value
                    })}
                    isInvalid={errores.hasOwnProperty('codigo_rol')}
                    onBlur={validarFormulario}
                />
                <Form.Control.Feedback type="invalid">
                    {errores.hasOwnProperty('codigo_rol') && errores.codigo_rol}
                </Form.Control.Feedback>
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
            {result_select
            ?
                <Button 
                    variant="outline-info"
                    onClick={handleClickActualizar}
                >Actualizar</Button>
            :
                <Button 
                    variant="info"
                    onClick={handleClickCrear}
                >Crear</Button>
            }
       </Form>
    </Container> );
}
 
export default UsuarioForm;