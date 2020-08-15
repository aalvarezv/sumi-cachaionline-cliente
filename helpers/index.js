import { toast } from 'react-toastify';

export const handleError = (e) => {
  
    let error = {
        tipo: 'error'
    }
    
    if(!e.response){
        error = {
            ...error,
            msg: 'Algo va mal, vuelva a intentar'
        }
    }else{
        error = {
            ...error,
            msg: e.response.data.msg
        }
    }

    toast.error(error.msg, {containerId: 'sys_msg'});

    return error;

}

export const debounce = (fn, delay) =>{
    let timeoutId;
    return (...args) => {
        if(timeoutId){
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            
            fn(...args)
        }, delay);
    }
}
