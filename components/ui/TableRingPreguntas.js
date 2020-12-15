import React, {useState, useEffect} from 'react';
import { Table, Image, Button, Row, Col, Badge } from 'react-bootstrap';
import {handleError} from '../../helpers';
import clienteAxios from '../../config/axios';
import ModalImageView from './ModalImageView';
import AlertText from './AlertText';
import Paginador from './Paginador';
import FiltrosBusquedaPregunta from './FiltrosBusquedaPregunta';

const TableRingPreguntas = ({ring}) => {

    const [preguntas_ring, setPreguntasRing] = useState([]);
    const [show_imagen, setShowImagen] = useState(false);
    const [img_url, setImagenUrl] = useState('');

    /**** Variables para paginación *****/
    const [pagina_actual, setPaginaActual] = useState(1);
    const [resultados_por_pagina, setResultadosPorPagina] = useState(4);

    const indice_ultimo_resultado = pagina_actual * resultados_por_pagina;
    const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina;
    const resultados_pagina = preguntas_ring.slice(indice_primer_resultado, indice_ultimo_resultado);
    /*************************************/

    const listarPreguntasRing = async (ring, filtros) => {

        try{
            const resp = await clienteAxios.get('/api/preguntas/listar/ring', {
                    params: {
                        codigo_materia: filtros.codigo_materia,
                        codigo_unidad: filtros.codigo_unidad,
                        codigo_modulo: filtros.codigo_modulo,
                        codigo_modulo_contenido: filtros.codigo_modulo_contenido,
                        codigo_modulo_contenido_tema: filtros.codigo_modulo_contenido_tema,
                        codigo_modulo_contenido_tema_concepto: filtros.codigo_modulo_contenido_tema_concepto,
                        nombre_usuario_creador: filtros.nombre_usuario_creador,
                        codigo_ring: ring.codigo,
                        page: 1, 
                        limit: 1, 
                    }
            });
            //Si no hay preguntas, mostrar un mensajillo.
            setPreguntasRing(resp.data.preguntas);
        }catch(e){
            handleError(e);
        }
    }

    const handleShowImageView = img_url => {
        setShowImagen(true);
        setImagenUrl(img_url);
    } 

    const handleCloseImageView = () => {
        setShowImagen(false);
        setImagenUrl('');
    }

    const handleAgregarPreguntaRing = async codigo =>  {
        
        try{
            const resp = await clienteAxios.post('/api/ring-preguntas/crear',{
                codigo_ring: ring.codigo,
                codigo_pregunta: codigo,
            });

            const new_preguntas_ring = preguntas_ring.map(pregunta_ring => {  
              
                if(pregunta_ring.codigo === codigo){
                    return {
                        ...pregunta_ring,
                        ring_pregunta:  [resp.data.ring_pregunta],
                    }
                }else{
                    return pregunta_ring;
                }
            });
            setPreguntasRing(new_preguntas_ring);
            
            
        }catch(e){
            handleError(e);
        }
    }

    const handleQuitarPreguntaRing = async codigo =>  {
        try{
            await clienteAxios.delete(`/api/ring-preguntas/eliminar/${ring.codigo}/${codigo}`);
            const new_preguntas_ring = preguntas_ring.map(pregunta_ring => {  
              
                if(pregunta_ring.codigo === codigo){
                    return {
                        ...pregunta_ring,
                        ring_pregunta: [],
                    }
                }else{
                    return pregunta_ring;
                }
            });
            setPreguntasRing(new_preguntas_ring);

        }catch(e){
            handleError(e);
        }
    }

    const handleAgregarQuitarPreguntasRingMasivo = async resultados_pagina => {
        
        let ring_preguntas_add = [];
        resultados_pagina.forEach(resultado_pagina => {
            if(resultado_pagina.ring_pregunta.length === 0){
                ring_preguntas_add.push({
                    codigo_pregunta: resultado_pagina.codigo,
                    codigo_ring: ring.codigo
                })
            }
        });
       
        if(ring_preguntas_add.length > 0){
            
            try{
                const resp = await clienteAxios.post('/api/ring-preguntas/crear/masivo',{ring_preguntas_add});
                
                let new_preguntas_ring = [...preguntas_ring];

                for(let ring_pregunta of ring_preguntas_add){

                    new_preguntas_ring = new_preguntas_ring.map(pregunta_ring => {  
                        if(pregunta_ring.codigo === ring_pregunta.codigo_pregunta){
                            return {
                                ...pregunta_ring,
                                ring_pregunta: [ring_pregunta],
                            }
                        }else{
                            return pregunta_ring;
                        }
                    });
                }
                setPreguntasRing(new_preguntas_ring);
                
            }catch(e){
                handleError(e);
            }

        }else{
            
            try{

                let ring_preguntas_del = [];
                resultados_pagina.forEach(resultado_pagina => {
                    ring_preguntas_del.push({
                        codigo_pregunta: resultado_pagina.codigo,
                        codigo_ring: ring.codigo
                    });
                });

                await clienteAxios.delete('/api/ring-preguntas/eliminar/masivo',{
                    params: {
                        ring_preguntas_del
                    }
                });

                let new_preguntas_ring = [...preguntas_ring];

                for(let ring_pregunta of ring_preguntas_del){
                    new_preguntas_ring = new_preguntas_ring.map(pregunta_ring => {  
                        if(pregunta_ring.codigo === ring_pregunta.codigo_pregunta){
                            return {
                                ...pregunta_ring,
                                ring_pregunta: [],
                            }
                        }else{
                            return pregunta_ring;
                        }
                    });
                }

                setPreguntasRing(new_preguntas_ring);

            }catch(e){
                handleError(e);
            }

        }

        
    }

    const handleSetPaginaActual = numero_pagina => {
        setPaginaActual(numero_pagina)
    }

    const handleClickBuscar = filtros => {
        listarPreguntasRing(ring, filtros)
    }

    return ( 
        <>
        <ModalImageView
            img_url = {img_url}
            show={show_imagen}
            handleClose={handleCloseImageView}
        />
        <>
        <Row className="mb-2">
            <FiltrosBusquedaPregunta
                handleClickBuscar={handleClickBuscar}
            />
        </Row>
        {preguntas_ring.length > 0 &&
            <Row>
                <Col className="d-flex justify-content-end">
                    <Badge variant="dark">
                    Total preguntas encontradas: {preguntas_ring.length} 
                    </Badge>
                </Col>
            </Row>
        }
        <Row>
            <Col className={`d-flex  ${preguntas_ring.length === 0 ? 'justify-content-center mt-5 mb-5' : 'flex-column align-items-center'}`}>
            {resultados_pagina.length === 0
            ?
                <AlertText  
                    text="No se encontraron resultados"
                />
            :
                <>
                <Table striped bordered hover variant="light" responsive>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Multimedia</th>
                        <th>Creador</th>
                        <th>Creada</th>
                        <th className="d-flex justify-content-center">
                            <Button
                                variant="info"
                                size="sm"
                                onClick={() => handleAgregarQuitarPreguntasRingMasivo(resultados_pagina)}
                            >
                                Todas
                            </Button>
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultados_pagina.map((pregunta_ring, index) => {
                                
                            const { codigo, imagen, audio, video, usuario, 
                                    createdAt, updatedAt, ring_pregunta} = pregunta_ring;
                                return (
                                <tr
                                    key={codigo}
                                >
                                    <td>{index+1}</td>
                                    <td>
                                        {imagen.trim() !== '' &&
                                            <Image 
                                                src={imagen} 
                                                style={{width: 150, cursor: 'pointer'}} 
                                                onClick={() => handleShowImageView(imagen)}
                                                thumbnail
                                            />
                                        }
                                        {audio.trim() !== '' &&
                                            <audio 
                                                style={{width: 150, cursor: 'pointer'}}
                                                controls
                                            >
                                                <source src={audio.trim()} />
                                            </audio>
                                        }
                                        {video.trim() !== '' &&
                                            <video 
                                                style={{width: 150, cursor: 'pointer'}}
                                                controls
                                            >
                                                <source src={video.trim()} />
                                            </video>
                                        }
                                    </td>
                                    <td>{usuario.nombre}</td>
                                    <td><small>{createdAt}</small></td>
                                    <td className="d-flex justify-content-center">
                                    {ring_pregunta && ring_pregunta.length === 0
                                    ?
                                        <Button
                                            variant={"outline-info"}
                                            size="sm"
                                            onClick={() => handleAgregarPreguntaRing(codigo)}
                                            >
                                            &#10003;
                                        </Button>
                                    :
                                        <Button
                                            variant={"info"}
                                            size="sm"
                                            onClick={() => handleQuitarPreguntaRing(codigo)}
                                        >
                                            &#10003;
                                        </Button>
                                    }
                                    </td>
                                </tr>
                                )
                        })}
                    </tbody>
                </Table>
                <Paginador
                    resultados_por_pagina = {resultados_por_pagina}
                    total_resultados = {preguntas_ring.length}
                    handleSetPaginaActual = {handleSetPaginaActual}
                />
                </>
            }
            </Col>
        </Row>
        </>
        </>
     );
}
 
export default TableRingPreguntas;