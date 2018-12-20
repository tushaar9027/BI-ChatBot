import { ServerHandler } from '../../middleware/ServerHandlers';
import * as httpm from 'typed-rest-client/HttpClient';
import { IHeaders } from 'typed-rest-client/Interfaces';
import { CustomError } from '../../util/ErrorHandlingUtil';

export class HttpService {
    static logger = ServerHandler.getLogger();

    async callBismPost(url: string, postParam: string): Promise<string> {
        HttpService.logger.info("Entered :HttpService:[callBismPost]");
        try {
            let http = new httpm.HttpClient("BIBot");
            let config: IHeaders = { "Content-Type": "application/json" };

            var startTime = Date.now();

            let result = await http.post(url, postParam, config);

            var endTime = Date.now();
            HttpService.logger.debug("This is the time taken in MiliSeconds for creating BISM Call : " + url + "\n", endTime - startTime);
            HttpService.logger.info("Exit :HttpService:[callBismPost]");
            return await result.readBody();
        }
        catch (error) {
            HttpService.logger.error("Error:HttpService:[callBismPost]");
            throw new CustomError(error.message, "callBismPost");

        }
    }
    async callGet(url: string): Promise<string> {
        HttpService.logger.info("Entered :HttpService:[callGet]");
        let http = new httpm.HttpClient("BIBot");
        let config: IHeaders = { "Content-Type": "application/json" };
        let result = await http.get(url, config);
        HttpService.logger.info("Exit :HttpService:[callGet]");
        return result.readBody();
    }

    async callAuthGet(url: string, token: string): Promise<string> {
        HttpService.logger.info("Entered :HttpService:[callAuthGet]");
        let http = new httpm.HttpClient("BIBot");
        let config: IHeaders = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        };
        let result = await http.get(url, config);
        HttpService.logger.info("Exit :HttpService:[callAuthGet]");
        return result.readBody();
    }
    async callPost(url: string, token: string, postParam: string): Promise<string> {
        HttpService.logger.info("Entered :HttpService:[callPost]");
        let http = new httpm.HttpClient("BIBot");
        let config: IHeaders = {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": token,
            "X-ClientTraceId": this.get_guid()
        };
        let result = await http.post(url, postParam, config);
        HttpService.logger.info("Exit :HttpService:[callPost]");
        return await result.readBody();
    }

    get_guid() {
        HttpService.logger.info("Entered :HttpService:[get_guid]");
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            HttpService.logger.info("Exit :HttpService:[callPost]");
            return v.toString(16);
        });
    }

}