import React, {useState} from 'react'
import { Col, Row } from 'react-bootstrap'
import MultiSelectConcepto from '../ui/MultiSelectConcepto'
import MultiSelectContenido from '../ui/MultiSelectContenido'
import MultiSelectMateria from '../ui/MultiSelectMateria'
import MultiSelectModulo from '../ui/MultiSelectModulo'
import MultiSelectTema from '../ui/MultiSelectTema'
import MultiSelectUnidad from '../ui/MultiSelectUnidad'

const FiltrosBusquedaClasificacionPregunta = ({handleClasificacion}) => {


    const [clasificacion, setClasificacion] = useState({
        materias: [],
        unidades: [],
        modulos: [],
        contenidos: [],
        temas: [],
        conceptos: [],
    })

    const { materias, unidades, modulos, contenidos, temas, conceptos } = clasificacion

    const handleChangeMateria = (value) => {
        if (value){
            const newClasificacion = {
                ...clasificacion,
                materias: value.map(v => v.value),
            }

            setClasificacion(newClasificacion)
            handleClasificacion(newClasificacion)

        }
    }

    const handleChangeUnidad = (value) => {
        if (value){
            const newClasificacion = {
                ...clasificacion,
                unidades: value.map(v => v.value),
            }

            setClasificacion(newClasificacion)
            handleClasificacion(newClasificacion)
        }
    }

    const handleChangeModulo = (value) => {
        if (value){
            const newClasificacion = {
                ...clasificacion,
                modulos: value.map(v => v.value),
            }

            setClasificacion(newClasificacion)
            handleClasificacion(newClasificacion)
        }
    }

    const handleChangeContenido = (value) => {
        if (value){
            const newClasificacion = {
                ...clasificacion,
                contenidos: value.map(v => v.value),
            }

            setClasificacion(newClasificacion)
            handleClasificacion(newClasificacion)
        }
    }

    const handleChangeTema = (value) => {
        if (value){
            const newClasificacion = {
                ...clasificacion,
                temas: value.map(v => v.value),
            }

            setClasificacion(newClasificacion)
            handleClasificacion(newClasificacion)
        }
    }

    const handleChangeConcepto = (value) => {
        if (value){
            const newClasificacion = {
                ...clasificacion,
                conceptos: value.map(v => v.value),
            }

            setClasificacion(newClasificacion)
            handleClasificacion(newClasificacion)
        }
    }

    return (  
        <>
            <Row>
                <Col>
                    <MultiSelectMateria
                        handleChange = {handleChangeMateria}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <MultiSelectUnidad
                        handleChange = {handleChangeUnidad}
                        arrayMaterias = {materias}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <MultiSelectModulo
                        handleChange = {handleChangeModulo}
                        arrayUnidades = {unidades}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <MultiSelectContenido
                        handleChange = {handleChangeContenido}
                        arrayModulos = {modulos}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <MultiSelectTema
                        handleChange = {handleChangeTema}
                        arrayContenidos = {contenidos}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <MultiSelectConcepto
                        handleChange = {handleChangeConcepto}
                        arrayTemas = {temas}
                    />
                </Col>
            </Row>
        </>
                    
    );
}
 
export default FiltrosBusquedaClasificacionPregunta;