import React, { useEffect, useContext }  from 'react'
import { useRouter } from 'next/router'
import AuthContext from '../../context/auth/AuthContext'

const Privado = props => {

    const { autenticado } = useContext(AuthContext)
    const router = useRouter()
    
    useEffect(() => {
      //si no hay token y el usuario no está autenticado.
      if(!autenticado && !localStorage.getItem('token')){
          router.push('/login')
      }

    }, [autenticado])

    if(!autenticado) return null

    return ( 
        <div>
            {props.children}
        </div>
     )
}
 
export default Privado