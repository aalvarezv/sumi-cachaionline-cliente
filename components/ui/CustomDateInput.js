import React, {forwardRef} from 'react';
import {Form} from 'react-bootstrap'

const CustomDateInput = forwardRef(({ value, onClick, label }, ref ) => (
    <Form.Group>
    {label && <Form.Label><small>{label}</small></Form.Label>}
    <Form.Control
            size="sm"
            onClick={onClick}
            onChange={onClick}
            value={value}
            ref={ref}
    />
    </Form.Group>
 ));
 
export default CustomDateInput;