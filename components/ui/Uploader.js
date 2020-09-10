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
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "150px",
    border : "2px dashed #DDE1E5",
    color: "#C0C0C0", 
};


function Uploader({titulo, getArchivos}) {

  const [files, setFiles] = useState([]);

  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    multiple: false,
    onDrop: acceptedFiles => {
      //retorna los archivos a un componente superior.
      getArchivos(acceptedFiles);

      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    
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
    <>
    {/*<Container fluid>
    //      <Row>
    //         <Col>*/}
                <section>
                    <div {...getRootProps({className: 'dropzone'})} style={dropzoneStyle}>
                        <input {...getInputProps()} />
                        <p>{titulo}</p>
                    </div>
                </section>
             {/*</Col>
            <Col style={{ backgroundColor: 'white' }}>  
                <div style={thumbsContainer}>
                    {thumbs}
                </div>
            </Col> 
        </Row>
    </Container>*/
    } 
    </>
  );
}

export default Uploader;