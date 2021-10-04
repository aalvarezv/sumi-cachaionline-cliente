import React, { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'

const InputSelectCursosUsuarioNivelAcademicoInstitucion = props => {

    let { codigo_nivel_academico, codigo_institucion} = props

    const [cursos_nivel_academico_institucion, setCursosNivelAcademicoInstitucion] = useState([])

    useEffect(() => {
        
        const listarCursosNivelAcademicoInstitucion = async () => {
            try{
                const resp = await clienteAxios.get('/api/cursos/listar/nivel-academico-institucion',{
                    params: {
                        codigo_nivel_academico,
                        codigo_institucion,
                    }
                })
                setCursosNivelAcademicoInstitucion(resp.data.cursos_nivel_academico_institucion)
            }catch(e){
                handleError(e)
            }
        }
        listarCursosNivelAcademicoInstitucion()

    }, [codigo_institucion, codigo_nivel_academico])

    return (
        <Form.Control
            {...props}
        >
            <option key="0" value="0">{props.label ? props.label : 'SELECCIONE CURSO'}</option>
            {
            cursos_nivel_academico_institucion.map(curso_nivel_academico_institucion => {
                let codigoCurso = curso_nivel_academico_institucion.codigo
                let nivelAcademicoDescripcion = curso_nivel_academico_institucion.nivel_academico.descripcion
                let letraCurso = curso_nivel_academico_institucion.letra
                return <option key={codigoCurso} value={codigoCurso}>{
                    `${nivelAcademicoDescripcion} ${letraCurso}`}
                </option>
            })}
        </Form.Control>
    )
}
 
export default InputSelectCursosUsuarioNivelAcademicoInstitucion