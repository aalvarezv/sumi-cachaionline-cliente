import { useEffect, useState } from "react";
import { toast } from 'react-toastify'
import { Modal, Row, Col, Button, Alert, ListGroup } from "react-bootstrap";
import Logo from "./Logo";
import { handleError } from "../../helpers";
import clienteAxios from "../../config/axios";


const ModalUsuarioCursoConfig = ({
        show, 
        paramsUsuarioCursoConfig,
        setShowModalUsuarioCursoConfig,
    }) => {
    
    const [cursos, setCursos] = useState([])
   
    const { usuario, institucion, rol } = paramsUsuarioCursoConfig

    useEffect(() => {

        if(paramsUsuarioCursoConfig.institucion){
            listarCursos()
        }
    }, [paramsUsuarioCursoConfig])
 
    const handleCloseModal = () => {
        setShowModalUsuarioCursoConfig(false)
    }

    const listarCursos = async () => {
     
        try{

           const resp = await clienteAxios.get(`/api/cursos-usuarios-roles/consulta/usuario-rol-inscrito-curso/`, {
              params: {
                rut_usuario: usuario.rut_usuario,
                codigo_rol: rol.codigo,
                codigo_institucion: institucion.codigo,

              }
           })
           
           setCursos(resp.data.cursos)             
  
        }catch(e){
           handleError(e)
        }
    }

    const handleClickInscribirUsuarioCurso = async codigoCurso => {
       
        try {
       
            await clienteAxios.post('/api/cursos-usuarios-roles/crear',{
                codigo_curso: codigoCurso, 
                rut_usuario: usuario.rut_usuario,
                codigo_rol: rol.codigo
            })
            
            handleInscribirCurso(codigoCurso, 1)
            toast.success('Usuario agregado al curso', {containerId: 'sys_msg'})

        } catch (e) {
            handleError(e)
        }

    }

    const handleClickQuitarUsuarioCurso = async codigoCurso => {

        try {
        
            await clienteAxios.delete(`/api/cursos-usuarios-roles/eliminar`,{
                params: { 
                    rut_usuario: usuario.rut_usuario,
                    codigo_curso: codigoCurso,
                    codigo_rol: rol.codigo
                }
            })
            
            handleInscribirCurso(codigoCurso, 0)
            toast.success('Usuario eliminado del curso', {containerId: 'sys_msg'})

        } catch (e) {
            handleError(e)
        }

    }

    const handleInscribirCurso = (codigoCurso, inscribir) => {

        let newCursos = [...cursos]
 
        newCursos = newCursos.map(curso => {
            if(curso.codigo === codigoCurso){
                return {
                    ...curso,
                    inscrito: inscribir
                }
            }else{
                return curso
            }
        })
        
       setCursos(newCursos)

    }

    if(!show) return null

    return (  
        <Modal show={show} onHide={() => {}}>
        <Modal.Header>
            <div className="d-flex">
                <Logo />
                <h4 className="ml-2">
                  Inscribir usuario en un curso
                </h4>
            </div>
            <Button 
                variant="info"
                onClick={handleCloseModal}
            >
                Volver
            </Button>
        </Modal.Header>
        <Modal.Body>
            <Alert variant="dark" >
                <Row>
                    <Col>
                        <h6 className="font-weight-bold">{`RUT: ${usuario.rut_usuario}`}</h6>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h6 className="font-weight-bold">{`Nombre: ${usuario.nombre_usuario}`}</h6>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h6 className="font-weight-bold">{`Institución: ${institucion.descripcion}`}</h6>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h6 className="font-weight-bold">{`Perfil: ${rol.descripcion}`}</h6>
                    </Col>
                </Row>
            </Alert>
            {cursos.length > 0 &&
                <>
                    <h5 className="text-info text-center">
                        <small>Haga clic sobre el curso que desea inscribir al usuario</small>
                    </h5>
                    <ListGroup>
                        {cursos.map(curso => {
                            const { codigo, letra, nivel_academico, inscrito } = curso
                            return (
                                <ListGroup.Item 
                                    key={codigo}
                                    variant={inscrito === 0 ? "light" : "info"}
                                    className="cursor-pointer"
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        if(inscrito === 0){
                                            handleClickInscribirUsuarioCurso(codigo)
                                        }else{
                                            handleClickQuitarUsuarioCurso(codigo)
                                        }

                                    }}
                                >   
                                <span className="d-flex justify-content-between">
                                
                                    {`${nivel_academico.descripcion} ${letra}`}
                                    {inscrito > 0 && <span>&#10003;</span>}
                                </span>
                                </ListGroup.Item>
                            )
                        })}
                    </ListGroup>
                </>
            }
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>

    );
}
 
export default ModalUsuarioCursoConfig;