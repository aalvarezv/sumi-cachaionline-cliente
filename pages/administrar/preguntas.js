import React, { useContext, useState, forwardRef } from 'react';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import AuthContext from '../../context/auth/AuthContext';
import Layout from '../../components/layout/Layout';
import Privado from '../../components/layout/Privado';
import InputSelectMateria from '../../components/ui/InputSelectMateria';
import InputSelectUnidadesMateria from '../../components/ui/InputSelectUnidadesMateria';
import InputSelectModulosUnidad from '../../components/ui/InputSelectModulosUnidad';
import InputSelectModulosContenido from '../../components/ui/InputSelectModulosContenido';
import InputSelectModulosContenidoTema from '../../components/ui/InputSelectModulosContenidoTema';
import InputSelectModulosContenidoTemaConcepto from '../../components/ui/InputSelectModulosContenidoTemaConcepto';
import PreguntaForm from '../../components/forms/PreguntaForm';
import TablePregunta from '../../components/ui/TablePregunta';
import AlertText from '../../components/ui/AlertText';
import { handleError } from '../../helpers';
import clienteAxios from '../../config/axios';

const Cursos = () => {

   const { autenticado } = useContext(AuthContext);

    const [filtros, setFiltros] = useState({
       codigo_materia: '0',
       codigo_unidad: '0',
       codigo_modulo: '0',
       codigo_modulo_contenido: '0',
       codigo_modulo_contenido_tema: '0',
       codigo_modulo_contenido_tema_concepto: '0',
       fecha_desde: new Date(),
       fecha_hasta: new Date(),
       nombre_usuario_creador: '',
    });
    const [preguntas, setPreguntas] = useState([]);
    const [crear_pregunta, setCrearPregunta] = useState(false);
    const [modificar_pregunta, setModificarPregunta] = useState(false);
    //const [codigo_pregunta_modificar, setCodigoPreguntaModificar] = useState('');
    const [pregunta_modificar, setPreguntaModificar] = useState(null);
   
    const {codigo_materia, codigo_unidad, codigo_modulo, codigo_modulo_contenido,
           codigo_modulo_contenido_tema, codigo_modulo_contenido_tema_concepto,
           fecha_desde, fecha_hasta, nombre_usuario_creador} = filtros;

   const ref_custom_date_desde = React.createRef();
   const ref_custom_date_hasta = React.createRef();

   const CustomDateInput = forwardRef(({ value, onClick, label }, ref ) => (
      <Form.Group>
      <Form.Label><small>{label}</small></Form.Label>
            <Form.Control
               size="sm"
               onClick={onClick}
               onChange={onClick}
               value={value}
               ref={ref}
         />
      </Form.Group>
   ));
   
   const listarPreguntas = async () => {
      try{

         const resp = await clienteAxios.get('/api/preguntas/listar', {
               params: {
                  codigo_materia,
                  codigo_unidad,
                  codigo_modulo,
                  codigo_modulo_contenido,
                  codigo_modulo_contenido_tema,
                  codigo_modulo_contenido_tema_concepto,
                  fecha_desde,
                  fecha_hasta,
                  nombre_usuario_creador
               }
         });
         console.log(resp.data);
         //Si no hay preguntas, mostrar un mensajillo.
         setPreguntas(resp.data.preguntas);

      }catch(e){
         handleError(e);
      }
   }

   const handleClickBuscar = () => {
      listarPreguntas();
   }

   const handleEliminaPregunta = async codigo => {

      try{
          //Elimina de la base de datos.
          await clienteAxios.delete(`/api/preguntas/eliminar/${codigo}`);
          //Si no hay error, entonces quita del state la pregunta eliminada.
          const new_preguntas = preguntas.filter(pregunta => pregunta.codigo !== codigo);
          setPreguntas(new_preguntas);

          toast.success('PREGUNTA ELIMINADA', {containerId: 'sys_msg'});

      }catch(e){
          handleError(e);
      }

   }

   const handleModificaPregunta = async codigo => {
      
      const resp = await clienteAxios.get(`/api/preguntas/datos/${codigo}`);
      setPreguntaModificar(resp.data.pregunta)
      console.log(resp.data.pregunta);
      setModificarPregunta(true);
   }

   const handleCrearPregunta = () => {
      setPreguntaModificar(null);
      setCrearPregunta(true);
   }

   const handleMostrarBusquedaPreguntas = () => {
      setPreguntaModificar(null);
      setPreguntas([]);
      setModificarPregunta(false);
      setCrearPregunta(false);
   }
    
     return ( 
        <Layout>
           <Privado>
             {autenticado 
             ?
                <div>
                  <h5 className="my-4 text-center">Administrar Preguntas</h5>
                  {!modificar_pregunta && !crear_pregunta
                  ?
                  <Container>
                     <Row>
                        <Col>
                           <Row>
                              <Button
                                 size="sm"
                                 variant="info"
                                 className="align-self-end mb-2"
                                 onClick={handleClickBuscar}
                                 block
                              >
                                 Buscar
                              </Button>  
                           </Row>
                           <Row>
                              <Col className="p-0">
                                 <DatePicker
                                    selected={fecha_desde}
                                    dateFormat="dd/MM/yyyy"
                                    popperPlacement="top-end"
                                    popperModifiers={{
                                       offset: {
                                       enabled: true,
                                       offset: "5px, 10px"
                                       },
                                       preventOverflow: {
                                          enabled: true,
                                          escapeWithReference: false,
                                          boundariesElement: "viewport"
                                       }
                                    }}
                                    onChange={date => setFiltros({
                                       ...filtros,
                                       fecha_desde: date,
                                    })}
                                    customInput={
                                       <CustomDateInput 
                                          label="Creación desde"
                                          ref = {ref_custom_date_desde}
                                       />
                                    }
                                 />
                              </Col>
                              <Col>
                                 <DatePicker
                                    selected={fecha_hasta}
                                    dateFormat="dd/MM/yyyy"
                                    popperPlacement="top-end"
                                    popperModifiers={{
                                       offset: {
                                       enabled: true,
                                       offset: "5px, 5px"
                                       },
                                       preventOverflow: {
                                          enabled: true,
                                          escapeWithReference: false,
                                          boundariesElement: "viewport"
                                       }
                                    }}
                                    onChange={date => setFiltros({
                                       ...filtros,
                                       fecha_hasta: date,
                                    })}
                                    customInput={
                                       <CustomDateInput 
                                          label="hasta"
                                          ref = {ref_custom_date_hasta}
                                       />
                                    }
                                 /> 
                              </Col>
                           </Row>
                           <Row className="mb-2">
                              <Form.Control
                                 id="nombre_usuario_creador"
                                 name="nombre_usuario_creador"
                                 type="text" 
                                 size="sm"
                                 placeholder="CREADA POR USUARIO..." 
                                 value={nombre_usuario_creador}
                                 onChange={e => {
                                    setFiltros({
                                       ...filtros,
                                       [e.target.name]: e.target.value.toUpperCase()
                                    })
                                 }} 
                              />
                           </Row>
                           <Row className="mb-2">
                                 <InputSelectMateria
                                    id="codigo_materia"
                                    name="codigo_materia"
                                    as="select"
                                    size="sm"
                                    label="TODAS LAS MATERIAS"
                                    value={codigo_materia}
                                    onChange={e => setFiltros({
                                       ...filtros,
                                       codigo_unidad: '0',
                                       codigo_modulo: '0',
                                       codigo_modulo_contenido: '0',
                                       codigo_modulo_contenido_tema: '0',
                                       codigo_modulo_contenido_tema_concepto: '0',
                                       [e.target.name]: e.target.value,
                                    })}
                                 />
                           </Row>
                           <Row className="mb-2">
                                 <InputSelectUnidadesMateria
                                    id="codigo_unidad"
                                    name="codigo_unidad"
                                    /*codigo materia se le pasa a las props del componente
                                    para filtrar las unidades de la materia seleccionada.*/
                                    codigo_materia= {codigo_materia}
                                    as="select"
                                    size="sm"
                                    label="TODAS LAS UNIDADES"
                                    value={codigo_unidad}
                                    onChange={e => setFiltros({
                                       ...filtros,
                                       codigo_modulo: '0',
                                       codigo_modulo_contenido: '0',
                                       codigo_modulo_contenido_tema: '0',
                                       codigo_modulo_contenido_tema_concepto: '0',
                                       [e.target.name]: e.target.value,
                                    })}
                                 />
                           </Row>
                           <Row className="mb-2">
                                 <InputSelectModulosUnidad
                                    id="codigo_modulo"
                                    name="codigo_modulo"
                                    /*codigo unidad se le pasa a las props del componente
                                    para filtrar los modulos de la unidad seleccionada.*/
                                    codigo_unidad= {codigo_unidad}
                                    as="select"
                                    size="sm"
                                    label="TODOS LOS MÓDULOS"
                                    value={codigo_modulo}
                                    onChange={e => setFiltros({
                                       ...filtros,
                                       codigo_modulo_contenido: '0',
                                       codigo_modulo_contenido_tema: '0',
                                       codigo_modulo_contenido_tema_concepto: '0',
                                       [e.target.name]: e.target.value
                                    })}
                                 />
                           </Row>
                           <Row className="mb-2">
                                 <InputSelectModulosContenido
                                    id="codigo_modulo_contenido"
                                    name="codigo_modulo_contenido"
                              
                                    /*codigo modulo se le pasa a las props del componente
                                    para filtrar las propiedades del modulo seleccionado.*/
                                    codigo_modulo={codigo_modulo}
                                    as="select"
                                    size="sm"
                                    label="TODOS LOS CONTENIDOS"
                                    value={codigo_modulo_contenido}
                                    onChange={e => setFiltros({
                                       ...filtros,
                                       codigo_modulo_contenido_tema: '0',
                                       codigo_modulo_contenido_tema_concepto: '0',
                                       [e.target.name]: e.target.value
                                    })}
                                 />
                           </Row>
                           <Row className="mb-2">
                                 <InputSelectModulosContenidoTema
                                    id="codigo_modulo_contenido_tema"
                                    name="codigo_modulo_contenido_tema"
                                    
                                    /*codigo contenido se le pasa a las props del componente
                                    para filtrar las propiedades del modulo seleccionado.*/
                                    codigo_modulo_contenido={codigo_modulo_contenido}
                                    as="select"
                                    size="sm"
                                    label="TODOS LOS TEMAS"
                                    value={codigo_modulo_contenido_tema}
                                    onChange={e => setFiltros({
                                       ...filtros,
                                       codigo_modulo_contenido_tema_concepto: '0',
                                       [e.target.name]: e.target.value
                                    })}
                                 />
                           </Row>
                           <Row className="mb-2">
                                 <InputSelectModulosContenidoTemaConcepto
                                 id="codigo_modulo_contenido_tema_concepto"
                                 name="codigo_modulo_contenido_tema_concepto"

                                 /*codigo contenido se le pasa a las props del componente
                                 para filtrar las propiedades del modulo seleccionado.*/
                                 codigo_modulo_contenido_tema={codigo_modulo_contenido_tema}
                                 as="select"
                                 size="sm"
                                 label="TODOS LOS CONCEPTOS"
                                 value={codigo_modulo_contenido_tema_concepto}
                                 onChange={e => setFiltros({
                                    ...filtros,
                                    [e.target.name]: e.target.value
                                 })}
                                 />
                           </Row>
                        </Col>
                        <Col xs="9" className="d-flex flex-column">
                           <Row>
                              <Col
                                 className="d-flex justify-content-end"
                              >
                                 <Button
                                    variant="outline-success"
                                    size="sm"
                                    onClick={handleCrearPregunta}
                                 >
                                    + Crear Pregunta
                                 </Button>                              
                              </Col>  
                           </Row>
                           <Row className="flex-grow-1 px-3">
                              <Col xs="12" className={`bg-light ${preguntas.length === 0 ? 'd-flex align-items-center justify-content-center' : 'pt-3'}`}>
                              {preguntas.length === 0 
                              ?
                                 <AlertText  
                                    text="No se encontraron resultados"
                                 />
                              :
                                 <TablePregunta 
                                    preguntas={preguntas}
                                    handleEliminaPregunta = {handleEliminaPregunta}
                                    handleModificaPregunta = {handleModificaPregunta}
                                 /> 
                              }   
                              </Col>
                           </Row>
                           
                        </Col>
                     </Row>
                  </Container>   

                  :

                  <PreguntaForm
                     pregunta_modificar = {pregunta_modificar}
                     handleMostrarBusquedaPreguntas = {handleMostrarBusquedaPreguntas}
                  />

                  }   
                </div>
             :
                null
             }
           </Privado>
        </Layout>
     );
}
 
export default Cursos;