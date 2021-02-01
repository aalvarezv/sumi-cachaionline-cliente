import {useEffect, useState} from 'react'
import clienteAxios from '../config/axios'
import { handleError } from '../helpers/'
import axios from 'axios'

function useInfiniteScroll(url, filters, page_num, limit, model) {

    const [loading, setLoading] = useState(true)
    const [results, setResults] = useState([])
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {      
        setResults([]) 
    },[filters, limit])
  
    useEffect(() => {
       
        setLoading(true)
        let cancel //funcion que se ejecuta si se cancela la llamada y que se asigna en el cancelToken
        clienteAxios.get(`${url}`, {
            params: {page: page_num, limit: limit, filters: filters},
            cancelToken: new axios.CancelToken(c => {
                cancel = c
            })
        }).then(resp => {
            setResults(prevResults => {
                //prevResults es el state actual
                //retorna un array con los valores previos + los de la llamada y con el Set quita los duplicados.
                return[
                    ...prevResults, 
                    ...resp.data.results[model]
                ]
            })
            
            //si hay mas que 0 true
            setHasMore(resp.data.results.next !== undefined ? true : false)
            setLoading(false)
            

        }).catch(e => {
            if(axios.isCancel(e)) {
                return
            }
            //si el error no es de cancelación de la promesa entonces lo muestra en la consola y setea el state true.
            handleError(e)
        })
        
        //si vuelves a escribir cambia el filtro, por lo tanto se vuelve a ejecutar el efecto que ejecuta la función que retorna el cancel() de la llamada anterior.
        return () => {
            cancel()
        } 
            
        

    }, [filters, page_num, limit])

    return  {loading, results, hasMore}
}

export default useInfiniteScroll
