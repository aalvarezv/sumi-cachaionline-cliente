import { useContext, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AuthContext from '../../context/auth/AuthContext';
import  clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'
import { Alert } from 'react-bootstrap';


const reorder = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function Habilidades(props) {

 
  const { usuario } = useContext(AuthContext)
  const [habilidades, setHabilidades] = useState([])
  const { codigoUnidad, codigoCurso } = props

  useEffect(() => {
    const listarHabilidadesUnidadMineduc = async () => {
        try{
            const resp = await clienteAxios.get('/api/mineduc-tablero-habilidad/listar-habilidades-unidad-mineduc',{
                params:{
                    codigo_unidad_mineduc: codigoUnidad,
                    rut_usuario: usuario.rut,
                    codigo_curso: codigoCurso,
                }
            })
            setHabilidades(resp.data.unidadMineducTableroHabilidades)
        }catch(e){
            handleError(e)
        }
    }
    listarHabilidadesUnidadMineduc()
    console.log(habilidades)

  }, [codigoCurso, codigoUnidad])

  const cambiarEstadoHabilidad = async (codigoHabilidad, codigoEstado) => {
    
    try{

        await clienteAxios.put('/api/mineduc-tablero-habilidad/cambiar-estado',{
                codigo_habilidad: codigoHabilidad,
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
        setHabilidades(prevHabilidades => reorder(prevHabilidades, source.index, destination.index))
        return
      }      
      //Si lo muevo a otra columna, obtengo la tarea de origen y la quito de la columna de origen
      let newHabilidades = []

      switch (destination.droppableId) {
          case "pendiente":
            newHabilidades = habilidades.map(habilidad => {
               if(habilidad.codigo === draggableId){
                   cambiarEstadoHabilidad(habilidad.codigo, "4")
                   return {
                       ...habilidad,
                       codigo_estado: "4"
                   }
               }else {
                    return habilidad
               }
            })
            setHabilidades(newHabilidades)
            break;
          case "enProceso":
            newHabilidades = habilidades.map(habilidad => {
                if(habilidad.codigo === draggableId){
                    cambiarEstadoHabilidad(habilidad.codigo, "5")
                    return {
                        ...habilidad,
                        codigo_estado: "5"
                    }
                }else {
                    return habilidad
                }
             })
             setHabilidades(newHabilidades)
            break;
          case "finalizado":
            newHabilidades = habilidades.map(habilidad => {
                if(habilidad.codigo === draggableId){
                    cambiarEstadoHabilidad(habilidad.codigo, "6")
                    return {
                        ...habilidad,
                        codigo_estado: "6"
                    }
                }else {
                    return habilidad
                }
            })
            setHabilidades(newHabilidades)
            break;
      }

    }}
    >  
      <div className="app">
        <div className="dropable-pendiente">
          <h4>Pendiente</h4>
          <Droppable droppableId="pendiente">
            {(droppableProvided) => (
            <ul 
              {...droppableProvided.droppableProps} 
              ref={droppableProvided.innerRef}
              className="task-content"
            >
              {habilidades.filter(hab => hab.codigo_estado === "4").map((hab, index) => {
                  
                  const {codigo, descripcion_habilidad} = hab

                  return(
                      <Draggable key={codigo} draggableId={codigo} index={index}>
                          {(draggableProvided) => (
                              <li 
                                  {...draggableProvided.draggableProps} 
                                  ref={draggableProvided.innerRef}
                                  {...draggableProvided.dragHandleProps}
                              >
                                  <Alert
                                      variant="light"
                                      style={{cursor: 'pointer'}}
                                  >
                                      {descripcion_habilidad}
                                  </Alert>
                              </li>
                          )}
                      </Draggable>
                  )
              })}
              {droppableProvided.placeholder}
            </ul>
            )}
          </Droppable>
        </div>
        <div className="dropable-en-proceso">
          <h4>En Proceso</h4>
          <Droppable droppableId="enProceso">
            {(droppableProvided) => (
            <ul 
              {...droppableProvided.droppableProps} 
              ref={droppableProvided.innerRef}
              className="task-content"
            >
              {habilidades.filter(hab => hab.codigo_estado === "5").map((hab, index) => {
                  
                  const {codigo, descripcion_habilidad} = hab

                  return(
                      <Draggable key={codigo} draggableId={codigo} index={index}>
                          {(draggableProvided) => (
                              <li 
                                  {...draggableProvided.draggableProps} 
                                  ref={draggableProvided.innerRef}
                                  {...draggableProvided.dragHandleProps}
                              >   
                                  <Alert
                                      variant="light"
                                      style={{cursor: 'pointer'}}
                                  >
                                      {descripcion_habilidad}
                                  </Alert>
                              </li>
                          )}
                      </Draggable>
                  )
              })}
              {droppableProvided.placeholder}
            </ul>
            )}
          </Droppable>
        </div>

        <div className="dropable-finalizado">
          <h4>Finalizado</h4>
          <Droppable droppableId="finalizado">
            {(droppableProvided) => (
            <ul 
              {...droppableProvided.droppableProps} 
              ref={droppableProvided.innerRef}
              className="task-content"
            >
              {habilidades.filter(hab => hab.codigo_estado === "6").map((hab, index) => {
                  
                  const {codigo, descripcion_habilidad} = hab

                  return(
                      <Draggable key={codigo} draggableId={codigo} index={index}>
                          {(draggableProvided) => (
                              <li 
                                  {...draggableProvided.draggableProps} 
                                  ref={draggableProvided.innerRef}
                                  {...draggableProvided.dragHandleProps}
                              >
                                  <Alert
                                      variant="light"
                                      style={{cursor: 'pointer'}}
                                  >
                                      {descripcion_habilidad}
                                  </Alert>
                              </li>
                          )}
                      </Draggable>
                  )
              })}
              {droppableProvided.placeholder}
            </ul>
            )}
          </Droppable>
        </div>
      </div> 
    </DragDropContext>
  );
}

export default Habilidades;
