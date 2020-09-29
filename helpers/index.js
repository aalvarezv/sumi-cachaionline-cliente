import { toast } from 'react-toastify';
import Router from 'next/router';
import ToastMultiline from '../components/ui/ToastMultiline';


export const handleError = (e) => {

    console.log({e})
    let error = {
        tipo: 'error'
    }

    
    //error de servidor.
    if(!e.response){
        error = {
            ...error,
            msg: 'Algo va mal, vuelva a intentar'
        }
        toast.error(error.msg, {containerId: 'sys_msg'});

    //rescata los errores generados por validaciones sin express-validator 
    }else if(e.response.data.hasOwnProperty('msg')){

        //si es un error por token, elimina el token del localstorage.
        if(e.response.data.msg === 'TokenExpiredError' || e.response.data.msg === 'TokenMissingError'){
            localStorage.removeItem('token');
            //falta redirigir!
            Router.push('/login');
            console.log('ES NECESARIO REDIRIGIR AL LOGIN');
        }else{
             error = {
                ...error,
                msg: e.response.data.msg
            }
            toast.error(error.msg, {containerId: 'sys_msg'});
        }

       
    //rescata los errores de express-validator
    }else if(e.response.data.hasOwnProperty('errors')){

        let msgs = '';
        e.response.data.errors.forEach(error =>{
            msgs.concat(error.msg, '\n');
        });

        error = {
            ...error,
            msg: msgs
        }

        toast.error(<ToastMultiline mensajes={e.response.data.errors} />, {containerId: 'sys_msg'})
    
    }
    
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

export const rutFormat = rut => {
    let rut_format = rut.replace('-','');
    if(rut_format.length > 1){
        rut_format = `${rut_format.substring(0, rut_format.length - 1)}-${rut_format.substring(rut_format.length - 1,rut_format.length)}`;
    }
    return rut_format;
}

export const  rutEsValido = rut => {

    if (!rut || rut.trim().length < 3) return false;
    const rutLimpio = rut.replace(/[^0-9kK-]/g, "");
  
    if (rutLimpio.length < 3) return false;
  
    const split = rutLimpio.split("-");
    if (split.length !== 2) return false;
  
    const num = parseInt(split[0], 10);
    const dgv = split[1];
  
    const dvCalc = calculateDV(num);
    return dvCalc === dgv;

}
  
export const calculateDV = (rut) => {
    const cuerpo = `${rut}`;
    // Calcular Dígito Verificador
    let suma = 0;
    let multiplo = 2;
  
    // Para cada dígito del Cuerpo
    for (let i = 1; i <= cuerpo.length; i++) {
      // Obtener su Producto con el Múltiplo Correspondiente
      const index = multiplo * cuerpo.charAt(cuerpo.length - i);
  
      // Sumar al Contador General
      suma += index;
  
      // Consolidar Múltiplo dentro del rango [2,7]
      if (multiplo < 7) {
        multiplo += 1;
      } else {
        multiplo = 2;
      }
    }
  
    // Calcular Dígito Verificador en base al Módulo 11
    const dvEsperado = 11 - (suma % 11);
    if (dvEsperado === 10) return "K";
    if (dvEsperado === 11) return "0";
    return `${dvEsperado}`;
    
  }

  export const getBase64 = file => {

    return new Promise((resolve, reject) => {

        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            resolve(reader.result);
        };
        reader.onerror = function (error) {
            handleError(error)
        };
        
    })

   
 }