import React, {useState, useEffect} from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import  clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'

const animatedComponents = makeAnimated();

const MultiSelectUnidad = ({handleChange, arrayMaterias})=> {

    const [unidades, setUnidades] = useState([])
    const [unidadesSelected, setUnidadesSelected] = useState([])

    useEffect(() => {
      
        const listarUnidades = async () => {
            try{
                const resp = await clienteAxios.get('/api/multifiltros/listarUnidades', {
                    params: {
                      array_materias: arrayMaterias
                    }
                  })
                let newUnidades = resp.data.unidades.map(unidad => ({value: unidad.codigo, label: unidad.descripcion}))
                setUnidades(newUnidades)

                let newUnidadesSelected = unidadesSelected.filter(unidadSelected => newUnidades.some(newUnidad => newUnidad.value === unidadSelected.value))
                setUnidadesSelected(newUnidadesSelected)
                
            }catch(e){
                handleError(e)
            }
        }
        
        if(arrayMaterias.length > 0){
            listarUnidades()
        }else{
            setUnidadesSelected([])
        }

    }, [arrayMaterias])
    
    useEffect(() => {
        handleChange(unidadesSelected)
    }, [unidadesSelected])


    return (
        <Select 
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={unidades} 
            value={unidadesSelected}
            placeholder="Seleccione Unidad"
            onChange={(value, { action, removedValue }) => {
                setUnidadesSelected(value)
            }}
        />

      )
}

export default MultiSelectUnidad