import * as httpm from 'typed-rest-client/HttpClient';
import { IHeaders } from 'typed-rest-client/Interfaces'
import { Value } from 'ts-json-properties';

export class BISMProxy {
	
	 public static async callBismPost(url: string, postParam: string): Promise<string> {

        try {
            let http = new httpm.HttpClient("BI Bot");
            let config: IHeaders = { "Content-Type": "application/json" };
            let result = await http.post(url, postParam, config);
            // result.readBody().then(resp=>{
            //     logger.info("The value of my result in CallBismPost  in BISMService Class",resp);    
            // });
            return await result.readBody();
        }
        catch (error) {



        }
    }
	
}