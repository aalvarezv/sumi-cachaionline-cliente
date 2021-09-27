import React, {useState, useEffect} from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import  clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'

const animatedComponents = makeAnimated();

const MultiSelectModulo = ({handleChange, arrayUnidades}) => {

    const [modulos, setModulos] = useState([])
    const [modulosSelected, setModulosSelected] = useState([])

    useEffect(() => {
      
        const listarModulos = async () => {
            try{
                const resp = await clienteAxios.get('/api/multifiltros/listarModulosUnidades', {
                    params: {
                        array_unidades: arrayUnidades
                    }
                  })
                let newModulos = resp.data.modulos.map(modulo => ({value: modulo.codigo, label: modulo.descripcion}))
                setModulos(newModulos)

                let newModulosSelected = modulosSelected.filter(moduloSelected => newModulos.some(newModulo => newModulo.value === moduloSelected.value))
                setModulosSelected(newModulosSelected)
                
            }catch(e){
                handleError(e)
            }
        }

        if(arrayUnidades.length > 0){
            listarModulos()
        }else{
            setModulosSelected([])
        }

    }, [arrayUnidades])

    useEffect(() => {
        handleChange(modulosSelected)
    }, [modulosSelected])
    
    return (
        <Select 
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={modulos} 
            value={modulosSelected}
            placeholder="Seleccione Modulo"
            onChange={(value, { action, removedValue }) => {
                setModulosSelected(value)
            }}
        />

      )
}

export default React.memo(MultiSelectModulo)