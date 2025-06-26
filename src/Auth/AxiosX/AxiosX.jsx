import axios from "axios";

const AxiosX = axios.create({
    baseURL: 'http://localhost:5000'
})

let accessToken = null;

// getting access token from the provider
// eslint-disable-next-line react-refresh/only-export-components
export let getToken = token => {
    accessToken = token;
    console.log("Token: ", accessToken)
}


AxiosX.interceptors.request.use( async (config)=> {
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
})

export default AxiosX;