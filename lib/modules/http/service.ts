export class HttpService {
    protected config: RequestInit;

    constructor(){
        this.config = {
            headers: { "Content-Type": "application/json" }
        };
    }

    async get(uri: string){
        this.config.method = "GET";
        const response = await this.request(uri);
        return response;
    }

    async post(uri: string, data?: any){
        this.config.method = "POST";
        if(data){ this.config.body = data };
        const response = await this.request(uri);
        return response;
    }

    private async request(uri: string): Promise<any>{
        try{
            const response = await fetch(uri, this.config);
            return response.json();
        }
        catch(error){
            console.log(`Fetch erro: ${error}`);
        }
    }
}
