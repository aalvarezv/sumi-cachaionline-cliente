import React, {useState, useRef} from 'react';
import {Table, Button, Row, Col, Form} from 'react-bootstrap';


const TableUsuario = ({usuarios, handleClickModificar}) => {
 
    return (
        <>
            
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
                        usuarios.map((usuario, index) =>{
                            const {rut, nombre} = usuario
                            return(
                                <tr >
                                <td>{index+1}</td>  
                                <td>{rut}</td>    
                                <td>{nombre}</td> 

                                <td>
                                    <Button 
                                        variant="outline-info"
                                        onClick={() => {
                                            handleClickModificar(rut);
                                        }}
                                    >
                                     Modificar
                                    </Button>
                                </td>
                                <td>
                                    <Button 
                                        variant="danger"
                                    >
                                        Eliminar
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

export default TableUsuario;