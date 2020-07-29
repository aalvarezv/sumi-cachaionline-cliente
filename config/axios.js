import axios from 'axios'

const clienteAxios = axios.create({
    baseURL : "http://localhost:3001"//process.env.REACT_APP_BACKEND_URL
})

export default clienteAxios