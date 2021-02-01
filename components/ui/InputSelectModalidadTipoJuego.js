import React, {useState, useEffect} from 'react';
import { Form } from 'react-bootstrap';
import  clienteAxios from '../../config/axios';
import { handleError } from '../../helpers';

const InputSelectModalidadTipoJuego = props => {

      const [modalidadesTipoJuego, setModalidadesTipoJuego] = useState([]);
      const {codigo_tipo_juego} = props

        useEffect(() => {
            const listarModalidades = async () => {
                try{
                    const resp = await clienteAxios.get(`/api/modalidades/listar/${codigo_tipo_juego}`);
                    console.log(resp.data.modalidadesTipoJuego)
                    setModalidadesTipoJuego(resp.data.modalidadesTipoJuego);
                }catch(e){
                    handleError(e);
                }
            }
            
            listarModalidades();
            
        }, [codigo_tipo_juego])
    return (
        <Form.Control
            {...props}
        >
            <option key="0" value="0">{props.label ? props.label : 'SELECCIONE  MODALIDAD'}</option>
            {modalidadesTipoJuego.map(modalidadTipoJuego => {
                const {modalidad} = modalidadTipoJuego
                return (<option key={modalidad.codigo} value={modalidad.codigo}>
                    {modalidad.descripcion}
                </option>)
            })}
        </Form.Control>
      );
}

export default InputSelectModalidadTipoJuego