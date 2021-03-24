import React, { useState, useEffect } from 'react'
import {Modal, Container, Row, Col, Form, Button} from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import {handleError} from '../../helpers'
import AlertText from '../../components/ui/AlertText'
import Paginador from '../../components/ui/Paginador'
import TableUsuariosDisponiblesCurso from './TableUsuariosDisponiblesCurso'
import InputSelectRol from './InputSelectRol'
import Logo from './Logo'

const ModalUsuariosDisponiblesCurso = ({show, curso, handleCloseModalUsuarios}) =>{

  
    const [usuarios, setUsuarios] = useState([])
    const [nombreUsuario, setNombreUsuario] = useState('')
    const [codigoRol, setCodigoRol] = useState('')
    const [textAlert, setTextAlert] = useState('')
    const {nivel_academico, letra, codigo: codigoCurso, institucion : { codigo: codigoInstitucion} } = curso
    /**** Variables para paginación *****/
    const [pagina_actual, setPaginaActual] = useState(1)
    const [resultados_por_pagina, setResultadosPorPagina] = useState(10)

    const indice_ultimo_resultado = pagina_actual * resultados_por_pagina
    const indice_primer_resultado = indice_ultimo_resultado - resultados_por_pagina
    const resultados_pagina = usuarios.slice(indice_primer_resultado, indice_ultimo_resultado)
    /*************************************/

    const handleSetPaginaActual = numero_pagina => {
        setPaginaActual(numero_pagina)
    }
   
    useEffect(() => {

        if(!show){
            setCodigoRol('0')
            setNombreUsuario('')
            setUsuarios([])
        }

    }, [show])

    const handleClickBuscar = async () => {
        
        try{
           const resp = await clienteAxios.get(`/api/usuarios/listar-inscritos-disponibles-curso`, {
              params: {
                 nombreUsuario,
                 codigoInstitucion,
                 codigoCurso,
                 codigoRol
              }
           })

           setUsuarios(resp.data.usuarios)
           if(resp.data.usuarios.length > 0){
              setTextAlert("")
           }else{
              setTextAlert("No se encontraron resultados")
           } 
           setPaginaActual(1)
        
        }catch(e){
           handleError(e)
        }
    }

    
    return (
    
      <Modal show={show} onHide={handleCloseModalUsuarios} size="lg">
        <Modal.Header closeButton>
        <Modal.Title>
            <Row className="ml-3">
                <Logo />
                <h4 className="ml-2"> {` ${nivel_academico.descripcion} ${letra}`} </h4> 
            </Row>
        </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Container>
            <Row>
                <Col>
                    <Row className="mb-2">
                        <Col>
                            <InputSelectRol
                                id="codigo_rol"
                                name="codigo_rol"
                                as="select"
                                label="TODOS LOS PERFILES"
                                codigos={[2,3]}
                                value={codigoRol}
                                onChange={e=>{
                                    setCodigoRol(e.target.value)
                                }}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-2 mb-sm-0">
                        <Col>
                            <Form.Control
                                id="filtro_nombre_usuario"
                                name="filtro_nombre_usuario"
                                type="text" 
                                placeholder="Escribe un nombre de usuario para buscar..."
                                value={nombreUsuario}
                                onChange={e=>{
                                    setNombreUsuario(e.target.value)
                                }}  
                            />
                        </Col>
                    </Row>
                </Col>
                <Col className="d-flex align-items-end mb-2 mb-sm-0" xs={12} sm="auto">
                    <Button 
                        variant="info"
                        className="btn-block "
                        onClick={e =>{
                            handleClickBuscar()
                        }}>
                        Buscar
                    </Button>
                </Col>
            </Row>
              <Row className="mt-3">
                {usuarios.length > 0
                ?
                <Col className="mt-3 d-flex flex-column">
                    <div className="align-self-end">
                        <Paginador
                           resultados_por_pagina = {resultados_por_pagina}
                           total_resultados = {usuarios.length}
                           handleSetPaginaActual = {handleSetPaginaActual}
                           pagina_activa = {pagina_actual}
                        />
                    </div>
                    <TableUsuariosDisponiblesCurso
                        usuarios={resultados_pagina}
                        pagina_actual = {pagina_actual}
                        resultados_por_pagina = {resultados_por_pagina}
                        codigoCurso = {codigoCurso}
                        setUsuarios = {setUsuarios}
                    />
                </Col>
                :
                <Col className="my-3">
                    <AlertText
                    text={textAlert}
                    />
                </Col>
                }
                  
              </Row>
            </Container>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
  )
}

export default ModalUsuariosDisponiblesCurso