import React from 'react';
import Header from './Header';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`

    :root{
        --primary: #3097AE;
        --white: #FFFFFF;
        --gray-1: #E1E1E1;
        --gray-2: #6F6F6F;
        /*--naranja: #DA552F;*/
    }
    html{
        font-size: 62.5%;
        box-sizing: border-box;
    }
    body{
        font-size: 1.6rem; /**16px */
        line-height:1.5;
        font-family: 'PT Sans', sans-serif;
    }
    *, ::before, ::after{
        box-sizing: inherit;
    }
    a{
        text-decoration: none;
    }
    img {
        max-width: 100%;
    }
    h1, h2 {
        font-weight: 700;
    }
    h1, h2, h3 {
        line-height: 1.5;
        margin: 0px 0px 2rem;
    }
    footer{
        display:flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 40px;
        background-color: black;
        a{
            color: white;
        }
    }
`;

const Layout = props => {
    return ( 
        <>
         <GlobalStyle />
        <Header />
        <main>
            {props.children}
        </main>

        <footer> 
            <a
            href="https://www.cachaionline.com"
            target="_blank"
            rel="noopener noreferrer"
            >
            CachaiOnline{' '}
            </a>
        </footer>
        </>
     );
}
 
export default Layout;