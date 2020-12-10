import React, { useState, useEffect, useContext } from 'react';
import { Form } from 'react-bootstrap';
import AuthContext from '../../context/auth/AuthContext';

const InputSelectInstitucionesUsuario = props => {

    const { usuario } = useContext(AuthContext);
    const [instituciones, setInstituciones] = useState([]);

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
        }
    },[]);

    return ( 
        <Form.Control
            {...props}
        >   
            <option key="0" value="0">{props.label ? props.label : 'SELECCIONE UNA INSTITUCIÓN'}</option>
            {instituciones.map(institucion => {
                const {codigo, descripcion} = institucion;
                return <option key={codigo} value={codigo}>{descripcion}</option>
            })}
        </Form.Control> 
    );
}
 
export default InputSelectInstitucionesUsuario;