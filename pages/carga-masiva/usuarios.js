import React, { useContext, useState } from 'react'
import {Button, Container, Card, Col, Row } from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import Uploader from '../../components/ui/Uploader'
import {getBase64, handleError} from '../../helpers'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { TiDelete } from 'react-icons/ti'
import { toast } from 'react-toastify'
import Layout from '../../components/layout/Layout'
import InputSelectRol from '../../components/ui/InputSelectRol'
import InputSelectNivelAcademico from '../../components/ui/InputSelectNivelAcademico'
import InputSelectCursos from '../../components/ui/InputSelectCursosNivelAcademicoInstitucion'
import AuthContext from '../../context/auth/AuthContext'
import Spinner from   '../../components/ui/Spinner'

const Usuarios = () => {

      const { institucion_select } = useContext(AuthContext)
      const [codigo_rol, setCodigoRol] = useState('0')
      const [codigo_nivel_academico, setCodigoNivelAcademico] = useState('0')
      const [codigo_curso, setCodigoCurso] = useState('0')
      const [archivo_base64, setArchivBase64] = useState('')
      const [isLoading, setIsLoading] = useState(false)
   
      const getArchivos = async archivos => {
      
         const base64 = await getBase64(archivos[0])
         setArchivBase64(base64)

      }

      const handleClickCargaMasivaUsuarios = async () => {
         
         try{

            if(codigo_rol === '0'){
               toast.error('Seleccione rol', {containerId: 'sys_msg'})
               return
            }

            if(codigo_curso === '0'){
               toast.error('Seleccione curso', {containerId: 'sys_msg'})
               return
            }

            if(archivo_base64.trim() === ''){
               toast.error('Debe adjuntar archivo de carga', {containerId: 'sys_msg'})
               return
            }

            setIsLoading(true)

             const resp = await clienteAxios.post('/api/carga-masiva-usuarios/datos-carga-usuarios',{
                     nombre_archivo_carga: 'archivo_carga.xlsx',
                     archivo_base64,
                     codigo_institucion: institucion_select.codigo,
                     codigo_rol,
                     
                     codigo_curso
             })

             toast.success('Usuarios cargados correctamente', {containerId: 'sys_msg'})

             setCodigoRol('0')
             setCodigoNivelAcademico('0')
             setCodigoCurso('0')
             setArchivBase64('')
             setIsLoading(false)

         }catch(e){
            setIsLoading(false)
            handleError(e)
         }

      }

      if (!institucion_select){
         return null
      }

      
      
      return ( 
         <Layout>
            <Container>
               <h5 className="text-center my-4">Carga Masiva Usuarios</h5>
               <Card>
               <Card.Body> 
                  <Row className="d-flex justify-content-center">
                     <Col className="mb-2 mb-sm-0" xs={12} sm={6}>
                        <Row className="mb-2">
                           <Col>
                              <InputSelectRol
                                 id="codigo_rol"
                                 name="codigo_rol"
                                 as="select"
                                 size="sm"
                                 label="SELECCIONE ROL"
                                 value={codigo_rol}
                                 codigos={[2,3]}
                                 onChange={e => setCodigoRol(e.target.value)}
                              /> 
                           </Col>
                        </Row>
                        <Row className="mb-2">
                           <Col>
                              <InputSelectNivelAcademico
                                 id="codigo_nivel_academico"
                                 name="codigo_nivel_academico"
                                 as="select"
                                 size="sm"
                                 label="SELECCIONE NIVEL ACADEMICO"
                                 value={codigo_nivel_academico}
                                 onChange={e => {
                                    setCodigoNivelAcademico(e.target.value)
                                    setCodigoCurso('0')
                                 }}
                              />
                           </Col>
                        </Row>
                        <Row className="mb-2">
                           <Col>
                              <InputSelectCursos
                                 id="codigo_curso"
                                 name="codigo_curso"
                                 as="select"
                                 size="sm"
                                 label="SELECCIONE CURSO"
                                 value={codigo_curso}
                                 codigo_nivel_academico={codigo_nivel_academico}
                                 codigo_institucion={institucion_select.codigo}
                                 onChange={e => setCodigoCurso(e.target.value)}
                              /> 
                           </Col>
                        </Row>
                        <Row style={{height: 150}}>
                           <Col className="p-3">
                           {archivo_base64.trim() === ''
                           ?
                              <Uploader 
                                 titulo={"HAZ CLICK O ARRASTRA Y SUELTA UN ARCHIVO EXCEL"}
                                 formatosValidos={[
                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                    "application/vnd.ms-excel"
                                 ]}
                                 getArchivos={getArchivos}
                              />
                           :
                           <div className="d-flex justify-content-center">
                                 <span
                                    style={{
                                       position: 'relative',
                                       
                                    }}
                                 >
                                    <TiDelete 
                                       size={"1.5rem"} 
                                       color={"red"}
                                       style={{
                                             position:'absolute',
                                             top: -10,
                                             right: -10,
                                             cursor: 'pointer'
                                       }}
                                       onClick={() => setArchivBase64('')}
                                    />
                                    <RiFileExcel2Fill
                                       size={"6rem"} 
                                       color={"green"}
                                    />
                                 </span>
                           </div>
                           }
                           </Col>
                        </Row> 
                        <Row className="mt-5">
                           <Col className="d-flex justify-content-center">
                              {isLoading
                              ?
                                 <Spinner />
                              :
                                 <Button
                                    variant="info"
                                    size="lg"
                                    onClick={handleClickCargaMasivaUsuarios}
                                 >
                                    Cargar
                                 </Button>
                              }
                           </Col>
                        </Row>
                     </Col>
                  </Row> 
               </Card.Body> 
               </Card>
            </Container> 
         </Layout>
      )
}
 
export default Usuarios