import React, { useContext } from 'react'
import Layout from '../components/layout/Layout'
import { Container } from 'react-bootstrap'
import UnidadesMineduc from '../components/ui/UnidadesMineduc'
import AuthContext from '../context/auth/AuthContext'


const Home = () => {

    const { rol_select } = useContext(AuthContext)

    console.log(rol_select)
    return ( 
    <Layout>
      <Container className="mt-3">
        {rol_select && rol_select.ver_inicio_unidades_mineduc
        ?
         <UnidadesMineduc/> 
        :
          null
        }  
      </Container>
    </Layout>   
    )
}
 
export default Home