import React, {useState, useRef} from 'react';
import {Table, Button, Row, Col, Form} from 'react-bootstrap';

const TableRol = ({roles, handleClickModificar}) => {

    return (
        <>
            <Table striped bordered hover variant="light"> 
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Descripcion</th>
                    <th></th>
                    <th></th>
                    </tr>
    
                </thead>
                <tbody>
                    {roles.length > 0 &&
                        roles.map((rol, index) =>{
                            const {codigo, descripcion} = rol
                            return(
                                <tr >
                                <td>{index+1}</td>      
                                <td>{descripcion}</td>                      
                                <td>
                                    <Button 
                                        variant="outline-info"
                                        onClick={() => {
                                            handleClickModificar(codigo);
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

export default TableRol;