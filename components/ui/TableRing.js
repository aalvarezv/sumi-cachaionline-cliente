import React, {useEffect, useState} from 'react';
import {Table, Container, Button} from 'react-bootstrap';
import clienteAxios from '../../config/axios';




const TableRing = () => {

    const [rings, setRings] = useState([]);


    
    const handleClickContador = () => {
        setContador(contador+1);
    }

    useEffect(() =>{

        const getRings = async () => {
            const resp = await clienteAxios.get('/api/rings/listar');
            setRings(resp.data.ring);
        }
        getRings();
    },
    []);


    return (
            <Table striped bordered hover variant="light"> 
                <thead>
                    <tr>
                    <th></th>
                    <th>Nombre</th>
                    <th>Rut Creador</th>
                    <td></td>
                    <td></td>
                    </tr>
    
                </thead>
                <tbody>
                    {rings.length > 0 && 
                        rings.map((ring, index) =>{
                            const {codigo, nombre, rut_usuario_creador} = ring
                            return(
                                <tr key={codigo}>
                                <td>{index+1}</td>
                                <td>{nombre}</td>
                                <td>{rut_usuario_creador}</td>
                                <td>
                                    <Button variant="outline-info">
                                    Actualizar
                                    </Button>
                                </td>
                                <td>
                                    <Button variant="danger">
                                    Eliminar
                                    </Button>
                                </td>
                                </tr>
                            );
                        }) 
                        
                    }

                    
                </tbody>
            </Table>
    )
}

export default TableRing