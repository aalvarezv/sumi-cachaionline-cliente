import React, {useState} from 'react';
import {Table, Button, Row, Col, Form} from 'react-bootstrap';

const TableInstitucion = ({instituciones, handleClickModificar}) => {  
    

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
                    {instituciones.length > 0 &&
                        instituciones.map((institucion, index) =>{
                            const {codigo, descripcion} = institucion
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

export default TableInstitucion;