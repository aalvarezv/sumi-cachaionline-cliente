import React from 'react'
import Layout from '../../components/layout/Layout'
import Privado from '../../components/layout/Privado'
import CursoForm from '../../components/forms/CursoForm'


const Cursos = () => { 

    return ( 
        <Layout>
           <Privado>
               <div>
                  <h5 className="my-4 text-center">Administrar Cursos</h5>
                  <CursoForm/>
               </div>
           </Privado>
        </Layout>
     )
}
 
export default Cursos