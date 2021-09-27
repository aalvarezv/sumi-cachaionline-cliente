import React, {useState, useEffect} from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import  clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'

const animatedComponents = makeAnimated();

const MultiSelectTema = ({handleChange, arrayContenidos}) => {

    const [temas, setTemas] = useState([])
    const [temasSelected, setTemasSelected] = useState([])

    useEffect(() => {
      
        const listarTemas = async () => {
            try{
                const resp = await clienteAxios.get('/api/multifiltros/listarModulosContenidosTemas', {
                    params: {
                        array_contenidos: arrayContenidos
                    }
                  })
                let newTemas = resp.data.temas.map(tema => ({value: tema.codigo, label: tema.descripcion}))
                setTemas(newTemas)

                let newTemasSelected = temasSelected.filter(temaSelected => newTemas.some(newTema => newTema.value === temaSelected.value))
                setTemasSelected(newTemasSelected)

            }catch(e){
                handleError(e)
            }
        }

        if(arrayContenidos.length > 0){
           listarTemas() 
        }else{
            setTemasSelected([])
        }

    }, [arrayContenidos])

    useEffect(() => {
        handleChange(temasSelected)
    }, [temasSelected])
    
    
    return (
        <Select 
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={temas} 
            value={temasSelected}
            placeholder="Seleccione Tema"
            onChange={(value, { action, removedValue }) => {
                setTemasSelected(value)
            }}
        />

      )
}

export default React.memo(MultiSelectTema)