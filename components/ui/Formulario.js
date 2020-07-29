import styled from 'styled-components';

export const Boton = styled.a`
    font-weight: 700;
    text-transform: uppercase;
    font-family: 'PT Sans', sans-serif;
    border: 1px solid;
    padding: .8rem 2rem;
    background-color: ${props => props.primary ? 'var(--primary)' : 'var(--white)'};
    color: ${props => props.primary ? 'var(--white)' : 'var(--primary)'};

    &:last-of-type{
        margin-right: 0;
    }
    &:hover{
        cursor: pointer;
    }
`;

export const Formulario = styled.form`
    width: 95%;
    max-width: 600px;
    margin: 0 auto;
`

export const Campo = styled.div`
    display:flex;
    margin-bottom: 1.5rem;
    align-items: center;
    
    label{
        flex: 0 0 100px;
        font-size: 1.8rem;
    }
    input{
        flex: 1;
        padding: 1rem;
        background-color: #F7FAFC;
        border: 1px solid var(--gray-1)
    }

`;

export const InputSubmit = styled.input`
    width: 100%;
    font-weight: 700;
    font-size: 1.8rem;
    text-transform: uppercase;
    border: 1px solid;
    padding: .8rem 2rem;
    background-color: ${props => props.primary ? 'var(--primary)' : 'var(--white)'};
    color: ${props => props.primary ? 'var(--white)' : 'var(--primary)'};
`;

