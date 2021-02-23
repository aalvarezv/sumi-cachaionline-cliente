import axios from 'axios'

const clienteAxios = axios.create({
    baseURL : process.env.NEXT_PUBLIC_API_URL
})

export default clienteAxios