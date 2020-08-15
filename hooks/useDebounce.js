import { useState, useEffect } from 'react';

//hook que permite que una función no sea ejecutada sinó después de finalizar el evento
//esperá un tiempo (delay) y ejecutará la función recibida.
const useDebounce = (funcion, delay) => {
    
    console.log('render-debounce');
    const [timeoutId, setTimeoutId] = useState(null);
    const [search, setSearch] = useState(false);
    
    useEffect(() => {
        timeoutId && clearTimeout(timeoutId); //previene que se ejecute el código que contiene el 
        setTimeoutId(setTimeout(() => {
            funcion(); //ejecuta la función recibida si no se aplica el clearTimeout después de 
         }, delay));
    },[search]);

    const handleSearch = () =>{
        setSearch(!search);
    }

    return {
        handleSearch
    }
    
};
 
export default useDebounce;