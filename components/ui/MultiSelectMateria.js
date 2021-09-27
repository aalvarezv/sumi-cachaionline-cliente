import React, {useState, useEffect} from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import  clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'

const animatedComponents = makeAnimated();

const MultiSelectMateria = ({handleChange}) => {

    const [materias, setMaterias] = useState([])

    useEffect(() => {
      
        const listarMaterias = async () => {
            try{
                const resp = await clienteAxios.get('/api/materias/listar')

                let newMaterias = resp.data.materias.map(materia => ({value: materia.codigo, label: materia.nombre}))
                setMaterias(newMaterias)

            }catch(e){
                handleError(e)
            }
        }

        listarMaterias()

    }, [])
    
    
    return (
        <Select 
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={materias} 
            placeholder="Seleccione Materia"
            onChange={handleChange}
        />

      )
}

export default React.memo(MultiSelectMateria)