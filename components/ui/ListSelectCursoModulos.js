import React, {useEffect, useState, useMemo, useCallback } from 'react'
import {Container, Form, Row, Col} from 'react-bootstrap'
import { debounce } from 'lodash'
import ListInfiniteScroll from './ListInfiniteScroll'
import {handleError} from '../../helpers'
import clienteAxios from '../../config/axios'
import InputSelectMateria from './InputSelectMateria'

const ListSelectCursoModulos = ({codigo_curso}) => {

    const [descripcion_modulo, setDescripcionModulo ] = useState('')
    const [filtro_codigo_materia, setFiltroCodigoMateria] = useState('0')
    const [filtro_descripcion_modulo, setFiltroDescripcionModulo] = useState('')
    
    useEffect(() => {
       
        setFiltroCodigoMateria('0')
        setFiltroDescripcionModulo('')
        setDescripcionModulo('')

    },[codigo_curso])

    const handleSelect = (item, select) => {

        return new Promise(async (resolve, reject) => {
            let resp = null
            try{
                if(select){
                    resp = await clienteAxios.post('/api/cursos-modulos/crear',{
                        codigo_curso, 
                        codigo_modulo: item.codigo
                    })
                }else{
                    resp = await clienteAxios.delete(`/api/cursos-modulos/eliminar/${codigo_curso}`,{
                        params: { 
                            codigo_modulo: item.codigo
                        }
                    })
                }
                resolve(true)
            }catch(e){
                handleError(e)
                reject(e)
            }
        })
        
    }

    const ListInfiniteScrollNoMemo = (curso, desc_modulo, materia)  => {

        return (
            <ListInfiniteScroll 
                url={'/api/modulos/listar-disponibles-curso'}
                model={"modulos"}
                pk={"codigo"}
                label={"descripcion"}
                filters={{
                    codigo_curso: curso,
                    descripcion: desc_modulo,
                    codigo_materia: materia
                }}
                handleSelect={handleSelect}
            />
        )
    }

    const ListInfiniteScrollMemo = useMemo(() => ListInfiniteScrollNoMemo(codigo_curso, filtro_descripcion_modulo, filtro_codigo_materia), [codigo_curso, filtro_codigo_materia, filtro_descripcion_modulo])

    const setFiltroDescripcionModuloDebounced = useCallback(debounce((val) => {
        setFiltroDescripcionModulo(val)
    }, 500),[])

    const handleChangeDescripcionModulo = e => {
        setDescripcionModulo(e.target.value)
        setFiltroDescripcionModuloDebounced(e.target.value)
    }

    return (
        <>
        {codigo_curso !== ''
        &&
        <Container>
            <Row>
                <Col className="mb-3">
                    <InputSelectMateria
                        id="codigo_materia"
                        name="codigo_materia"
                        as="select"
                        label="TODAS LAS MATERIAS"
                        value={filtro_codigo_materia}
                        onChange={e => {
                            setFiltroCodigoMateria(e.target.value)
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Col className="mb-1">
                    <Form.Control
                        id="descripción_modulo"
                        name="descripción_modulo"
                        type="text" 
                        placeholder="Escribe un nombre de módulo para buscar..."
                        value={descripcion_modulo}
                        onChange={handleChangeDescripcionModulo} 
                    />
                </Col>
            </Row>
            <Row>
                {ListInfiniteScrollMemo}
            </Row>
        </Container>
        }
        </>
    )
}

export default React.memo(ListSelectCursoModulos)
