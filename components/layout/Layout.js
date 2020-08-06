import React from 'react';
import Header from './Header';


const Layout = props => {
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
                position: fixed;
                bottom: 0;
                width: 100%;
                background-color: black;
                text-align:center;
            }
            footer > a{
                color:white;
            }
      `}</style>
        </>
     );
}
 
export default Layout;