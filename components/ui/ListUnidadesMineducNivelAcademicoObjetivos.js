import React, {useState, useEffect, useContext} from 'react'
import { Accordion, Card, Button, AccordionContext, useAccordionToggle  } from 'react-bootstrap'
import  clienteAxios from '../../config/axios'
import { handleError } from '../../helpers'
import AuthContext from '../../context/auth/AuthContext';
import Objetivos from './Objetivos'



function ContextAwareToggle({ children, eventKey, getEventKey }) {

    const currentEventKey = useContext(AccordionContext);
    
    const handleClickToggle = useAccordionToggle(
      eventKey,
      () => getEventKey && getEventKey(eventKey),
    )

    const isCurrentEventKey = currentEventKey === eventKey;
    
    return (
      <Button
        type="button"
        variant={isCurrentEventKey ? 'info' : 'secondary'}
        onClick={handleClickToggle}
      >
        {children}
      </Button>
    );
}

const ListUnidadesMineducNivelAcademicoObjetivos = props => {

    const [unidadesMineducNivelAcademico, setUnidadesMineducNivelAcademico] = useState([])
    const { codigoCurso } = props
    const [unidadSelect, setUnidadSelect] = useState("0")
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
                setUnidadSelect("0")
               
            }catch(e){
                handleError(e)
            }

        }
        listarUnidadesMineducNivelAcademico()
        
    }, [codigoCurso])

    

    const getEventKey = async (eventKey)  => {

        try{
        
            await clienteAxios.post('/api/mineduc-tablero-objetivo/crear-tablero',{
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
                            <ContextAwareToggle 
                                eventKey={codigo} 
                                getEventKey={getEventKey}
                            >
                                {descripcion}
                            </ContextAwareToggle>
                        </Card.Header>
                        {unidadSelect === codigo
                        &&
                            <Accordion.Collapse 
                                eventKey={codigo}
                            >
                                <Card.Body>
                                    <Objetivos
                                        codigoUnidad={unidadSelect}
                                        codigoCurso={codigoCurso}
                                    />
                                </Card.Body> 
                            </Accordion.Collapse>
                        }
                    </Card>
                )
            }
            )}
        </Accordion>
      )
}

export default ListUnidadesMineducNivelAcademicoObjetivos