import React, {useState, useRef, useCallback, useEffect} from 'react';
import { Container, Form, ListGroup, Col } from 'react-bootstrap';
import useScrollInfinito from '../../hooks/useInfiniteScroll';
import { handleError } from '../../helpers';
import Spinner from './Spinner';

const ListInfiniteScroll = ({url, model, pk, label, filters, 
                             items_selected, handleSelect}) => {
   
    const [page_num, setPageNum] = useState(1);
    const [limit, setLimit] = useState(10);
    //almacena los results obtenido en el useScrollInfinito para poder manipularlos cuando el usuario
    //seleccione o deseleccione un ítem.
    const [results_local, setResultLocal] = useState([]);
    
    const {
        loading, 
        results, 
        hasMore
    } = useScrollInfinito(url, filters, page_num, limit, model);
    
    //si cambian los filtros entonces parte la consulta desde la página 1
    useEffect(() => {
        setPageNum(1);
    },[filters]);

    useEffect(() => {
        if(results) {
            setResultLocal(results);
        }
    }, [results])

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
    const handleClickItem = async item => {

        try{
            await handleSelect(item, !item.item_select);
            const new_results_local = results_local.map(res => {
                if(res[pk] === item[pk]){
                    return { 
                        ...res,
                        item_select : Number(!res.item_select)
                    }
                }
                return res;
            });
            setResultLocal(new_results_local);
        }catch(e){
            handleError(e);
        }
        
    }

    return (  
        <Container
            className="pt-3"
        > 
        <Form>
            <Form.Row>
                <Col>
                    <ListGroup>
                    {results_local.map((result, index) => {
                        //Si el elemento corresponde al ultimo resultado, pasa la referencia para que se almacene con el useCallback 
                        return <ListGroup.Item 
                                    key={`${index}-${result[pk]}`}
                                    ref={results.length === index + 1 ? lastResultElementRef : undefined}
                                    //variant={result_select.includes(result[pk]) ? "info" : "light"}
                                    variant={result.item_select === 0 ? "light" : "info"}
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
        </Container>
   );


}

export default ListInfiniteScroll;
