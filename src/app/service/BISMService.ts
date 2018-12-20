import { Session, Prompts, Message, ListStyle, EntityRecognizer, IDialogWaterfallStep } from 'botbuilder';
import * as httpm from 'typed-rest-client/HttpClient';
import { IHeaders } from 'typed-rest-client/Interfaces'
import * as  Collections from 'typescript-collections';
import { Value } from 'ts-json-properties';
import { ServerHandler } from '../../middleware/ServerHandlers';
import { CustomError } from '../../util/ErrorHandlingUtil';
import { HttpService } from './HttpService';
export class BISMService extends HttpService {
    static logger = ServerHandler.getLogger();

    @Value("bism.provider.bism.serviceuri")
    serviceuri: string;
    @Value("bism.provider.bism.tables.getSearchResulturi")
    getSearchResulturi: string;
    @Value("bism.provider.bism.tables.getOutagesuri")
    getOutagesuri: string;
    @Value("bism.provider.bism.tables.getAnsweruri")
    getAnsweruri: string;
    @Value("bism.provider.bism.tables.createClienturi")
    createClienturi: string;
    @Value("bism.provider.bism.tables.createCalluri")
    createCalluri: string;
    @Value("bism.provider.bism.tables.closeCalluri")
    closeCalluri: string;
    @Value("bism.provider.bism.tables.updateCalluri")
    updateCalluri: string;
    @Value("bism.provider.bism.tables.getMyTicketsuri")
    getMyTicketsuri: string;
    @Value("bism.provider.bism.tables.getKnowledgeuri")
    getKnowledgeuri: string;
    @Value("bism.provider.bism.tables.cancelTicketuri")
    cancelTicketuri: string;
    @Value("bism.provider.bism.tables.forwardTicketuri")
    forwardTicketuri: string;
    @Value("bism.provider.bism.tables.getPreferedLanguage")
    getPreferedLanguage: string;
    @Value("bism.provider.bism.tables.getUserInfo")
    getUserInfo: string;
    @Value("bism.provider.bism.tables.updateTicketDescription")
    updateTicketDescription: string;

    static instance: BISMService;

    public static getInstance(): BISMService {
        if (this.instance == null) {
            this.instance = new BISMService();
        }
        return this.instance;
    }


    /*-----------------------getAnser-------------------------------------------------------------------------------*/

    async getAnswer(searchParam: string): Promise<string> {
        BISMService.logger.info("Entered :BISMService :[getAnswer]");
        try {
            let getAnswerData = await this.callBismPost(this.serviceuri + this.getAnsweruri, searchParam);
            BISMService.logger.debug("Service Result : BISMService: [getAnswer]", getAnswerData);
            BISMService.logger.info("Exit :BISMService :[getAnswer]");
            console.log("Tushar AnswerData : " + getAnswerData);
            return getAnswerData;
        }
        catch (error) {
            BISMService.logger.error("Error :BISMService :[getAnswer]");
            throw new CustomError(error.message, "getAnswer");
        }
    }

    /*-----------------------CreateCall-------------------------------------------------------------------*/

    async createCall(callData: string): Promise<string> {
        BISMService.logger.info("Entered :BISMService :[createCall]");
        try {

            let createCallData = await this.callBismPost(this.serviceuri + this.createCalluri, callData);
            BISMService.logger.debug("Service Result :BISMService: [createCall]", createCallData);
            BISMService.logger.info("Exit :BISMService :[createCall]");
            return createCallData;
        }
        catch (error) {
            BISMService.logger.error("Error :BISMService :[createCall]");
            throw new CustomError(error.message, "createCall");

        }
    }


    /* -------------------------------Close Call----------------------------------------------------------------- */

    async closeCall(callData: string): Promise<string> {
        BISMService.logger.info("Entered :BISMService :[closeCall]");

        try {
            let closeCallData = await this.callBismPost(this.serviceuri + this.closeCalluri, callData);
            BISMService.logger.debug("Service Result :BISMService: [closeCall]", closeCallData);
            BISMService.logger.info("Exit :BISMService :[closeCall]");
            return closeCallData;
        }
        catch (error) {
            BISMService.logger.error("Error :BISMService :[closeCall]");
            throw new CustomError(error.message, "closeCall");
        }
    }

    /* --------------------------Update Call----------------------------------------------------------------------- */

    async updateCall(callData: string): Promise<string> {
        BISMService.logger.info("Entered :BISMService :[updateCall]");
        try {
            let updateCallData = await this.callBismPost(this.serviceuri + this.updateCalluri, callData);
            BISMService.logger.debug("Service Result : BISMService: [updateCall]", updateCallData);
            BISMService.logger.info("Exit :BISMService :[updateCall]");
            return updateCallData;
        }
        catch (error) {
            BISMService.logger.error("Error :BISMService :[updateCall]");
            throw new CustomError(error.message, "updateCall");
        }
    }

    /* ---------------------------Get My Ticket---------------------------------------------------------------------- */

    async getMyTickets(payload: string): Promise<string> {
        BISMService.logger.info("Entered :BISMService :[getMyTickets]");
        try {
            let myTicketsData = await this.callBismPost(this.serviceuri + this.getMyTicketsuri, payload);
            BISMService.logger.debug("Service Result : BISMService: [getMyTickets]", myTicketsData);
            BISMService.logger.info("Exit :BISMService :[getMyTickets]");
            return myTicketsData;
        }
        catch (error) {
            BISMService.logger.error("Error :BISMService : [getMyTickets]");
            throw new CustomError(error.message, "getMyTickets");

        }
    }
    
     /* ---------------------------Get My Last Open Ticket---------------------------------------------------------------------- */

