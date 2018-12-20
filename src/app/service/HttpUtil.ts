import * as httpm from 'typed-rest-client/HttpClient';
import { HttpClient } from 'typed-rest-client/HttpClient';
import { IRequestOptions } from 'typed-rest-client/Interfaces';
import * as hm from 'typed-rest-client/Handlers';

//import { proxyUrl, proxyUserName, proxyPassword, isProxyRequired } from "./../../../config/applicationConfig";
     


export class HttpUtil {

    // public static async httpGetCall(api: string, query: string): Promise<string>
    // public static async httpGetCall(api: string, query: string, authorization: string): Promise<string>
    // public static async httpGetCall(api: string, query: string, user: string, pwd: string): Promise<string>

    public static async httpGetCall(api: string, query ?: string, authorization ?: string, pwd ?: string): Promise<string> {
        let response: any;
        let http = HttpUtil.getHttpClient(authorization, pwd);
        if (authorization != null && (pwd == null || pwd == undefined)) {
            response = await http.get(api + query, { "authorization": "Basic " + authorization, "content-type": "application/json" });
        } else {
            response = await http.get(api + query, { "content-type": "application/json" });
        }

        let body = await response.readBody();
        return body;
    }
    public static async httpPostCall(api: string, payload: string, user: string, pwd: string): Promise<string>

    public static async httpPostCall(api: string, payload: string, authorization ?: string, pwd ?: string): Promise<string> {
        let response: any;
        let http = HttpUtil.getHttpClient(authorization, pwd);
        if (authorization != null && pwd == null) {
            response = await http.post(api, payload, { "authorization": "Basic " + authorization, "content-type": "application/json" });
        } else {
            response = await http.post(api, payload, { "content-type": "application/json" });
        }
        let body = await response.readBody();
        return body;
    }


    public static async httpPutCall(api: string, payload: string, user: string, pwd: string): Promise<string>

    public static async httpPutCall(api: string, payload: string, authorization ?: string, pwd ?: string): Promise<string> {
        let response: any;
        let http = HttpUtil.getHttpClient(authorization, pwd);
        if (authorization != null && pwd == null) {
            response = await http.put(api, payload, { "authorization": "Basic " + authorization, "content-type": "application/json" });
        } else {
            response = await http.put(api, payload, { "content-type": "application/json" });
        }
        let body = await response.readBody();
        return body;
    }

    public static async MShttpPostCall(api: string, payload: string, authorization ?: string, pwd ?: string): Promise<string> {
        let response: any;
        let http = HttpUtil.getHttpClient(authorization, pwd);
        if (authorization != null && pwd == null) {
            response = await http.post(api, payload, { "authorization": "Basic" + authorization, "content-type": "applicationjson" });
        } else {
            console.log("-----");
            response = await http.post(api, payload, { "content-type": "application/x-www-form-urlencoded" });
            console.log("-----", response);

        }
        let body = await response.readBody();
        console.log("-----", body);
        return body;
    }


    public static async directlineGetCall(api: string, query: string, authorization ?: string, pwd ?: string): Promise<string> {
        let response: any;
        let http = HttpUtil.getHttpClient(authorization, pwd);
        if (authorization != null && pwd == null) {
            response = await http.get(api + query, { "Authorization": "Bearer " + authorization, "content-type": "application/json" });
        } else {
            response = await http.get(api + query, { "content-type": "application/json" });
        }
        let body = await response.readBody();
        return body;
    }

    private static getHttpClient(username: string, password: string): HttpClient {
        let config: IRequestOptions = {};
        //return new httpm.HttpClient("SDCB", [new hm.BasicCredentialHandler(username, password)], config);

        if (username != null && password != null) {
            return new httpm.HttpClient("SDCB", [new hm.BasicCredentialHandler(username, password)], config);
        } else {
            return new httpm.HttpClient("SDCB", [], config);
        }
    }


}