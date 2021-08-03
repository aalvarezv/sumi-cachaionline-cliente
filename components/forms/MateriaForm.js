import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import { Container, Form, Button, Image, Row, Col } from 'react-bootstrap'
import { handleError, getBase64 } from '../../helpers'
import  clienteAxios from '../../config/axios'
import Uploader from '../ui/Uploader'
import { TiDelete } from 'react-icons/ti'


const MateriaForm = ({materiaEnProceso, setMateriaEnProceso}) => {

    const [formulario, setFormulario] = useState({
        codigo: '',
        nombre: '',
        descripcion: '',
        imagen: '',
        inactivo: false
    })

    useEffect(() => {

        if(materiaEnProceso){
            setFormulario({
                codigo: materiaEnProceso.codigo,
                nombre: materiaEnProceso.nombre,
                descripcion: materiaEnProceso.descripcion,
                imagen: materiaEnProceso.imagen,
                inactivo: materiaEnProceso.inactivo
            })
        }else{
            reseteaFormulario()
        }

    }, [materiaEnProceso])

    const validarFormulario = () => {
       
        //valida el nombre.
        if(formulario.nombre.trim() === ''){
            toast.error('Ingrese nombre', {containerId: 'sys_msg'})
            return false
        }
        //valida el descripcion.
        if(formulario.descripcion.trim() === ''){
            toast.error('Ingrese descripción', {containerId: 'sys_msg'})
            return false
        }

        return true

    }

    const reseteaFormulario = () => {
        setFormulario({
            codigo: '',
            nombre: '',
            descripcion: '',
            imagen: '',
            inactivo: false
        })
    }

    const handleClickCrear = async e => {
        
        try{
             //valida el formulario
             if(!validarFormulario()) return
             //materia a enviar
             let materia = {
                 ...formulario,
                codigo : uuidv4(),
             }

             await clienteAxios.post('/api/materias/crear', materia)
             //respuesta de la materia recibido.
             setMateriaEnProceso(materia)
             toast.success('Materia creada', {containerId: 'sys_msg'})
 
        }catch(e){
             handleError(e)
        }
    }
    
    const handleClickActualizar = async e => {
        
        try{
           
            if(!validarFormulario()) return
            //materia a enviar
            let materia = formulario

            await clienteAxios.put('/api/materias/actualizar', materia)
            //respuesta de la materia recibido.
            toast.success('Materia actualizada', {containerId: 'sys_msg'})
 
        }catch(e){
             handleError(e)
        }
    }

    const handleQuitarImagenMateria = () => {
        setFormulario({
            ...formulario,
            imagen: '',
        })
    }

    //funcion que recibe el componente Uploader donde retorna los archivos a subir.
    const getArchivos = async archivos => {
        const base64 = await getBase64(archivos[0])
        setFormulario({
            ...formulario,
            imagen: base64
        })
    }

    return ( 
        <Container>
            <Form>
                <Row>
                    <Col className="d-flex mb-2">
                        <div
                            className="d-flex"
                            style={{position:"relative", minWidth:150}}
                        >
                            <Image 
                                src={formulario.imagen.trim() === '' ? '/static/no-image.png' : formulario.imagen.trim()} 
                                style={{
                                    width: 150, 
                                    marginRight: 10
                                }}
                                thumbnail
                            />
                            {formulario.imagen.trim() !== '' &&
                                <span
                                    onClick={handleQuitarImagenMateria}
                                    style={{
                                        position: 'absolute', 
                                        top: -16, 
                                        right: -13,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <TiDelete 
                                        size={"1.5rem"} 
                                        color={"red"}
                                    />
                                </span>
                            }
                        </div>
                        <Uploader 
                            titulo={"HAZ CLICK O ARRASTRA Y SUELTA UNA IMAGEN"}
                            formatosValidos={["image/*"]}
                            getArchivos={getArchivos}
                        />
                    </Col>
                </Row> 
                <Form.Group>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        id="nombre"
                        name="nombre"
                        type="text" 
                        placeholder="NOMBRE MATERIA" 
                        value={formulario.nombre}
                        onChange={e => {
                            setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value
                            })
                        }} 
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control 
                        id="descripcion"
                        name="descripcion"
                        as="textarea" 
                        rows="5"
                        placeholder="DESCRIPCIÓN"
                        value={formulario.descripcion}
                        onChange={e => {
                            setFormulario({
                                ...formulario,
                                [e.target.name]: e.target.value
                            })
                        }}
                    />
                </Form.Group>      
                <Form.Check 
                        id="inactivo"
                        name="inactivo"
                        type="checkbox"
                        label="Inactivo"
                        className="mb-3"
                        checked={formulario.inactivo}
                        onChange={e => {
                            setFormulario({
                            ...formulario,
                            [e.target.name]: e.target.checked
                            })
                        }}
                />
                <Row className="justify-content-center">
                    <Col className="mb-3 mb-sm-0" xs={12} sm={"auto"}>
                        {materiaEnProceso
                        ?
                            <Button 
                                variant="outline-info"
                                size="lg"
                                className="btn-block"
                                onClick={handleClickActualizar}
                            >Actualizar</Button>
                        :
                            <Button 
                                variant="info"
                                size="lg"
                                className="btn-block"
                                onClick={handleClickCrear}
                            >Crear</Button>
                        }
                    </Col>
                </Row>
            </Form>
        </Container> )
}
 
export default MateriaForm