import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import  clienteAxios from '../../config/axios';
import { handleError } from '../../helpers';

const InputSelectNivelesAcademicosUsuarioInstitucion = props => {

    const {rut_usuario, codigo_institucion} = props;
    
    const [niveles_academicos_usuario_institucion, setNivelesAcademicosUsuarioInstitucion] = useState([]);

    useEffect(() => {
        
        const listarNivelesAcademicosUsuarioInstitucion = async () => {
            try{
                const resp = await clienteAxios.get('/api/nivel-academico/usuario-institucion',{
                    params: {
                        rut_usuario,
                        codigo_institucion,
                    }
                });
                setNivelesAcademicosUsuarioInstitucion(resp.data.niveles_academicos_usuario_institucion);
            }catch(e){
                handleError(e);
            }
        }
        listarNivelesAcademicosUsuarioInstitucion();

    }, [rut_usuario, codigo_institucion])

    return (
        <Form.Control
            {...props}
        >
            <option key="0" value="0">{props.label ? props.label : 'SELECCIONE UN NIVEL ACADEMICO'}</option>
            {niveles_academicos_usuario_institucion.map(nivel_academico_usuario_institucion => {

                const codigo = nivel_academico_usuario_institucion["curso.nivel_academico.codigo"];
                const descripcion =  nivel_academico_usuario_institucion["curso.nivel_academico.descripcion"];

                return <option key={codigo} value={codigo}>{descripcion}</option>
            }
            )}
        </Form.Control>
    );
}
 
export default InputSelectNivelesAcademicosUsuarioInstitucion;