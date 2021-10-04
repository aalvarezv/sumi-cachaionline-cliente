import React, { useState } from 'react'
import {Container, Row, Col, Button, Card, Form} from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import Uploader from '../../components/ui/Uploader'
import {getBase64, handleError} from '../../helpers'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { TiDelete } from 'react-icons/ti'
import Layout from '../../components/layout/Layout'
import { toast } from 'react-toastify'
import ToastMultiline from '../../components/ui/ToastMultiline'
import Spinner from '../../components/ui/Spinner'

const Unidades = () => {


      const [archivo_base64, setArchivBase64] = useState('')
      const [isLoading, setIsLoading] = useState(false)
   
      const getArchivos = async archivos => {
      
      const base64 = await getBase64(archivos[0])
      
      setArchivBase64(base64)
      }

      const handleClickCargaMasivaUnidadesMineduc = async () => {
         try{
             const resp = await clienteAxios.post('/api/carga-masiva-mineduc/datos-carga-unidades-mineduc',{
                     nombre_archivo_carga: 'archivo_carga.xlsx',
                     archivo_base64,
             },
             setIsLoading(true)
             )
             setIsLoading(false)
             setArchivBase64('')
             toast.success('Unidades cargadas correctamente', {containerId: 'sys_msg'})
         }catch(e){
            console.log(e)
            handleError(e)
            setIsLoading(false)
         }
     }
     
      return ( 
         <Layout>
            <Container>
               <h5 className="text-center my-4">Carga Masiva Unidades Mineduc</h5>
                  <Card>
                  <Card.Body>
                  <Row className="d-flex justify-content-center">
                     <Col className="mb-2 mb-sm-0" xs={12} sm={6}>
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
                           <Col className="d-flex justify-content-center" >
                           {isLoading
                           ?
                              <Spinner/>
                           :
                              <Button
                                 variant="info"
                                 size="lg"
                                 onClick={e => {
                                    if(archivo_base64 === ''){
                                          toast.error(<ToastMultiline mensajes={[{msg: 'Debe seleccionar un archivo'}]}/>, {containerId: 'sys_msg'})
                                    }else {
                                          handleClickCargaMasivaUnidadesMineduc()
                                    }
                                 }}
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
 
export default Unidades