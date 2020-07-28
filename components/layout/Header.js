import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Menu from './Menu';
import { Boton } from '../ui/Formulario';

const Barra = styled.div`
    display: flex;
    justify-content: center;
    padding: 1rem 0;
    border-bottom: 2px solid var(--gray-1);
`
const ItemsBarra = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    width: 95%;
`

const Header = () => {
    return ( 
       <Barra>
           <ItemsBarra>
                <div>
                    <Menu />
                </div>
                <div css={`
                    display:flex;
                    align-items: center;
                `}>
                    <p css={`
                        margin-right: 2rem;
                    `}>Hola: Alan</p>

                    <Link href="/login">
                        <Boton>Iniciar Sesión</Boton>
                    </Link>
                </div>
           </ItemsBarra>
       </Barra>
     );
}
 
export default Header;