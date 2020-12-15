import React, {useState, useRef} from 'react';
import {Table, Button, Row, Col, Form} from 'react-bootstrap';

const TableMateria = ({materias, handleClickModificar}) => {    

    return (
        <>
            <Table striped bordered hover variant="light"> 
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Descripcion</th>
                    <th></th>
                    </tr>
    
                </thead>
                <tbody>
                    {materias.length > 0 &&
                        materias.map((materia, index) =>{
                            const {codigo, nombre} = materia
                            return(
                                <tr >
                                <td>{index+1}</td>  
                                <td>{nombre}</td> 

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

export default TableMateria;