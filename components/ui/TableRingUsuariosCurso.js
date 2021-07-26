import React, {useState, useEffect} from 'react'
import { toast } from 'react-toastify'
import {Table, Button, Row, Col} from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'
import AlertText from './AlertText'
import Paginador from './Paginador'

const TableRingUsuariosCurso = ({ring, codigo_institucion, codigo_curso}) => {
    

    const [usuarios_ring_curso, setUsuariosRingCurso] = useState([])
    const [textAlert, setTextAlert] = useState('')

    /**** Variables para paginación *****/
    const [pagina_actual, setPaginaActual] = useState(1)
    const [resultados_por_pagina, setResultadosPorPagina] = useState(10)

    const indice_ultimo_resultado = pagina_actual * resultados_por_pagina
    const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina
    const resultados_pagina = usuarios_ring_curso.slice(indice_primer_resultado, indice_ultimo_resultado)
    /*************************************/

    const listarUsuariosRingCurso = async () => {
        try{
            const resp = await clienteAxios.get('/api/cursos/listar/usuarios-ring',{
                params: {
                    codigo_ring: ring.codigo,
                    codigo_curso,
                }
            })
            setUsuariosRingCurso(resp.data.usuarios_ring_curso)
            if(resp.data.usuarios_ring_curso.length > 0){
                setTextAlert('')
            }else{
                setTextAlert('No se encontraron resultados')
            }
        }catch(e){
            handleError(e)
        }
    }

    useEffect(() => {
        listarUsuariosRingCurso()
    }, [codigo_curso])


    const handleAgregarUsuarioRing = async rut =>  {
        
        try{
            const resp = await clienteAxios.post('/api/ring-usuarios/crear',{
                codigo_ring: ring.codigo,
                rut_usuario: rut,
                codigo_institucion: codigo_institucion,
                codigo_curso: codigo_curso,
            })

            const new_usuarios_ring_curso = usuarios_ring_curso.map(usuario_ring_curso => {  
                const {usuario} = usuario_ring_curso
                if(usuario.rut === rut){
                    return {
                        ...usuario_ring_curso,
                        usuario: {
                            ...usuario_ring_curso.usuario,
                            ring_usuarios: [resp.data.ring_usuario],
                        }
                    }
                }else{
                    return usuario_ring_curso
                }
            })
            setUsuariosRingCurso(new_usuarios_ring_curso)
            toast.success('Usuario agregado al ring.', {containerId: 'sys_msg'})
        }catch(e){
            handleError(e)
        }
    }

    const handleQuitarUsuarioRing = async rut =>  {
        try{
            await clienteAxios.delete(`/api/ring-usuarios/eliminar/${ring.codigo}/${rut}`)
            const new_usuarios_ring_curso = usuarios_ring_curso.map(usuario_ring_curso => {  
                const {usuario} = usuario_ring_curso
                if(usuario.rut === rut){
                    return {
                        ...usuario_ring_curso,
                        usuario: {
                            ...usuario_ring_curso.usuario,
                            ring_usuarios: [],
                        }
                    }
                }else{
                    return usuario_ring_curso
                }
            })
            setUsuariosRingCurso(new_usuarios_ring_curso)
            toast.success('Usuario quitado del ring.', {containerId: 'sys_msg'})
        }catch(e){
            handleError(e)
        }
    }

    const handleAgregarQuitarUsuariosRingMasivo = async resultados_pagina =>{
        
        let ring_usuarios_add = []
        resultados_pagina.forEach(resultado_pagina => {
            if(resultado_pagina.usuario.ring_usuarios.length === 0){
                ring_usuarios_add.push({
                    rut_usuario: resultado_pagina.rut_usuario,
                    codigo_ring: ring.codigo,
                    codigo_institucion: codigo_institucion,
                    codigo_curso: codigo_curso,
                })
            }
        })
       
        if(ring_usuarios_add.length > 0){

            try{

                const resp = await clienteAxios.post('/api/ring-usuarios/crear/masivo',{ring_usuarios_add})
                
                let new_usuarios_ring = [...usuarios_ring_curso]

                for(let ring_usuario of ring_usuarios_add){

                    new_usuarios_ring = new_usuarios_ring.map(usuario_ring => {  
                        if(usuario_ring.rut_usuario === ring_usuario.rut_usuario){
                            return {
                                ...usuario_ring,
                                usuario:{
                                    ...usuario_ring.usuario,
                                    ring_usuarios: [ring_usuario],
                                }
                            }
                        }else{
                            return usuario_ring
                        }
                    })
                }
                setUsuariosRingCurso(new_usuarios_ring)
                
            }catch(e){
                handleError(e)
            }

        }else{
           
            try{

                let ring_usuarios_del = []
                resultados_pagina.forEach(resultado_pagina => {
                    ring_usuarios_del.push({
                        rut_usuario: resultado_pagina.rut_usuario,
                        codigo_ring: ring.codigo
                    })
                })

                await clienteAxios.delete('/api/ring-usuarios/eliminar/masivo',{
                    params: {
                        ring_usuarios_del
                    }
                })

                let new_usuarios_ring = [...usuarios_ring_curso]

                for(let ring_usuario of ring_usuarios_del){

                    new_usuarios_ring = new_usuarios_ring.map(usuario_ring => {  
                        if(usuario_ring.rut_usuario === ring_usuario.rut_usuario){
                            
                            return {
                                ...usuario_ring,
                                usuario:{
                                    ...usuario_ring.usuario,
                                    ring_usuarios: [],
                                }
                            }
                        }else{
                            return usuario_ring
                        }
                    })
                }
    
                setUsuariosRingCurso(new_usuarios_ring)

            }catch(e){
                handleError(e)
            }
        }
    }

    const handleSetPaginaActual = numero_pagina => {
        setPaginaActual(numero_pagina)
    }

    return (
        <Row className={`px-3 mt-4 ${resultados_pagina.length === 0 ? 'my-5' : 'my-3'}`}>
            <Col> 
            {resultados_pagina.length === 0
            ?
                <AlertText  
                    text={textAlert}
                />
            : 
                <>
                <Row>
                    <Col className="d-flex justify-content-end p-0">
                        <Paginador
                            resultados_por_pagina = {resultados_por_pagina}
                            total_resultados = {usuarios_ring_curso.length}
                            handleSetPaginaActual = {handleSetPaginaActual}
                            pagina_activa={pagina_actual}
                        />
                    </Col>
                </Row>
                <Row>
                <Table striped bordered hover variant="light" responsive>
                    <thead>
                        <tr>
                        <th className="d-flex justify-content-center">
                            <Button
                                variant="info"
                                size="sm"
                                onClick={() => handleAgregarQuitarUsuariosRingMasivo(resultados_pagina)}
                            >
                                Todos
                            </Button>
                        </th>
                        <th>#</th>
                        <th>RUT</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultados_pagina.map((resultado_pagina, index) => {
                        
                            const { usuario } = resultado_pagina
                            const {rut, nombre, email, ring_usuarios} = usuario
                            return(
                                <tr key={rut}>
                                    <td className="d-flex justify-content-center">
                                        {ring_usuarios && ring_usuarios.length === 0
                                        ?
                                        <Button 
                                            variant="outline-info"
                                            size="sm"
                                            onClick={e => {
                                            handleAgregarUsuarioRing(rut)
                                            } 
                                            }
                                        >
                                            &#10003;
                                        </Button>
                                        :
                                        <Button 
                                            variant="info"
                                            size="sm"
                                            onClick={e => {
                                                handleQuitarUsuarioRing(rut)
                                            } 
                                            }
                                        >
                                            &#10003;
                                        </Button>
                                        }
                                    </td> 
                                    <td>{index+1}</td>
                                    <td>{rut}</td>
                                    <td>{nombre}</td>
                                    <td>{email}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                </Row>
                </>
            }
            </Col>
        </Row>
    )
}

export default TableRingUsuariosCurso
