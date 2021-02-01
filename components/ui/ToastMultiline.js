import React from 'react'

const ToastMultiline = ({mensajes}) => {

    return (
        <div>
            {mensajes.map((mensaje, index) => <div key={index} className="py-0">&nbsp;{mensaje.msg}<hr className="my-1"/></div>)} 
        </div> 
    )
}
 
export default ToastMultiline