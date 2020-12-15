import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/layout/Layout';
import AuthContext from '../context/auth/AuthContext';
import { Row, Container, Button } from 'react-bootstrap';
import { handleError } from '../helpers';
import clienteAxios from '../config/axios';
import Privado from '../components/layout/Privado';
import CardRingsUsuario from '../components/ui/CardRingsUsuario';
import Pregunta from '../components/ui/Pregunta';

const Test = () =>{

  const { autenticado } = useContext(AuthContext);
  const [codigo_ring, setCodigoRing] = useState('');
  const [preguntas_ring, setPreguntasRing] = useState([]);
  const [numero_pregunta_actual, setNumeroPreguntaActual] = useState(0);
  const [codigo_pregunta, setCodigoPregunta] = useState(null);
  const [respuestas, setRespuestas] = useState([]);

  
  const handleObtenerPreguntasRing = async codigo_ring  => {
    try {
        setCodigoRing(codigo_ring);
        const resp = await clienteAxios.get(`/api/ring-preguntas/listar/ring-preguntas/${codigo_ring}`);
        setPreguntasRing(resp.data.ring_preguntas);
        if(resp.data.ring_preguntas.length > 0){
          setCodigoPregunta(resp.data.ring_preguntas[numero_pregunta_actual].codigo_pregunta);
        }

    } catch (e) {
        handleError(e);
    }

  }

  const handlePreguntaSiguiente = () =>{
    if(numero_pregunta_actual < preguntas_ring.length - 1){
        setCodigoPregunta(preguntas_ring[numero_pregunta_actual + 1].codigo_pregunta);
        setNumeroPreguntaActual(numero_pregunta_actual + 1);
    }
  }

  const handlePreguntaAnterior = () => {
    if(numero_pregunta_actual > 0){
      setCodigoPregunta(preguntas_ring[numero_pregunta_actual - 1].codigo_pregunta);
      setNumeroPreguntaActual(numero_pregunta_actual - 1);
    }
  }

  const handleSetRespuesta = (codigo_pregunta, alternativa_select, alternativa_correcta, omitida) => {
   
      if(respuestas.filter(respuesta => respuesta.codigo_pregunta === codigo_pregunta).length === 0){
        setRespuestas([
          ...respuestas,
          {
            numero_pregunta_actual,
            codigo_pregunta,
            codigo_ring,
            alternativa_select,
            alternativa_correcta,
            omitida,
          }
        ]);
      }else{

        let new_respuestas = respuestas.map(respuesta => respuesta.codigo_pregunta === codigo_pregunta ? 
        {
          numero_pregunta_actual,
          codigo_pregunta,
          codigo_ring,
          alternativa_select,
          alternativa_correcta,
          omitida,
        } 
        : respuesta);
        setRespuestas(new_respuestas);

      }

      if(omitida){
        if(numero_pregunta_actual < preguntas_ring.length - 1){
          setCodigoPregunta(preguntas_ring[numero_pregunta_actual + 1].codigo_pregunta);
          setNumeroPreguntaActual(numero_pregunta_actual + 1);
        }else{
          console.log('ESTA EN EL FINAL');
        }
        
      }
  }

  return (
    
     <>
        {!codigo_pregunta
        ?
        <Layout>
          <Privado>
            <Container>
              <Row>
                <CardRingsUsuario 
                  handleObtenerPreguntasRing = {handleObtenerPreguntasRing}
                />
              </Row>
            </Container>
          </Privado>
        </Layout>
        :
        <Container fluid className="mt-3">
          <Row>
            <Pregunta
              codigo_pregunta={codigo_pregunta}
              respuestas={respuestas}
              total_preguntas={preguntas_ring.length}
              numero_pregunta_actual={numero_pregunta_actual}
              handlePreguntaAnterior={handlePreguntaAnterior}
              handlePreguntaSiguiente={handlePreguntaSiguiente}
              handleSetRespuesta = {handleSetRespuesta}
            />
        
          </Row>
         
        </Container>
        }
      </>
  
  );
}

export default Test;