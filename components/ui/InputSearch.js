import React, {useState, useCallback} from 'react';
import { Form } from 'react-bootstrap';
import { debounce } from 'lodash';

const InputSearch = ({setFilter, results, setResultSelect}) => {
    //state del campo de texto, cuando una opción sea seleccionada,
    //el valor será seteado en el campo.
    const [text, setText]    =  useState('');
    //state que indica cuando un item fue seleccionado.
    const [item_select, setItemSelect] = useState(false);
    //debounce: permite que la función se ejecute luego de medio segundo, una vez finalizado
    //el evento.
    //useCallback: permite que la función sea guardada en memoria y no se vuelva a crear,
    //cuando el componente se vuelve a renderizar. Si una dependencia cambia entonces ahí se renderiza. Para este caso no le pasamos dependencia alguna.
    const setFilterDebounced =  useCallback( debounce((val) => {
                                                setFilter(val);
                                            }, 500),[]);

    //si el valor del campo de búsqueda cambia...
    const handleChange = e => {
        //marca que no ha seleccionado ningún ítem.
        setItemSelect(false);
        //setea el item seleccionado como null.
        setResultSelect(null);
        //llena el state con el texto ingresado.
        setText(e.target.value);
        //setea el filtro de búsqueda para tenerlo disponible en el componente padre.
        setFilterDebounced(e.target.value);
    }
    //si selecciona una opción del resultado de búsqueda.
    const handleClickOption = ( e, item ) => {
        //setea el texto de la opción en la caja de texto de búsqueda.
        setText(e.target.innerHTML);
        //setea el item seleccionado para tenerlo disponible en el componente padre.
        setResultSelect(item);
        //marca que ha seleccionado un ítem.
        setItemSelect(true);

        setFilter(e.target.innerHTML);
    }
 
    return (
        <>
        <Form.Control 
            type="text"
            size="lg" 
            placeholder="Búsqueda..."
            value={text}
            autoComplete="off"
            className="mb-3" 
            onChange={handleChange}
        />
        {


        }
        <ul>
            {(!item_select && results) && results.map(item => {
                return (
                <li 
                    key={item.rut}
                    onClick={e => handleClickOption(e, item)}
                >
                    {`${item.nombre}`}  
                </li>
                );
            })}
        </ul> 
        </>
    )
};

export default React.memo(InputSearch)