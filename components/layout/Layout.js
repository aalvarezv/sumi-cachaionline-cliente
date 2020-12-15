
import React, { useEffect, useContext } from 'react';
import Head from 'next/head';
import { ToastContainer, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import { font, color } from '../../styles/theme';
import { addOpacityToColor } from '../../styles/utils';
import Navegacion from './Navegacion';
import AuthContext from '../../context/auth/AuthContext';

const backgroundColor_1 = addOpacityToColor(color.primary, 0.3);
const backgroundColor_2 = addOpacityToColor(color.secondary, 0.3);

const Layout = props => {

    const { usuario, usuarioAuth } = useContext(AuthContext);
    
    useEffect(() => {
        console.log('render layout', usuario);
        if(!usuario){
            console.log('render layout ejecuta usuarioAuth')
            usuarioAuth();
        }
    }, [])

    return ( 
        <>
        <Head>
        <title>CachaiOnline</title>
        <link 
            rel="stylesheet" 
            href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" 
            integrity="sha256-l85OmPOjvil/SOvVt3HnSSjzF1TUMyT9eV0c2BzEGzU="
            crossOrigin="anonymous" 
        />
        
        {/* Ejemplo de importación de CSS mediante CDN y archivo Local.
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;1,700&family=Roboto+Slab:wght@400;700&display=swap" rel="stylesheet"
        /> 
        <link href="/static/css/spinner.css" rel="stylesheet"/> */}
        </Head>
        <Navegacion />
        <ToastContainer
          position="bottom-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          transition={Slide}
          enableMultiContainer 
          containerId={'sys_msg'}
        />
        <main>
            {props.children}
        </main>
         <style jsx global>{`
            body{
                background-image:
                    radial-gradient(${backgroundColor_1} 1px, transparent 1px), /*tamaño y transparencia*/
                    radial-gradient(${backgroundColor_2} 1px, transparent 1px);
                background-position: 0 0, 10px 25px; /*como se ordenan de los puntos*/
                background-size: 50px 50px;  /*separación de los puntos*/
                font-family: ${font.base}
            }
        `}</style>  
        </>
     );
}
 
export default Layout;