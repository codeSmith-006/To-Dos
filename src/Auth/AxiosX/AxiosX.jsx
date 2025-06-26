import axios from "axios";

const AxiosX = axios.create({
    baseURL: 'http://localhost:5000'
})

let accessToken = null;

// getting access token from the provider
export let getToken = token => {
    accessToken = token;
}

AxiosX.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
})

export default AxiosX;