import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Form, Button } from 'react-bootstrap';
import AuthContext from '../../../context/auth/AuthContext';
import InputSearch from '../../ui/InputSearch';
import clienteAxios from '../../../config/axios';

const RolForm = () => {

    const { autenticado } = useContext(AuthContext);
    const router = useRouter();

    const [filtro_busqueda, setFiltroBusqueda] = useState('');
    const [result_busqueda, setResultBusqueda] = useState([]);
    const [result_select, setResultSelect]     = useState(null);
    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        inactivo: false
    });


    const busquedaRol = async () => {
        const resp = await clienteAxios.get(`/api/roles/busqueda/${filtro_busqueda}`)
        setResultBusqueda(resp.data.roles);
    }


    useEffect(() => {

        if(filtro_busqueda.trim() !== '' && !result_select){
            busquedaRol();
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
            setFormulario({
                codigo: '',
                descripcion: '',
                inactivo: false
            });
        }

    }, [filtro_busqueda, result_select])

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
                            [e.target.name]: e.target.value
                         })
                     }}
                     readOnly={result_select}
                 />
             </Form.Group>
             <Form.Group>
                 <Form.Label>Descripcion</Form.Label>
                 <Form.Control
                     id="descripcion"
                     name="descripcion"
                     type="text" 
                     placeholder="DESCRIPCIÓN" 
                     value={formulario.descripcion}
                     onChange={e => {
                         setFormulario({
                             ...formulario,
                            [e.target.name]: e.target.value
                         })
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
                onChange={e => {
                    setFormulario({
                        ...formulario,
                        [e.target.name]: e.target.checked
                    });
                }}
             />
             {result_select
             ?
                <Button variant="outline-info">Actualizar</Button>
             :
                <Button variant="info">Crear</Button>
             }
             
             
        </Form>
     </Container> );
}
 
export default RolForm;