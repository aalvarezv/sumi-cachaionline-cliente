import React, {useEffect, useState} from 'react'
import { useDropzone } from 'react-dropzone'
import Spinner from './Spinner'

const dropzoneStyle = {
    width: '100%',
    height: '100%',
    minHeight: '150px',
    border : "3px dashed #DDE1E5",
    color: "#C0C0C0",
    textAlign: "center"
}

function Uploader({titulo, index, getArchivos}) {

  const [uploading, setUploading] = useState(false)

  const {getRootProps, getInputProps} = useDropzone({
    accept: "image/*,audio/*,video/*,application/*",
    multiple: false,
    onDrop: acceptedFiles => {
      
      acceptedFiles.forEach((file) => {
        const reader = new FileReader()
   
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onloadstart = () => setUploading(true)
        reader.onloadend = () => setUploading(false)
        
        reader.readAsArrayBuffer(file)
      })

      if(acceptedFiles.length > 0){
        //retorna los archivos al componente superior.
        if(index){
            getArchivos(index, acceptedFiles)
        }else{
            getArchivos(acceptedFiles)
        }
          
      }
    },

  })

  return (
      <>
      {!uploading
       ?
        <div {...getRootProps({className: 'dropzone'})} style={dropzoneStyle}>
            <input {...getInputProps()} />
            <small>{titulo}{uploading}</small>
        </div>
      :
        <Spinner /> 
      }
      </>
  )
}

export default Uploader