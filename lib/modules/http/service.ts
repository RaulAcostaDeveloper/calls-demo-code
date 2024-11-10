import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";
import { ButtonsBodyService, FormBodyService } from "./services.model";

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

export const postFormService = async (uri: string, body: FormBodyService, userToken?: string) => {
    toast.promise(async () => {
        try {
            await axios.post(process.env.NEXT_PUBLIC_CALLS_URL + uri, body, {
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
        loading: "Call details form fetchin...",
        success: "Call details form success",
        error: "Call details form error",
    });
}

export const postButtonsService = async (uri: string, body: ButtonsBodyService, userToken?: string) => {
    toast.promise(async () => {
        try {
            await axios.post(process.env.NEXT_PUBLIC_CALLS_URL + uri, body, {
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
        success: "Call details buttons success",
        error: "Call details buttons error",
    });
}