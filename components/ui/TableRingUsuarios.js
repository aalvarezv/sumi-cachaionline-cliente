import React from 'react'
import {Table} from 'react-bootstrap'

const TableRingUsuarios = ({usuariosRing}) => {
    return ( 
        <Table striped bordered hover variant="light" responsive>
            <thead>
                <tr>
                <th>#</th>
                <th>RUT</th>
                <th>Nombre</th>
                <th>Email</th>
                </tr>
            </thead>
            <tbody>
                {usuariosRing.map((usuariosRing, index) => {
                    const { usuario } = usuariosRing
                    const {rut, nombre, email} = usuario
                    return(
                        <tr key={rut}>
                            <td>{index+1}</td>
                            <td>{rut}</td>
                            <td>{nombre}</td>
                            <td>{email}</td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>

     );
}
 
export default TableRingUsuarios;