import React, { useEffect, useContext } from 'react';
import Head from 'next/head';
import Navegacion from './Navegacion';
import AuthContext from '../../context/auth/AuthContext';

const Layout = props => {

    const {autenticado, usuarioAuth} = useContext(AuthContext);

    useEffect(() => {
      usuarioAuth();
    //   if(autenticado){
    //     console.log('Mandar al home, está autenticado...');
    //   }
    },[] );

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
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;1,700&family=Roboto+Slab:wght@400;700&display=swap" rel="stylesheet"
        />
        {/* <link href="/static/css/spinner.css" rel="stylesheet"/> */}
        </Head>
        <Navegacion />
        <main>
            {props.children}
        </main>
         <style jsx global>{`
        `}</style>  
        </>
     );
}
 
export default Layout;