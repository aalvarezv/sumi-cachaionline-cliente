import React from 'react'
import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';

const ButtonBack = () => {

    const router = useRouter();

    return (
        <Button 
            className="ml-3"
            variant="outline-primary"
            size="lg"
            className="btn-block"
            onClick={() => {
                router.back();
            }}
        >Volver</Button>
    )
}

export default ButtonBack
