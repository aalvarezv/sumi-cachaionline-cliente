import React, { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'

const InputSelectCursosUsuarioNivelAcademicoInstitucion = props => {

    let { rut_usuario, niveles_academicos, codigo_institucion} = props

    const [cursos_usuario_nivel_academico_institucion, setCursosUsuarioNivelAcademicoInstitucion] = useState([])

    useEffect(() => {
        
        const listarCursosUsuarioNivelAcademicoInstitucion = async () => {
            try{

                const resp = await clienteAxios.get('/api/cursos/listar/usuario-nivel-academico-institucion',{
                    params: {
                        rut_usuario,
                        niveles_academicos,
                        codigo_institucion,
                    }
                })
                setCursosUsuarioNivelAcademicoInstitucion(resp.data.cursos_usuario_nivel_academico_institucion)
            }catch(e){
                handleError(e)
            }
        }
        listarCursosUsuarioNivelAcademicoInstitucion()

    }, [codigo_institucion, niveles_academicos, rut_usuario])

    return (
        <Form.Control
            {...props}
        >
            <option key="0" value="0">{props.label ? props.label : 'SELECCIONE CURSO'}</option>
            {cursos_usuario_nivel_academico_institucion.map(curso_usuario_nivel_academico_institucion => {
                
                const codigo = curso_usuario_nivel_academico_institucion["curso.codigo"]
                const letra = curso_usuario_nivel_academico_institucion["curso.letra"]
                const nivel_academico_descripcion = curso_usuario_nivel_academico_institucion["curso.nivel_academico.descripcion"]
                return <option key={codigo} value={codigo}>{`${nivel_academico_descripcion} ${letra}`}</option>
            }
            )}
        </Form.Control>
    )
}
 
export default InputSelectCursosUsuarioNivelAcademicoInstitucion