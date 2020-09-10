import React, {useState, useEffect } from 'react';
import useBookSearch from '../hooks/useBookSearch';

const Test = () => {

    const [query, setQuery] = useState('')
    const [pageNumber, setPageNumber] = useState(1)

    const [count, setCount] = useState(0)

    /*
    useEffect(() => {
        setCount(prevCount => {
            return prevCount + prevCount
        })
    }, [query])
    */    
   
    

    
    function handleSearch(e){
        setQuery(e.target.value)
        setPageNumber(1 )
    }

    const {
        loading, 
        error, 
        books, 
        hasMore
    } = useBookSearch(query, pageNumber)

    const [vars, setVars] = useState({
        loading, 
        error, 
        books, 
        hasMore
    })

    return (   
        <>
            <input 
                type="text"
                onChange={handleSearch}
            ></input>
            {books.map((book, index) => {
                return  <div key={index}>{`${index} - ${book}`}</div>
            } )}
            <div>{loading && 'Loading...'}</div>
            <div>{error && 'Error!'}</div>

        </>
    );
}
 
export default Test;