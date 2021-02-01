import React, {forwardRef} from 'react'
import {Form} from 'react-bootstrap'

const CustomDateInput = forwardRef(({ value, onClick, onBlur, isInvalid, label }, ref ) => (
    <>
    {label && <Form.Label>{label}</Form.Label>}
    <Form.Control
        size="md"
        className="w-100"
        onClick={onClick}
        onChange={onClick}
        value={value}
        isInvalid={isInvalid}
        ref={ref}
    />
    </>
 ))
 
export default CustomDateInput