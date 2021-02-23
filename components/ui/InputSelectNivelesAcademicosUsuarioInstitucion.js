import { set } from 'lodash'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { Form } from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'

const InputSelectNivelesAcademicosUsuarioInstitucion = props => {

    const {rut_usuario, codigo_institucion, niveles_academicos, handleSelectNivelAcademico} = props
    
    const [nivelesAcademicosUsuarioInstitucion, setNivelesAcademicosUsuarioInstitucion] = useState([])
   
   
    useEffect(() => {

        const listarNivelesAcademicosUsuarioInstitucion = async () => {
            try{

                const resp = await clienteAxios.get('/api/nivel-academico/usuario-institucion',{
                    params: {
                        rut_usuario,
                        codigo_institucion,
                    }
                })
                
                let newNivelesAcademicosUsuarioInstitucion = resp.data.niveles_academicos_usuario_institucion.map(nivelesAcademicosUsuarioInstitucion => {
                
                    const codigo = nivelesAcademicosUsuarioInstitucion["curso.nivel_academico.codigo"]
                    const descripcion =  nivelesAcademicosUsuarioInstitucion["curso.nivel_academico.descripcion"]
                    
                    return {
                        codigo,
                        descripcion,
                        selected: false
                    }
                })
                setNivelesAcademicosUsuarioInstitucion(newNivelesAcademicosUsuarioInstitucion)
                
              
            }catch(e){
                handleError(e)
            }
        }

        listarNivelesAcademicosUsuarioInstitucion()

    }, [])


    const handleChange = e => {

        //Asigna los valores que tenga niveles_academicos en caso que sea una modificación.      
        let newNiveles = nivelesAcademicosUsuarioInstitucion.map( nivelAcademicoUsuarioInstitucion => {

            const nivelAcademico = niveles_academicos.find(nA => nA.codigo === nivelAcademicoUsuarioInstitucion.codigo)
            if(nivelAcademico){
                return nivelAcademico
            }else{
                return nivelAcademicoUsuarioInstitucion
            }
            
        })
      
        //Selecciona o Deselecciona el item que corresponda
        newNiveles = newNiveles.map( nivelAcademicoUsuarioInstitucion => {
            
            const { codigo } = nivelAcademicoUsuarioInstitucion
            
            if(codigo === e.target.value){
                return {
                    ...nivelAcademicoUsuarioInstitucion,
                    selected: !nivelAcademicoUsuarioInstitucion.selected
                }
            }else{
                return nivelAcademicoUsuarioInstitucion
            }
        })

        setNivelesAcademicosUsuarioInstitucion(newNiveles)
        handleSelectNivelAcademico(newNiveles)

    }

    //De las posibilidades que tiene como niveles académicos el profesor, se cambia el estado selected: true, a los niveles que fueron grabados cuando se creó el ring. Cuando se modifica, debo marcar aquellos que fueron seleccionados.
    const newNiveles = nivelesAcademicosUsuarioInstitucion.map(nivelAcademicoUsuarioInstitucion => {
                
        let selected = niveles_academicos.filter(nivelAcademico => nivelAcademico.selected === true && nivelAcademico.codigo === nivelAcademicoUsuarioInstitucion.codigo).length > 0
        
        return {
            ...nivelAcademicoUsuarioInstitucion,
            selected: selected,
        }
    })

    return (
     
        <Form.Control
            {...props}
            onChange={handleChange}
        >   
            {newNiveles.map(nivelAcademicoUsuarioInstitucion => 
                {
                    const {codigo, descripcion, selected } = nivelAcademicoUsuarioInstitucion
                    
                    //let selected = niveles_academicos.filter(nivelAcademico => nivelAcademico.selected === true && nivelAcademico.codigo === codigo).length > 0
                    return <option key={codigo} value={codigo} className={`p-1 ${selected ? 'bg-info text-white' : 'bg-white'}`}>{descripcion}</option>
                }
            )}
        </Form.Control>

    )
}

export async function getServerSideProps() {
 
    try{

        const resp = await clienteAxios.get('/api/nivel-academico/usuario-institucion',{
            params: {
                rut_usuario,
                codigo_institucion,
            }
        })
        console.log(resp.data.niveles_academicos_usuario_institucion)
        let newNivelesAcademicosUsuarioInstitucion = resp.data.niveles_academicos_usuario_institucion.map(nivelesAcademicosUsuarioInstitucion => {
        
            const codigo = nivelesAcademicosUsuarioInstitucion["curso.nivel_academico.codigo"]
            const descripcion =  nivelesAcademicosUsuarioInstitucion["curso.nivel_academico.descripcion"]

            return {
                codigo,
                descripcion,
                selected: false
            }
        })

        return { props: { nivelesAcademicosInstitucion } }

    }catch(e){
        handleError(e)
    }

}
 
export default InputSelectNivelesAcademicosUsuarioInstitucion