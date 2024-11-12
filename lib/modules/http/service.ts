import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";
import { ButtonsBodyService, FormBodyService, ToastMessages } from "./services.model";

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
            console.error(`Failed on http request: ${e}`);
        }
    }
}

export const postFormService = async (uri: string, body: FormBodyService, toastMessages: ToastMessages, userToken?: string) => {
    try {
        const responsePromise = axios.post(process.env.NEXT_PUBLIC_CALLS_URL + uri, body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
                'x-api-key': userToken
            }
        });

        await toast.promise(responsePromise, {
            loading: toastMessages.loading,
            success: toastMessages.success,
            error: toastMessages.error,
        });

        const response = await responsePromise;
        return response.data || 'success';
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios Error:', error.response?.data || error.message);
            throw new Error(error.response?.data || "Request error");
        } else {
            console.error('Unknown Error:', error);
            throw new Error("Unknown Error");
        }
    }
};




export const postButtonsService = async (uri: string, body: ButtonsBodyService, toastMessages: ToastMessages, userToken?: string ) => {    
    try {
        const responsePromise = axios.post(process.env.NEXT_PUBLIC_CALLS_URL + uri, body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
                'x-api-key': userToken
            }
        });

        await toast.promise(responsePromise, {
            loading: toastMessages.loading,
            success: toastMessages.success,
            error: toastMessages.error,
        });

        const response = await responsePromise;
        return response.data || 'success';
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios Error:', error.response?.data || error.message);
            throw new Error(error.response?.data || "Request error");
        } else {
            console.error('Unknown Error:', error);
            throw new Error("Unknown Error");
        }
    }
};
