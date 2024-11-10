import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";
import { ButtonsBodyService } from "./services.model";

export class HttpService {
    protected axiosConfig: AxiosInstance;

    constructor(uri?: string, headers?: any) {
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

    async post(uri: string, data?: any) {
        try {
            return await this.axiosConfig.post(uri, data);
        }
        catch (e) {
            console.log(`Error al intentar hacer peticion http: ${e}`);
        }
    }
}

export const postButtonsService = async (uri: string, body: ButtonsBodyService, userToken?: string) => {
    toast.promise(async () => {
        try {
            await axios.post('https://o22r9omtvk.execute-api.us-east-2.amazonaws.com/sumeet-R_1_10/' + uri, body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                    'x-api-key': userToken
                }
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios Error:', error.response?.data || error.message);
            } else {
                console.error('Unknown Error:', error);
            }
        }
    }, {
        loading: "Call details buttons fetchin...",
        success: "Call details buttons founded",
        error: "Call details error",
    });
}