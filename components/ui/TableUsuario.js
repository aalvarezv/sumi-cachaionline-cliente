import React, {useState, useEffect} from 'react'
import {Table, Button} from 'react-bootstrap';
import  clienteAxios from '../../config/axios';
import { handleError } from '../../helpers';

const TableUsuario = ({codigoring}) => {

    const handleCrearRingUsuario = async (rut_usuario) => {

        const resp = await clienteAxios.post('/api/ring-usuarios/crear',{codigoring},{rut_usuario});
        toast.success('RING USUARIO CREADO', {containerId: 'sys_msg'});
    }

    
    const [usuarios, setUsuarios] = useState([])

    useEffect(() => {
        const listarUsuarios = async () => {
            try{
                const resp = await clienteAxios.get('/api/usuarios/listar-por-nivel-academico')
                setUsuarios(resp.data.usuarios)
            }catch(e){
                handleError(e);
            }
            
        }
        listarUsuarios();
    }, [])
    return (
        <Table striped bordered hover variant="light">
            <thead>
                <tr>
                <th>#</th>
                <th>Rut</th>
                <th>Nombre</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
                {usuarios.length > 0 && 
                    usuarios.map((usuario, index) => {
                        const{rut, nombre } = usuario
                        return(
                            <tr key={rut}>
                                <td>{index+1}</td>
                                <td>{rut}</td>
                                <td>{nombre}</td>
                                <td>
                                    <Button 
                                        variant="outline-info"
                                        onClick={e => {
                                            handleCrearRingUsuario(rut)
                                            } 
                                        }
                                    >
                                     Agregar
                                    </Button>
                                </td> 
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>
    )
}

export default TableUsuario