import React, {useState, useRef} from 'react'
import  clienteAxios from '../../config/axios'
import {getNumeroFilaTabla, handleError} from '../../helpers'
import {Table, Button, Row, Col, Badge, Popover, Overlay} from 'react-bootstrap'


const TableUsuariosDisponiblesCurso = ({usuarios, pagina_actual, resultados_por_pagina
                                ,codigoCurso, handleSelectUsuarioCurso}) => { 


    const handleClickAgregarUsuario = async (rut,  codigoRol) => {
        try {
            const resp = await clienteAxios.post('/api/cursos-usuarios-roles/crear',{
                codigo_curso: codigoCurso, 
                rut_usuario: rut,
                codigo_rol: codigoRol
            })
        } catch (e) {
            handleError(e)
        }
    }

    const handleClickEliminarUsuario = async (rut, codigoRol) => {
        try{
            const resp = await clienteAxios.delete(`/api/cursos-usuarios-roles/eliminar/${codigoCurso}`,{
                params: { 
                    rut_usuario: rut,
                    codigo_rol: codigoRol
                }
            })
        } catch (e) {
            handleError(e)
        }
    }

    return (
        <>
            <Table striped bordered hover variant="light" responsive> 
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Rut</th>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th></th>
                    </tr>
    
                </thead>
                <tbody>
                    {usuarios.length > 0 &&
                        usuarios.map((usuario, index) =>{

                            const {rut, nombre_usuario, email, 
                                    descripcion_rol, codigo_rol,
                                item_select} = usuario
                            let numFila = getNumeroFilaTabla(index, pagina_actual, resultados_por_pagina)

                            return(
                                <tr key={index}>
                                <td>{index+1}</td> 
                                <td>{rut}</td> 
                                <td>{nombre_usuario}</td> 
                                <td>{codigo_rol}</td>
                                <td>
                                    <Button 
                                        variant={item_select ? "info" : "outline-info"}
                                        onClick={() => {  
                                            if(item_select){
                                                handleClickEliminarUsuario(rut, codigo_rol)
                                                handleSelectUsuarioCurso(rut, 0)
                                            }else{
                                                handleClickAgregarUsuario(rut, codigo_rol)
                                                handleSelectUsuarioCurso(rut, 1)
                                            }
                                            }
                                        }
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