import React, {useState, useEffect, useContext} from 'react'
import { Accordion, Card, Button, AccordionContext, useAccordionToggle  } from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'
import AuthContext from '../../context/auth/AuthContext';
import Habilidades from './Habilidades'


const ListUnidadesMineducNivelAcademicoHabilidades = props => {

    const [unidadesMineducNivelAcademico, setUnidadesMineducNivelAcademico] = useState([])
    const { codigoCurso } = props
    const [unidadSelect, setUnidadSelect] = useState(0)
    const { usuario } = useContext(AuthContext)
    
    useEffect(() => {

        if(codigoCurso === "0"){
         setUnidadesMineducNivelAcademico([]) 
         return  
        }

        const listarUnidadesMineducNivelAcademico = async () => {
            try{
                const resp = await clienteAxios.get('/api/unidad-mineduc/listar-unidades-mineduc',{
                    params:{
                        codigo_curso: codigoCurso
                    }
                })
                setUnidadesMineducNivelAcademico(resp.data.unidadesMineduc)
            }catch(e){
                handleError(e)
            }

        }
        
        listarUnidadesMineducNivelAcademico()
        setUnidadSelect(0)

    }, [codigoCurso])

    

    const getEventKey = async (eventKey)  => {

        try{
        
            await clienteAxios.post('/api/mineduc-tablero-habilidad/crear-tablero',{
                rut_usuario: usuario.rut,    
                codigo_curso: codigoCurso,
                codigo_unidad_mineduc: eventKey
            })
            setUnidadSelect(eventKey)
        }catch(e){
            handleError(e)
        }
        
    }

    return (
        <Accordion defaultActiveKey="0">
            
            {unidadesMineducNivelAcademico.map(unidadMineducNivelAcademico =>
            {
                const {codigo, descripcion} = unidadMineducNivelAcademico
                return (
                    <Card key={codigo}>
                        <Card.Header>
                            <Accordion.Toggle 
                                as={Button} 
                                variant="link" 
                                eventKey={codigo} 
                                onClick={() => getEventKey(codigo)}
                            >
                                {descripcion}
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse 
                            eventKey={codigo}
                        >
                            <Card.Body>
                                <Habilidades
                                    codigoUnidad={unidadSelect}
                                    codigoCurso={codigoCurso}
                                />
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                )
            }
            )}
        </Accordion>
      )
}

export default ListUnidadesMineducNivelAcademicoHabilidades