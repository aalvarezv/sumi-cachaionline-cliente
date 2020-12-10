import React,{ useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import { Row, Col, Form } from 'react-bootstrap';

const MenuInstitucionPerfil = () => {

    const { usuario, institucion, rol, seteaInstitucion, seteaRol } = useContext(AuthContext);
    //Instituciones que serán seteadas en el state para cargar el combobox.
    const [instituciones, setInstituciones] = useState([]);
    //Roles que serán seteados en el state para cargar el combobox.
    const [roles, setRoles] = useState([]);
    
    useEffect(() => {
        //Verificamos que el usuario y usuario.usuario_institucion_rols no sea null
        
        if(usuario){ 
            //Creamos un arreglo para guardar las distintas instituciones que pertenece el usuario,
            //cabe destacar que un usuario que tenga 2 roles, la institución se repetirá 2 veces, por ello 
            //se crea esta logica.          
            let new_instituciones = [];
            //Se recorren los registros de usuario_institucion_rols.
            for(let usuario_institucion_rol of usuario.usuario_institucion_rols){
                //Si no hay ningún registro en el new_instituciones, lo agrega.
                if(new_instituciones.length === 0){
                    new_instituciones.push(usuario_institucion_rol.institucion);
                }else{
                    //Verifica si en new_instituciones existe el codigo de la institucion iterada, que se encuentra en:usuario_institucion_rol.institucion.codigo 
                    if(new_instituciones.filter(institucion => institucion.codigo === usuario_institucion_rol.institucion.codigo).length === 0){
                        //Si no existe entonces la agrega al arreglo.
                        new_instituciones.push(usuario_institucion_rol.institucion);
                    }
                }
            }
            //Setea el new_instituciones en el state para que sea cargado en el combobox en el siguiente render.
            setInstituciones(new_instituciones);
            //Disponibiliza la institucion por defecto para el useContext, en caso que se encuentre nula.
            if (!institucion){
                seteaInstitucion(new_instituciones[0]);
            }
                      
        }

    },[])
    
    
    useEffect(() => {

        //Setea roles segun la institución.
        if(institucion){ 
            //arreglo que contendrá los roles segun institución.
            let new_roles = [];  
            //filtra las instituciones de acuerdo a lo seleccionado en el combobox institucion y que se guarda en el context para obtener los roles asignados al usuario en esa institución.
            let new_roles_institucion = usuario.usuario_institucion_rols.filter(usuario_institucion_rol => usuario_institucion_rol.codigo_institucion === institucion.codigo);
            //recorre y agrega los roles al arreglo.
            for(let roles_institucion of new_roles_institucion){
                new_roles.push(roles_institucion.rol)
            }
            //setea el new_roles en el state para que sea cargado en el combobox en el siguiente render.
            setRoles(new_roles);
            //Disponibiliza el rol por defecto para el useContext, en caso que no tenga ninguno seteado.
            if(!rol){
                seteaRol(new_roles[0]);
            }
            
        }
        
    },[institucion])
  

    return ( 
        <>
            <Row className="m-2">
                <Col>
                    <Form.Control
                        name="institucion"
                        as="select"
                        size="sm"
                        value={institucion ? institucion.codigo : 0}
                        onChange={e => {
                            const new_institucion = instituciones.filter(institucion => institucion.codigo === e.target.value);
                            seteaRol(null);
                            seteaInstitucion(new_institucion[0]);
                        }}
                    >
                    {instituciones.map(institucion => {
                        const {codigo, descripcion} = institucion;
                        return <option key={codigo} value={codigo}>{descripcion}</option>
                    })}
                    </Form.Control>
                </Col>
            </Row>
            <Row className="m-2">
                <Col>
                    <Form.Control
                        name="rol"
                        as="select"
                        size="sm"
                        value={rol ? rol.codigo : 0}
                        onChange={e => {
                            const new_rol = roles.filter(rol => rol.codigo === e.target.value);
                            seteaRol(new_rol[0]);
                        }}
                    >
                        {roles.map(rol => {
                            const {codigo, descripcion} = rol;
                            return <option key={codigo} value={codigo}>{descripcion}</option>
                        })}
                    </Form.Control>
                </Col>
            </Row>
        </>

     );
}
 
export default MenuInstitucionPerfil;