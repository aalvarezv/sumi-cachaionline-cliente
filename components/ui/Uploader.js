import React, {useEffect, useState} from 'react';
import { useDropzone } from 'react-dropzone';
import { Container, Row, Col } from 'react-bootstrap';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  width: 100,
  height: 100,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

const dropzoneStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "5px",
    width: "100%",
    height: "100%",
    border : "3px dashed #DDE1E5",
    color: "#C0C0C0",
    textAlign: "center"
};


function Uploader({titulo, index, getArchivos}) {

  const [files, setFiles] = useState([]);

  
  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/jpeg, image/png',
    multiple: false,
    onDrop: acceptedFiles => {
      console.log(acceptedFiles);
      //Si son archivos que son aceptados entonces lo deja pasar.
      if(acceptedFiles.length > 0){
        //retorna los archivos al componente superior.
        if(index){
          getArchivos(index, acceptedFiles);
        }else{
          getArchivos(acceptedFiles);
        }
        setFiles(acceptedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        })));
      }
    
    }
  });

  
  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => {
        URL.revokeObjectURL(file.preview)
    }
    );

  }, [files]);

  return (
      <section
        style={{width: '100%', height: '100%'}}
      >
          <div {...getRootProps({className: 'dropzone'})} style={dropzoneStyle}>
              <input {...getInputProps()} />
              <p>{titulo}</p>
          </div>
      </section>
  );
}

export default Uploader;