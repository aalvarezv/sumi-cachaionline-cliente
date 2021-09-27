import React, {useState, useEffect} from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import  clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'

const animatedComponents = makeAnimated();

const MultiSelectConcepto = ({handleChange, arrayTemas}) => {

    const [conceptos, setConceptos] = useState([])
    const [conceptosSelected, setConceptosSelected] = useState([])

    useEffect(() => {
      
        const listarConceptos = async () => {
            try{
                const resp = await clienteAxios.get('/api/multifiltros/listarModulosContenidosTemaConceptos', {
                    params: {
                        array_temas: arrayTemas
                    }
                  })
                let newConceptos = resp.data.conceptos.map(concepto => ({value: concepto.codigo, label: concepto.descripcion}))
                setConceptos(newConceptos)

                let newConceptosSelected = conceptosSelected.filter(conceptoSelected => newConceptos.some(newConcepto => newConcepto.value === conceptoSelected.value))
                setConceptosSelected(newConceptosSelected)
                               
            }catch(e){
                handleError(e)
            }
        }

        if(arrayTemas.length > 0 ){
            listarConceptos()
        }else{
            setConceptosSelected([])
        }
       

    }, [arrayTemas])

    
    useEffect(() => {
        handleChange(conceptosSelected)
    }, [conceptosSelected])
    
    return (
        <Select     
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={conceptos} 
            value={conceptosSelected}
            placeholder="Seleccione Concepto"
            onChange={(value, { action, removedValue }) => {
                setConceptosSelected(value)
            }}
        />

      )
}

export default React.memo(MultiSelectConcepto)