    async getMyLastOpenTicket(payload: string): Promise<string> {
        BISMService.logger.info("Entered :BISMService :[getMyLastOpenTicket]");
        try {
            let myTicketsData = await this.callBismPost(this.serviceuri + this.getMyTicketsuri, payload);
            BISMService.logger.debug("Service Result : BISMService: [getMyLastOpenTicket]", myTicketsData);
            BISMService.logger.info("Exit :BISMService :[getMyLastOpenTicket]");
           return myTicketsData;
        }
        catch (error) {
            BISMService.logger.error("Error :BISMService : [getMyLastOpenTicket]");
            throw new CustomError(error.message, "getMyTickets");

        }
    }
    
    /* ---------------------------getSearchResult---------------------------------------------------------------------- */
    async getSearchResult(payload: string): Promise<string> {
        BISMService.logger.info("Entered :BISMService :[getSearchResult]");
        try {
            let myTicketsData = await this.callBismPost(this.serviceuri + this.getKnowledgeuri, payload);
            BISMService.logger.debug("Service Result : BISMService:[getSearchResult]", myTicketsData);
            BISMService.logger.info("Exit :BISMService :[getSearchResult]");
            return myTicketsData;
        }
        catch (error) {
            BISMService.logger.error("Error :BISMService :[getSearchResult]");
            throw new CustomError(error.message, "getSearchResult");

        }
    }

    /*-----------------------BISMPost Method-------------------------------*/


    /* ---------------------------CancelTicket---------------------------------------------------------------------- */
    async cancelTicketResult(payload: string): Promise<string> {
        BISMService.logger.info("Entered :BISMService :[cancelTicketResult]");
        try {
            let myTicketsData = await this.callBismPost(this.serviceuri + this.cancelTicketuri, payload);
            BISMService.logger.debug("Service Result :BISMService: [cancelTicketResult]", myTicketsData);
            BISMService.logger.info("Exit :BISMService :[cancelTicketResult]");
            return myTicketsData;
        }
        catch (error) {
            BISMService.logger.error("Error :BISMService :[cancelTicketResult]");
            throw new CustomError(error.message, "cancelTicketResult");

        }
    }

    /* ---------------------------ForwardTicket---------------------------------------------------------------------- */
    async forwardTicketResult(payload: string): Promise<string> {
        BISMService.logger.info("Entered :BISMService :[forwardTicketResult]");
        try {
            let myTicketsData = await this.callBismPost(this.serviceuri + this.forwardTicketuri, payload);
            BISMService.logger.debug("Service Result : BISMService:[forwardTicketResult]", myTicketsData);
            BISMService.logger.info("Exit :BISMService :[forwardTicketResult]");
            return myTicketsData;
        }
        catch (error) {
            BISMService.logger.error("Error :BISMService :[forwardTicketResult]");
            throw new CustomError(error.message, "forwardTicketResult");

        }
    }

    /* ---------------------------getPreferedLanguage---------------------------------------------------------------------- */
    async getPreferedLanguageResult(userID: string): Promise<string> {
        BISMService.logger.info("Entered :BISMService :[getPreferedLanguageResult]");
        var a = JSON.stringify({ "UserID": userID });
        try {
            let preferedLanguage = await this.callBismPost(this.serviceuri + this.getPreferedLanguage, a);
            BISMService.logger.debug("Service Result :BISMService: [getPreferedLanguageResult]", preferedLanguage);
            BISMService.logger.info("Exit :BISMService :[getPreferedLanguageResult]");
            return preferedLanguage;
        }
        catch (error) {
            BISMService.logger.error("Error :BISMService :[getPreferedLanguageResult]");
            throw new CustomError(error.message, "getPreferedLanguageResult");

        }
    }



    async getUserInfoResult(userID: string): Promise<string> {
        BISMService.logger.info("Entered :BISMService :[getUserInfoResult]");
        var a = JSON.stringify({ "UserID": userID });
        try {
            let userInfo = await this.callBismPost(this.serviceuri + this.getUserInfo, a);
            BISMService.logger.debug("Service Result : BISMService:[getUserInfoResult]", userInfo);
            BISMService.logger.info("Exit :BISMService :[getUserInfoResult]");
            return userInfo;
        }
        catch (error) {
            BISMService.logger.error("Error :BISMService :[getUserInfoResult]");
            throw new CustomError(error.message, "getUserInfoResult");

        }
    }
    async  getUpdateTicketDescription(payload:string): Promise<string> {
        BISMService.logger.info("Entered :BISMService :[getUpdateTicketDescription]");
        try {
            let data = await this.callBismPost(this.serviceuri + this.updateTicketDescription, payload);
            BISMService.logger.debug("Service Result : BISMService:[getUpdateTicketDescription]", data);
            BISMService.logger.info("Exit :BISMService :[getUpdateTicketDescription]");
            return data;
        }
        catch (error) {
            BISMService.logger.error("Error :BISMService :[getUserInfoResult]");
            throw new CustomError(error.message, "getUserInfoResult");
        }
    }
    
     /* ---------------------------getWeatherInfoResult (Added by Tushar for weather use case)---------------------------------------------------------------------- */
    // async getWeatherInfoResult(countryName: string): Promise<string> {
    //     BISMService.logger.info("Entered :BISMService :[getWeatherInfoResult]");

        
    //     try {
    //         let weatherInfo = await this.callBismPost(this.getWeatherInfo, countryName);
    //         BISMService.logger.debug("Service Result : BISMService:[getWeatherInfoResult]", weatherInfo);
    //         BISMService.logger.info("Exit :BISMService :[getWeatherInfoResult]");
    //         return weatherInfo;
    //     }
    //     catch (error) {
    //         BISMService.logger.error("Error :BISMService :[getWeatherInfoResult]");
    //         throw new CustomError(error.message, "getWeatherInfoResult");

    //     }
    // }
}