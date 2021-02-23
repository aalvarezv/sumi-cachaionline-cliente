import { Badge } from 'react-bootstrap'


const BadgeEstadoInvitacionRing = ({estado}) =>{
    
    switch (estado) {
        case null:
            return <Badge variant="secondary">Sin enviar</Badge>
        case 0:
            return <Badge variant="warning">Pendiente</Badge>
        case 1:
            return <Badge variant="info">Aceptada</Badge>
        case 2:
            return <Badge variant="danger">Rechazada</Badge>
    }

    return null

}

export default BadgeEstadoInvitacionRing