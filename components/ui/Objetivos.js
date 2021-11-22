import { useContext, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AuthContext from '../../context/auth/AuthContext';
import  clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'
import { Alert, Col, Row } from 'react-bootstrap';
import ObjetivosInicioTermino from './ObjetivosInicioTermino';


const reorder = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};


function Objetivos(props) {

  const { usuario } = useContext(AuthContext)
  const [objetivos, setObjetivos] = useState([])
  const { codigoUnidad, codigoCurso } = props

  useEffect(() => {

    const listarObjetivosUnidadMineduc = async () => {
        try{
            const resp = await clienteAxios.get('/api/mineduc-tablero-objetivo/listar-objetivos-unidad-mineduc',{
                params:{
                    codigo_unidad_mineduc: codigoUnidad,
                    rut_usuario: usuario.rut,
                    codigo_curso: codigoCurso,
                }
            })
            setObjetivos(resp.data.unidadMineducTableroObjetivos)
        }catch(e){
            handleError(e)
        }
    }
    listarObjetivosUnidadMineduc()

  }, [codigoCurso, codigoUnidad])

  const cambiarEstadoObjetivo = async (codigoObjetivo, codigoEstado) => {

    try{
        await clienteAxios.put('/api/mineduc-tablero-objetivo/cambiar-estado',{
                codigo_objetivo: codigoObjetivo,
                codigo_estado: codigoEstado
        })

    }catch(e){
        handleError(e)
    }

  }

  return (
    <DragDropContext onDragEnd={(result) => {
      const {source, destination, draggableId} = result
     
      if(!destination){
        return
      }

      //Si lo estoy moviendo en la misma columna y en la misma posicion entonces no hago nada
      if(source.index === destination.index
        && source.droppableId === destination.droppableId
      ){
        return
      }
      //Si lo estoy moviendo en la misma columna y distinta posicion entonces lo reordeno.
      if(source.index !== destination.index
        && source.droppableId === destination.droppableId
      ){
        //setObjetivos(prevObjetivos => reorder(prevObjetivos, source.index, destination.index))
        return
      }      
      //Si lo muevo a otra columna, obtengo la tarea de origen y la quito de la columna de origen
      let newObjetivos = []

      switch (destination.droppableId) {
        case "pendiente":
          newObjetivos = objetivos.map(objetivo => {
             if(objetivo.codigo === draggableId){
                cambiarEstadoObjetivo(objetivo.codigo, "4")
                return {
                     ...objetivo,
                     codigo_estado: "4"
                }
             }else {
                return objetivo
             }
          })
          setObjetivos(newObjetivos)
          break;
        case "enProceso":
          newObjetivos = objetivos.map(objetivo => {
              if(objetivo.codigo === draggableId){
                  cambiarEstadoObjetivo(objetivo.codigo, "5")
                  return {
                      ...objetivo,
                      codigo_estado: "5"
                  }
              }else {
                  return objetivo
              }
           })
           setObjetivos(newObjetivos)
          break;
        case "finalizado":
          newObjetivos = objetivos.map(objetivo => {
              if(objetivo.codigo === draggableId){
                  cambiarEstadoObjetivo(objetivo.codigo, "6")
                  return {
                      ...objetivo,
                      codigo_estado: "6"
                  }
              }else {
                  return objetivo
              }
          })
          setObjetivos(newObjetivos)
          break;
      }
      
    }}
    >
       
      <div className="app">
        <div className="droppable-pendiente">
          <h4 className="mb-4">Pendiente</h4>
          <Droppable droppableId="pendiente">
            {(droppableProvided) => (
            <ul 
              {...droppableProvided.droppableProps} 
              ref={droppableProvided.innerRef}
              className="droppable-ul"
            >
              {objetivos.filter(obj => obj.codigo_estado === "4").length > 0
              ?
                objetivos.filter(obj => obj.codigo_estado === "4").map((obj, index) => {
                  
                  const {
                    codigo, 
                    descripcion_objetivo, 
                    numero_objetivo, 
                    fecha_inicio, 
                    fecha_termino
                  } = obj
                  
                  return(
                      <Draggable 
                        key={codigo} 
                        draggableId={codigo} 
                        index={index}
                      >
                          {(draggableProvided) => (
                              <li 
                                  {...draggableProvided.draggableProps} 
                                  ref={draggableProvided.innerRef}
                                  {...draggableProvided.dragHandleProps}
                              >
                                <Row>
                                  <Col xs={1} className="px-0 text-right">
                                    <h4 className="text-muted">#{numero_objetivo}</h4>
                                  </Col>
                                  <Col>
                                    <ObjetivosInicioTermino
                                        fechaInicio={fecha_inicio}
                                        fechaTermino={fecha_termino}
                                        codigoObjetivo={codigo}
                                        estadoObjetivo={1}
                                        setObjetivos={setObjetivos}
                                    />
                                    <Alert
                                        variant="light"
                                        style={{cursor: 'pointer'}}
                                    >
                                        {descripcion_objetivo}
                                    </Alert>
                                  </Col>
                                </Row> 
                              </li>
                          )}
                      </Draggable>
                  )
              })
              :
                <h5 className="text-muted text-center">Arrastre y suelte un objetivo</h5>
              }
              {droppableProvided.placeholder}
            </ul>
            )}
          </Droppable>
        </div>

        <div className="droppable-en-proceso">
          <h4 className="mb-4">En Proceso</h4>
          <Droppable droppableId="enProceso">
            {(droppableProvided) => (
            <ul 
              {...droppableProvided.droppableProps} 
              ref={droppableProvided.innerRef}
              className="droppable-ul"
            >
              {objetivos.filter(obj => obj.codigo_estado === "5").length > 0
              ?
                objetivos.filter(obj => obj.codigo_estado === "5").map((obj, index) => {
                  
                  const {
                    codigo, 
                    descripcion_objetivo, 
                    numero_objetivo,
                    fecha_inicio,
                    fecha_termino } = obj

                  return(
                      <Draggable 
                        key={codigo} 
                        draggableId={codigo} 
                        index={index}
                      >
                          {(draggableProvided) => (
                              <li 
                                  {...draggableProvided.draggableProps} 
                                  ref={draggableProvided.innerRef}
                                  {...draggableProvided.dragHandleProps}
                              >
                                <Row>
                                  <Col xs={1} className="px-0 text-right">
                                    <h4 className="text-muted">#{numero_objetivo}</h4>
                                  </Col>
                                  <Col>
                                      <ObjetivosInicioTermino
                                          fechaInicio={fecha_inicio}
                                          fechaTermino={fecha_termino}
                                          codigoObjetivo={codigo}
                                          estadoObjetivo={2}
                                          setObjetivos={setObjetivos}
                                      />
                                      <Alert
                                          variant="light"
                                          style={{cursor: 'pointer'}}
                                      >
                                          {descripcion_objetivo}
                                      </Alert>
                                  </Col>
                                </Row> 
                              </li>
                          )}
                      </Draggable>
                  )
                })
          
              :
                <h5 className="text-muted text-center">Arrastre y suelte un objetivo</h5>
              }
              {droppableProvided.placeholder}
            </ul>
            )}
          </Droppable>
        </div>

        <div className="droppable-finalizado">
          <h4 className="mb-4">Finalizado</h4>
          <Droppable droppableId="finalizado">
            {(droppableProvided) => (
            <ul 
              {...droppableProvided.droppableProps} 
              ref={droppableProvided.innerRef}
              className="droppable-ul"
            >
              {objetivos.filter(obj => obj.codigo_estado === "6").length > 0
              ?

                objetivos.filter(obj => obj.codigo_estado === "6").map((obj, index) => {
                  
                  const {
                    codigo, 
                    descripcion_objetivo, 
                    numero_objetivo, 
                    fecha_inicio, 
                    fecha_termino} = obj

                  return(
                      <Draggable key={codigo} draggableId={codigo} index={index}>
                          {(draggableProvided) => (
                              <li 
                                  {...draggableProvided.draggableProps} 
                                  ref={draggableProvided.innerRef}
                                  {...draggableProvided.dragHandleProps}
                              >
                                <Row>
                                    <Col xs={1} className="px-0 text-right">
                                      <h4 className="text-muted">#{numero_objetivo}</h4>
                                    </Col>
                                    <Col>
                                        <ObjetivosInicioTermino
                                            fechaInicio={fecha_inicio}
                                            fechaTermino={fecha_termino}
                                            codigoObjetivo={codigo}
                                            estadoObjetivo={3}
                                            setObjetivos={setObjetivos}
                                        />
                                        <Alert
                                            variant="light"
                                            style={{cursor: 'pointer'}}
                                        >
                                            {descripcion_objetivo}
                                        </Alert>
                                    </Col>
                                </Row> 
                              </li>
                          )}
                      </Draggable>
                  )
                })

                :

                <h5 className="text-muted text-center">Arrastre y suelte un objetivo</h5>
              
              }
              {droppableProvided.placeholder}
            </ul>
            )}
          </Droppable>
        </div>
      </div> 
    </DragDropContext>
  );
}

export default Objetivos;
