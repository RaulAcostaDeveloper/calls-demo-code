import axios, { AxiosInstance } from "axios";

export class HttpService {
    protected axiosConfig: AxiosInstance;

    constructor(uri?: string, headers?: any){
        const url = !uri ? process.env.URI_BACKEND : uri;

        this.axiosConfig = axios.create({
            baseURL: url,
            headers: {
                "Content-Type": "application/json",
                ...headers
            },
            responseType: "json"
        });
    }

    async post(uri: string, data?: any){
        try{
            return await this.axiosConfig.post(uri, data);
        }
        catch(e){
            console.log(`Error al intentar hacer peticion http: ${e}`);
        }
    }
}
