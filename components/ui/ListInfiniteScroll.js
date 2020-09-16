import React, {useState, useRef, useCallback, useEffect} from 'react';
import { InputGroup, Form, ListGroup, Col } from 'react-bootstrap';
import useScrollInfinito from '../../hooks/useInfiniteScroll';
import Spinner from './Spinner';

const ListInfiniteScroll = ({url, model, pk, label, 
                             items_selected, handleSelect}) => {

   const [filtro, setFiltro] = useState('');
   const [page_num, setPageNum] = useState(1);
   const [limit, setLimit] = useState(10);
   const [result_select, setResultSelect] = useState([]);

   const {
       loading, 
       error, 
       results, 
       hasMore
   } = useScrollInfinito(url, filtro, page_num, limit, model);

   useEffect(() => {
       if(items_selected.length > 0) setResultSelect(items_selected)
   },[items_selected])

   const observer = useRef();
   //esta referencia llama a la función y le pasa el elemento creado.
   const lastResultElementRef = useCallback( node => {
       //si está cargando entonces se detiene.
       if(loading) {
           return
       }
       if(observer.current) {
           observer.current.disconnect();
       }
       observer.current = new IntersectionObserver(entries => {
           //entries[0] es el elemento que estamos observando, en este caso el último registro.
           if(entries[0].isIntersecting && hasMore){
               setPageNum(prevPageNumber => prevPageNumber + 1);
           }
       })
       
       if(node){
           observer.current.observe(node);
       }
       
   },[loading, hasMore]);
   
   //cuando hace click a un item
   const handleClickItem = result => {

        //si el elemento ya se encuentra seleccionado y se encuentra en el array result_select.
        if(result_select.includes(result[pk])){
            //lo quita del array
            const new_result_select = result_select.filter(item => {
            return  item !== result[pk] 
            })
            //setea el state
            setResultSelect(new_result_select);
            //envia el codigo del item deselecionado al componente superior mediante la funcion handleSelect.
            handleSelect(result[pk], false);
        }else{
            //agrega el elemento seleccionado al state
            setResultSelect([
                ...result_select,
                result[pk]
            ]);
            //envia el codigo del item seleccionado al componente superior mediante la funcion handleSelect.
            handleSelect(result[pk], true);
        }
   }

   return (   
        <>
        <Form>
        <Form.Row>
            <Col>
                <InputGroup className="mb-2 mr-sm-2">
                    <Form.Control 
                        id="filtro" 
                        placeholder="Buscar" 
                        value={filtro}
                        onChange={ e => {
                            setFiltro(e.target.value)
                            setPageNum(1)
                        }}
                    />
                    <InputGroup.Prepend>
                        <InputGroup.Text>@</InputGroup.Text>
                    </InputGroup.Prepend>
                </InputGroup>
            </Col>
        </Form.Row> 
        <Form.Row>
            <Col>
                <ListGroup>
                {results.map((result, index) => {
                    //Si el elemento corresponde al ultimo resultado, pasa la referencia para que se almacene con el useCallback 
                    return <ListGroup.Item 
                                key={result[pk]}
                                ref={results.length === index + 1 ? lastResultElementRef : undefined}
                                variant="light"
                                variant={result_select.includes(result[pk]) ? "info" : "light"}
                                onClick={() => {handleClickItem(result)}}
                            >
                                {`${result[label]}`}
                            </ListGroup.Item> 
                })}
                </ListGroup>
            </Col>
        </Form.Row>
        <Form.Row className="justify-content-center">
            
            {loading 
            && 
            <Col> 
                <Spinner label={model} /> 
            </Col>}
            
        </Form.Row>
        </Form>
        </>
   );


}

export default ListInfiniteScroll
