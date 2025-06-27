import axios from "axios";

const AxiosX = axios.create({
    baseURL: 'https://to-dos-server.vercel.app'
})

let accessToken = null;

// getting access token from the provider
// eslint-disable-next-line react-refresh/only-export-components
export let getToken = token => {
    accessToken = token;
    // console.log("Token: ", accessToken)
}


AxiosX.interceptors.request.use( async (config)=> {
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
})

export default AxiosX;