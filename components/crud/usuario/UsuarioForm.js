import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Container, Form, Button } from 'react-bootstrap';
import AuthContext from '../../../context/auth/AuthContext';
import  clienteAxios from '../../../config/axios';
import InputSearch from '../../ui/InputSearch';
import InputSelectRol from '../../ui/InputSelectRol';


const UsuarioForm = () => {

    const { autenticado } = useContext(AuthContext);
    const router = useRouter();

    const [filtro_busqueda, setFiltroBusqueda] = useState('');
    const [result_busqueda, setResultBusqueda] = useState([]);
    const [result_select, setResultSelect]     = useState(null);
    const [formulario, setFormulario] = useState({
        rut: '',
        nombre: '',
        email: '',
        telefono: '',
        codigo_rol: '',
        inactivo: false
    });

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
                rut: result_select.rut,
                nombre: result_select.nombre,
                email: result_select.email,
                telefono: result_select.telefono,
                codigo_rol: result_select.codigo_rol,
                inactivo: result_select.inactivo
            });
        }else{
            setFormulario({
                rut: '',
                nombre: '',
                email: '',
                telefono: '',
                codigo_rol: '',
                inactivo: false
            });
        }

    }, [filtro_busqueda, result_select]);

     //verifica si está autenticado o no.
     if(!autenticado){
        router.push('/login');
        return null;
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
                    autoComplete="off"
                    value={formulario.rut}
                    onChange={e => setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.value,
                    })}
                    readOnly={result_select}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                    id="nombre"
                    name="nombre"
                    type="text" 
                    placeholder="NOMBRE COMPLETO" 
                    value={formulario.nombre}
                    onChange={e => setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.value,
                    })}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control 
                    id="email"
                    name="email"
                    type="email" 
                    placeholder="TU.EMAIL@GMAIL.COM"
                    value={formulario.email}
                    onChange={e => setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.value,
                    })}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Teléfono</Form.Label>
                <Form.Control 
                    id="telefono"
                    name="telefono"
                    type="tel" 
                    placeholder="(+56)945678323"
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
            {result_select
            ?
                <Button 
                    variant="outline-info"
                >Actualizar</Button>
            :
                <Button 
                    variant="info"
                >Crear</Button>
            }
       </Form>
    </Container> );
}
 
export default UsuarioForm;