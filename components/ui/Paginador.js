import React, { useState } from 'react';
import {Pagination} from 'react-bootstrap';

const Paginador = ({resultados_por_pagina, total_resultados, handleSetPaginaActual}) => {

    const [pagina_activa, setPaginaActiva] = useState(1);
    const [paginas_visible, setPaginasVisible] = useState(1);

    let paginas = [];
    let total_paginas = Math.ceil(total_resultados / resultados_por_pagina);
    
    for(let i = 1; i <= total_paginas; i++){
        paginas.push(
            <Pagination.Item 
                key={i} 
                active={i === pagina_activa}
                onClick={() => {
                    setPaginaActiva(i)
                    handleSetPaginaActual(i)
                }}
            >
            {i}
            </Pagination.Item>,
        );
    }

    const bloquePaginas = [];
    while(paginas.length > 0){
        bloquePaginas.push(paginas.splice(0, paginas_visible));     
    }

    const bloquePaginasActivo = bloquePaginas.filter(bloque => {
        if(bloque.filter(item => Number(item.key) === pagina_activa).length > 0){
            return bloque;
        }
    });

    return ( 
        <>
        {total_paginas === 1 
        ? 
        null
        :
        <Pagination size="sm" className="m-0">
            <Pagination.Item>
            {`${total_paginas} págs.`}
            </Pagination.Item>
            <Pagination.First 
                onClick={() => {
                    setPaginaActiva(1);
                    handleSetPaginaActual(1);
                }}
            />
            <Pagination.Prev 
                onClick={() => {
                    if(pagina_activa > 1){
                        setPaginaActiva(pagina_activa - 1);
                        handleSetPaginaActual(pagina_activa - 1);
                    }
                }}
            />
            {bloquePaginasActivo[0]}
            <Pagination.Next 
                onClick={() => {
                    if(pagina_activa < total_paginas){
                        setPaginaActiva(pagina_activa + 1);
                        handleSetPaginaActual(pagina_activa + 1);
                    }
                }}
            />
            <Pagination.Last 
                onClick={() => {
                    setPaginaActiva(total_paginas);
                    handleSetPaginaActual(total_paginas);
                }}
            />
        </Pagination>
        }
        </>
     );
}
 
export default Paginador;