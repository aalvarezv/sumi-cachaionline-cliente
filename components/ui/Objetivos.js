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
    console.log(objetivos)

  }, [codigoCurso, codigoUnidad])

  const cambiarEstadoObjetivo = async (codigoObjetivo, codigoEstado) => {
    console.log(codigoObjetivo)
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
        setObjetivos(prevObjetivos => reorder(prevObjetivos, source.index, destination.index))
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
        <div className="dropable-pendiente">
          <h4>Pendiente</h4>
          <Droppable droppableId="pendiente">
            {(droppableProvided) => (
            <ul 
              {...droppableProvided.droppableProps} 
              ref={droppableProvided.innerRef}
              className="task-content"
            >
              {objetivos.filter(obj => obj.codigo_estado === "4").map((obj, index) => {
                  
                  const {codigo, descripcion_objetivo} = obj

                  return(
                      <Draggable key={codigo} draggableId={codigo} index={index}>
                          {(draggableProvided) => (
                              <li 
                                  {...draggableProvided.draggableProps} 
                                  ref={draggableProvided.innerRef}
                                  {...draggableProvided.dragHandleProps}
                              >
                                <Alert
                                    variant="ligth"
                                    style={{cursor: 'pointer'}}
                                >
                                  {descripcion_objetivo}
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
              {objetivos.filter(obj => obj.codigo_estado === "5").map((obj, index) => {
                  
                  const {codigo, descripcion_objetivo} = obj

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
                                  {descripcion_objetivo}
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
              {objetivos.filter(obj => obj.codigo_estado === "6").map((obj, index) => {
                  
                  const {codigo, descripcion_objetivo} = obj

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
                                  {descripcion_objetivo}
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

export default Objetivos;
