import React, {useState, useEffect} from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import  clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'

const animatedComponents = makeAnimated();

const MultiSelectContenido = ({handleChange, arrayModulos}) => {

    const [contenidos, setContenidos] = useState([])
    const [contenidosSelected, setContenidosSelected] = useState([])

    useEffect(() => {
      
        const listarContenidos = async () => {
            try{
                const resp = await clienteAxios.get('/api/multifiltros/listarModulosContenidos', {
                    params: {
                        array_modulos: arrayModulos
                    }
                  })
                let newContenidos = resp.data.contenidos.map(contenido => ({value: contenido.codigo, label: contenido.descripcion}))
                setContenidos(newContenidos)

                let newContenidosSelected = contenidosSelected.filter(contenidoSelected => newContenidos.some(newContenido => newContenido.value === contenidoSelected.value))
                setContenidosSelected(newContenidosSelected)

            }catch(e){
                handleError(e)
            }
        }
        if (arrayModulos.length > 0 ){
            listarContenidos()
        }else{
            setContenidosSelected([])
        }

    }, [arrayModulos])

    useEffect(() => {
        handleChange(contenidosSelected)
    }, [contenidosSelected])

    return (
        <Select 
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={contenidos} 
            value={contenidosSelected}
            placeholder="Seleccione Contenido"
            onChange={(value, { action, removedValue }) => {
                setContenidosSelected(value)
            }}
        />

      )
}

export default React.memo(MultiSelectContenido)