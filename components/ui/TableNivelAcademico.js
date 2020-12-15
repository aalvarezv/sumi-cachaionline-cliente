import React, {useState, useRef} from 'react';
import {Table, Button, Row, Col, Form} from 'react-bootstrap';;

const TableNivelAcademico = ({niveles_academicos, handleClickModificar}) => {

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
                    {niveles_academicos.length > 0 &&
                        niveles_academicos.map((nivel_academico, index) =>{
                            const {codigo, descripcion} = nivel_academico
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

export default TableNivelAcademico;