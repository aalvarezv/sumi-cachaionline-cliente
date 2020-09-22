import React, {useEffect, useState } from 'react';
import ListInfiniteScroll from './ListInfiniteScroll';
import {handleError} from '../../helpers'
import clienteAxios from '../../config/axios';

const ListSelectCursoModulos = ({codigo_curso}) => {

    const [modulos_curso, setModulosCurso] = useState([]);

    //traer todos los items seleccionados
    useEffect(() => {

        //obtiene los modulos del curso.
        const getModulosCurso = async () => {
            try{
                const resp = await clienteAxios.get(`/api/cursos-modulos/listar-modulos-curso/${codigo_curso}`);
                const arr_modulos_curso = resp.data.modulos_curso.map(modulo =>  modulo.codigo_modulo);
                setModulosCurso(arr_modulos_curso);
            }catch(e){
                handleError(e);
            }  
        }

        if(codigo_curso){
            getModulosCurso();
        }

    },[codigo_curso])

    const handleSelect = async (codigo, select) => {
        let resp = null;
        try{
            if(select){
                resp = await clienteAxios.post('/api/cursos-modulos/agregar-modulo-curso',
                                                     {codigo_curso, codigo_modulo: codigo});
            }else{
                resp = await clienteAxios.delete(`/api/cursos-modulos/eliminar-modulo-curso/${codigo_curso}`,
                                                     {params: { codigo_modulo: codigo}});
            }
        }catch(e){
            handleError(e)
        }
    }

    return (
        <ListInfiniteScroll 
            url={'/api/modulos/listar'}
            model={"modulos"}
            pk={"codigo"}
            label={"descripcion"}
            items_selected={modulos_curso}
            handleSelect={handleSelect}
        />
    )
}

export default ListSelectCursoModulos
