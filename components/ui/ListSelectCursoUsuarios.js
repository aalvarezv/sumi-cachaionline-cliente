import React, {useEffect, useState, useMemo, useCallback } from 'react';
import {Container, Form, Row, Col} from 'react-bootstrap';
import { debounce } from 'lodash';
import {handleError} from '../../helpers'
import clienteAxios from '../../config/axios';
import ListInfiniteScroll from './ListInfiniteScroll';
import InputSelectRol from './InputSelectRol';
import { resolveHref } from 'next/dist/next-server/lib/router/router';

const ListSelectCursoUsuarios = ({codigo_curso, codigo_institucion}) => {
    
    //const [usuarios_inscritos_curso, setUsuariosInscritosCurso] = useState([]);
    const [nombre_usuario, setNombreUsuario] = useState('');
    const [filtro_nombre_usuario, setFiltroNombreUsuario] = useState('');
    const [filtro_codigo_rol, setFiltroCodigoRol] = useState('0');
    
    //traer todos los items seleccionados
    useEffect(() => {
        /*obtiene los usuarios del curso.
        const getUsuariosCurso = async () => {
            try{
                const resp = await clienteAxios.get(`/api/cursos-usuarios/listar-usuarios-curso/${codigo_curso}`);
                const arr_usuarios_curso = resp.data.usuarios_curso.map(usuario =>  usuario.rut_usuario);
                setUsuariosInscritosCurso(arr_usuarios_curso);
            }catch(e){
                handleError(e);
            }  
        }
        if(codigo_curso.trim() !== ''){
            getUsuariosCurso();
        }*/
        setNombreUsuario('');
        setFiltroNombreUsuario('');
        setFiltroCodigoRol('0');

    },[codigo_curso]);
    
    const handleSelect = async (rut, select) => {

        return new Promise(async (resolve, reject) => {

            let resp = null;
            try{
                if(select){
                    resp = await clienteAxios.post('/api/cursos-usuarios/agregar-usuario-curso',
                                                        {codigo_curso, rut_usuario: rut});
                }else{
                    resp = await clienteAxios.delete(`/api/cursos-usuarios/eliminar-usuario-curso/${codigo_curso}`,
                                                        {params: { rut_usuario: rut}});
                }
                resolve(true);
            }catch(e){
                //muestra el error.
                handleError(e);
                //retorna el error.
                reject(e);
            }

        });

        
    }

    const ListInfiniteScrollNoMemo = (institucion, curso, nombre_usuario, rol) => {

        return (
        <ListInfiniteScroll 
            url={'/api/usuarios/listar-inscritos-disponibles-curso'}
            model={"usuarios"}
            pk={"rut"}
            label={"nombre"}
            filters={{
                nombre: nombre_usuario,
                codigo_institucion: institucion,
                codigo_curso: curso,
                codigo_rol: rol
            }}
            //items_selected = {[]}
            //items_selected={usuarios_inscritos_curso}
            handleSelect={handleSelect}
        />
        );
    }

    const ListInfiniteScrollMemo = useMemo(() => {
        return ListInfiniteScrollNoMemo(codigo_institucion, codigo_curso, filtro_nombre_usuario, filtro_codigo_rol)
    }, [codigo_curso, filtro_codigo_rol, filtro_nombre_usuario]);

    const setFiltroNombreUsuarioDebounced = useCallback(debounce((val) => {
        setFiltroNombreUsuario(val);
    }, 500),[]);


    const handleChangeNombreUsuario = e => {
        setNombreUsuario(e.target.value);
        setFiltroNombreUsuarioDebounced(e.target.value);
    }

    return (
        <>
        {codigo_curso !== ''
        &&
        <Container>
            <Row>
                <Col className="mb-3">
                    <InputSelectRol
                        id="codigo_rol"
                        name="codigo_rol"
                        as="select"
                        label="TODOS LOS PERFILES"
                        value={filtro_codigo_rol}
                        onChange={e => {
                            setFiltroCodigoRol(e.target.value)
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Col className="mb-1">
                    <Form.Control
                        id="filtro_nombre_usuario"
                        name="filtro_nombre_usuario"
                        type="text" 
                        placeholder="Escribe un nombre de usuario para buscar..."
                        value={nombre_usuario}
                        onChange={handleChangeNombreUsuario} 
                    />
                </Col>
            </Row>
            <Row>
                {ListInfiniteScrollMemo}
            </Row>
        </Container>
        }
        </>
    );
}

export default ListSelectCursoUsuarios;
