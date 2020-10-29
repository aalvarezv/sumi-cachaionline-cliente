import React from 'react';
import {Modal, Image} from 'react-bootstrap';

const ModalImageView = ({img_url, show, handleClose}) => {

    return ( 
        <Modal show={show} onHide={handleClose}>
        <Modal.Body>
         <Image src={img_url} style={{width: '100%'}}/> 
        </Modal.Body>
        </Modal>
     );
}
 
export default ModalImageView;