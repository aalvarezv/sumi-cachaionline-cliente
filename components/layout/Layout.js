import React, { useEffect, useContext } from 'react';
import Header from './Header';
import AuthContext from '../../context/auth/AuthContext';


const Layout = props => {

    const {autenticado, usuarioAuth} = useContext(AuthContext);

    useEffect(() => {
      usuarioAuth();
      if(autenticado){
        console.log('Mandar al home, está autenticado...');
      }
    },[] );


    return ( 
        <>
        <Header />
        <main>
            {props.children}
        </main>
        {<footer> 
            <a
            href="https://www.cachaionline.com"
            target="_blank"
            rel="noopener noreferrer"
            >
            CachaiOnline
            </a>
        </footer>}
        <style jsx global>{`
            body {
                /*background-color: #f1f2f5;*/
            }
            footer{
                width: 100%;
                background-color: black;
                text-align:center;
                margin-top: 1rem;
            }
            footer > a{
                color:white;
            }
      `}</style>
        </>
     );
}
 
export default Layout;