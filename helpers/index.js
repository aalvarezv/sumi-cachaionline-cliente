import Router from 'next/router'
import { toast } from 'react-toastify'
import axios from 'axios'
import ToastMultiline from '../components/ui/ToastMultiline'


export const handleError = (e) => {

    console.log({e})
    //error de servidor.
    if(!e.response){
       
        toast.error('Algo va mal, vuelva a intentar', {containerId: 'sys_msg'})

    //rescata los errores generados por validaciones sin express-validator 
    }else if(e.response.data.hasOwnProperty('msg')){

        //si es un error por token, elimina el token del localstorage.
        if(e.response.data.msg === 'TokenExpiredError' || e.response.data.msg === 'TokenMissingError'){
            Router.push({
                pathname: '/logout',
            })
        }else{
            toast.error(e.response.data.msg, {containerId: 'sys_msg'})
        }

    //rescata los errores de express-validator
    }else if(e.response.data.hasOwnProperty('errors')){

        toast.error(<ToastMultiline mensajes={e.response.data.errors} />, {containerId: 'sys_msg'})
    
    }
    
}

export const debounce = (fn, delay) =>{
    let timeoutId
    return (...args) => {
        if(timeoutId){
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            
            fn(...args)
        }, delay)
    }
}

export const rutFormat = rut => {
    let rut_format = rut.replace('-','')
    if(rut_format.length > 1){
        rut_format = `${rut_format.substring(0, rut_format.length - 1)}-${rut_format.substring(rut_format.length - 1,rut_format.length)}`
    }
    return rut_format
}

export const  rutEsValido = rut => {

    if (!rut || rut.trim().length < 3) return false
    const rutLimpio = rut.replace(/[^0-9kK-]/g, "")
  
    if (rutLimpio.length < 3) return false
  
    const split = rutLimpio.split("-")
    if (split.length !== 2) return false
  
    const num = parseInt(split[0], 10)
    const dgv = split[1]
  
    const dvCalc = calculateDV(num)
    return dvCalc === dgv

}
  
export const calculateDV = (rut) => {
    const cuerpo = `${rut}`
    // Calcular Dígito Verificador
    let suma = 0
    let multiplo = 2
  
    // Para cada dígito del Cuerpo
    for (let i = 1; i <= cuerpo.length; i++) {
      // Obtener su Producto con el Múltiplo Correspondiente
      const index = multiplo * cuerpo.charAt(cuerpo.length - i)
  
      // Sumar al Contador General
      suma += index
  
      // Consolidar Múltiplo dentro del rango [2,7]
      if (multiplo < 7) {
        multiplo += 1
      } else {
        multiplo = 2
      }
    }
  
    // Calcular Dígito Verificador en base al Módulo 11
    const dvEsperado = 11 - (suma % 11)
    if (dvEsperado === 10) return "K"
    if (dvEsperado === 11) return "0"
    return `${dvEsperado}`
    
}

export const getBase64 = file => {

    return new Promise((resolve, reject) => {

        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function () {
            resolve(reader.result)
        }
        reader.onerror = function (error) {
            handleError(error)
        }
        
    })

}

export const letras = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 
    'Q', 'R', 'S', 'U', 'V', 'W', 'X', 'Y',
    'Z' 
]

export const getNumeroFilaTabla = (index, pagina_actual, resultados_por_pagina) => {

    let numFila = index + 1 // 1 al 10
    if(pagina_actual === 2){ // 10 al 20
        numFila = numFila + resultados_por_pagina
    }else if(pagina_actual > 2){ //20 a N
        numFila = numFila + (resultados_por_pagina * (pagina_actual - 1))
    }
    return numFila

}

export const getBase64FromURL = async url => {

    
    let file = await axios.get(url, {
        responseType: 'arraybuffer'
    })

   
    //console.log(`CONTENT TYPE ${file.headers['content-type']}`)
    let base64 = Buffer.from(file.data).toString('base64')
    return `data:${file.headers['content-type']}base64,${base64}`
}

export const emailValido = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase())
}

export const getMeta = (url) => {

    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = url;
        img.onload = function() { 
            resolve({
                width: this.width, 
                height: this.height
            })
        }
    })

    
}

export const validURL = (url) => {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if(!regex .test(url)) {
      return false;
    } else {
      return true;
    }
}