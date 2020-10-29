import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';

import AuthState from '../context/auth/AuthState';
import MateriaState from '../context/materias/MateriaState';
import UnidadState from '../context/unidades/UnidadState';
import NivelAcademicoState from '../context/niveles_academicos/NivelAcademicoState';

function MyApp({ Component, pageProps }) {

  return (
    <>
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
