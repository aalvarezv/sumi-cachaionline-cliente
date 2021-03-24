import React from 'react'

const Logo = ({w = 30,h = 24}) => {
    return ( 
        <img
            src="/static/logo.png"
            width={w}
            height={h}
            className="d-inline-block align-top mr-1"
            alt="CachaiOnline"
        />
     )
}
 
export default Logo