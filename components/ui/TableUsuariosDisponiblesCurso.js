import React from 'react'
import  clienteAxios from '../../config/axios'
import {getNumeroFilaTabla, handleError} from '../../helpers'
import {Table, Button} from 'react-bootstrap'


const TableUsuariosDisponiblesCurso = ({usuarios, pagina_actual, resultados_por_pagina
                                ,codigoCurso, setUsuarios}) => { 


    const handleClickAgregarUsuario = async (rut,  codigoRol) => {
        try {
            await clienteAxios.post('/api/cursos-usuarios-roles/crear',{
                codigo_curso: codigoCurso, 
                rut_usuario: rut,
                codigo_rol: codigoRol
            })

            handleSelectUsuarioCurso(rut, codigoRol, 1)

        } catch (e) {
            handleError(e)
        }
    }

    const handleClickEliminarUsuario = async (rut, codigoRol) => {
        try{
            await clienteAxios.delete(`/api/cursos-usuarios-roles/eliminar/${codigoCurso}`,{
                params: { 
                    rut_usuario: rut,
                    codigo_rol: codigoRol
                }
            })

            handleSelectUsuarioCurso(rut, codigoRol, 0)

        } catch (e) {
            handleError(e)
        }
    }

    const handleSelectUsuarioCurso = (rut, codigoRol, select) => {
        
        setUsuarios( usuarios => {

            return usuarios.map((usuario) => {
                if(usuario.rut === rut && usuario.codigo_rol === codigoRol){
                    return{
                        ...usuario,
                        item_select: select
                    }
                }else{
                    return usuario
                }
            })

        })

     }

    return (
        <>
            <Table striped bordered hover variant="light" responsive> 
                <thead>
                    <tr>
                    <th>#</th>
                    <th>RUT</th>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th></th>
                    </tr>
    
                </thead>
                <tbody>
                    {usuarios.length > 0 &&
                        usuarios.map((usuario, index) =>{

                            const {rut, nombre_usuario, descripcion_rol, codigo_rol, item_select} = usuario
                            let numFila = getNumeroFilaTabla(index, pagina_actual, resultados_por_pagina)

                            return(
                                <tr key={index}>
                                <td>{numFila}</td> 
                                <td>{rut}</td> 
                                <td>{nombre_usuario}</td> 
                                <td>{descripcion_rol}</td>
                                <td>
                                    <Button 
                                        variant={item_select ? "info" : "outline-info"}
                                        onClick={() => {  
                                            if(item_select){
                                                handleClickEliminarUsuario(rut, codigo_rol)
                                              
                                            }else{
                                                handleClickAgregarUsuario(rut, codigo_rol)
                                            }
                                        }}
                                    >
                                     &#10003;
                                    </Button>
                                </td>
                                
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        </>
    )
}

export default TableUsuariosDisponiblesCurso