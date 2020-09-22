import React, {useEffect, useState } from 'react';
import ListInfiniteScroll from './ListInfiniteScroll';
import {handleError} from '../../helpers'
import clienteAxios from '../../config/axios';

const ListSelectCursoUsuarios = ({codigo_curso}) => {

    const [usuarios_curso, setUsuariosCurso] = useState([]);

    //traer todos los items seleccionados
    useEffect(() => {

        //obtiene los modulos del curso.
        const getUsuariosCurso = async () => {
            try{
                const resp = await clienteAxios.get(`/api/cursos-usuarios/listar-usuarios-curso/${codigo_curso}`);
                const arr_usuarios_curso = resp.data.usuarios_curso.map(usuario =>  usuario.rut_usuario);
                setUsuariosCurso(arr_usuarios_curso);
            }catch(e){
                handleError(e);
            }  
        }
        if(codigo_curso){
            getUsuariosCurso();
        }

    },[codigo_curso])

    const handleSelect = async (rut, select) => {

        let resp = null;
        try{
            if(select){
                resp = await clienteAxios.post('/api/cursos-usuarios/agregar-usuario-curso',
                                                     {codigo_curso, rut_usuario: rut});
            }else{
                resp = await clienteAxios.delete(`/api/cursos-usuarios/eliminar-usuario-curso/${codigo_curso}`,
                                                     {params: { rut_usuario: rut}});
            }
        }catch(e){
            handleError(e)
        }
    }

    return (
        <ListInfiniteScroll 
            url={'/api/usuarios/listar'}
            model={"usuarios"}
            pk={"rut"}
            label={"nombre"}
            items_selected={usuarios_curso}
            handleSelect={handleSelect}
        />
    )
}

export default ListSelectCursoUsuarios
