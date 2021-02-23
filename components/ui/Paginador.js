import React, { useState, useEffect } from 'react'
import {Pagination, Row, Col} from 'react-bootstrap'

const Paginador = ({resultados_por_pagina, total_resultados, handleSetPaginaActual, pagina_activa}) => {

    
    const [paginas_visible, setPaginasVisible] = useState(1)

    let paginas = []
    let total_paginas = Math.ceil(total_resultados / resultados_por_pagina)
    
    for(let i = 1; i <= total_paginas; i++){
        paginas.push(
            <Pagination.Item 
                key={i} 
                active={i === pagina_activa}
                onClick={() => {
                    handleSetPaginaActual(i)
                }}
            >
            {i}
            </Pagination.Item>,
        )
    }

    const bloquePaginas = []
    while(paginas.length > 0){
        bloquePaginas.push(paginas.splice(0, paginas_visible))     
    }

    const bloquePaginasActivo = bloquePaginas.filter(bloque => {
        if(bloque.filter(item => Number(item.key) === pagina_activa).length > 0){
            return bloque
        }
    })

    return ( 
       <>
        <style type="text/css">{`
            .page-item.active .page-link {
                background-color: #34A2B8;
                border-color: #34A2B8;
            }
            .page-link {
                color: #34A2B8; 
            }
            .page-link:hover {
                color: #34A2B8 
            }
        `}</style>  
        <Pagination size="md" className="m-0">
            
                <Pagination.Item>
                    {`Total Resultados ${total_resultados}`}
                </Pagination.Item>
                <Pagination.First 
                    className="item-activo"
                    onClick={() => {
                        handleSetPaginaActual(1)
                    }}
                />
                <Pagination.Prev 
                    onClick={() => {
                        if(pagina_activa > 1){
                            handleSetPaginaActual(pagina_activa - 1)
                        }
                    }}
                />
                {bloquePaginasActivo[0]}
                <Pagination.Next 
                    onClick={() => {
                        if(pagina_activa < total_paginas){
                            handleSetPaginaActual(pagina_activa + 1)
                        }
                    }}
                />
                <Pagination.Last 
                    onClick={() => {
                        handleSetPaginaActual(total_paginas)
                    }}
                />
                <Pagination.Item>
                    {`Total Páginas ${total_paginas}`}
                </Pagination.Item>   
        </Pagination>
        </>
     )
}
 
export default Paginador