import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import Head from 'next/head';
import AuthState from '../context/auth/AuthState';
import MateriaState from '../context/materias/MateriaState';
import UnidadState from '../context/unidades/UnidadState';
import NivelAcademicoState from '../context/niveles_academicos/NivelAcademicoState';

function MyApp({ Component, pageProps }) {

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
      </Head>
        <ToastContainer
            position="top-right"
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
        <AuthState>
          <MateriaState>
            <UnidadState>
              <NivelAcademicoState>
               <Component {...pageProps} />
              </NivelAcademicoState>
            </UnidadState>
          </MateriaState>
        </AuthState>
    </>
  );
}

export default MyApp
