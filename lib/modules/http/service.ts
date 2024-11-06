export class HttpService {
    async get(uri: string){
        const response = await this.request("GET", uri);
        return response;
    }

    async post(uri: string, data?: any){
        const response = await this.request("POST", uri, data);
        return response;
    }

    private async request(
        method: string,
        uri: string,
        data?: any
    ): Promise<any>{
        try{
            let options: RequestInit = {
                method,
                headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            }

            if(data){
                options = { ...options, body: JSON.stringify(data) };
            }

            const response = await fetch(uri, options);
            return await response.json();
        }
        catch(error){
            console.log(`Fetch erro: ${error}`);
        }
    }
}
