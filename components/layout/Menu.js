import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const Nav = styled.nav`
    padding-left: 2rem;
    font-size: 1.8rem;

    a{
      font-weight: 700;
      margin-left: 2rem;
      font-family: 'PT Sans', sans-serif;
      color: var(--gray-2);
        &:last-of-type{
            margin-right: 0;
        }
    }
    
`;

const Menu = () => {
    return ( 
        <Nav>
            <Link href="/">
                <a>Inicio</a>
            </Link>
            <Link href="/materias">
                <a>Materias</a>
            </Link>
        </Nav>
     );
}
 
export default Menu;