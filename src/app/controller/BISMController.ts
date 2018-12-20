
import { ServerHandler } from '../../middleware/ServerHandlers';
import { BISMService } from '../service/BISMService';
import { Session } from 'botbuilder';
import { CustomError } from '../../util/ErrorHandlingUtil';
import { BIBotConnector } from '../bot/connector/BIBotConnector';
import { PorpertiesUtil } from '../../util/PropertiesUtil';
import { CardFactory } from '../bot/card/CardFactory';
import { BISMPayloadUtil } from '../bot/data/BISMPayloadUtil';


export class BISMController {
    static logger = ServerHandler.getLogger();
    public static async getPreferedLanguage(userID: string, session: Session): Promise<any> {
        try {
            BISMController.logger.info("Entered: BISMController : [`getPreferedLanguage`] ");
            let bismService: BISMService = BISMService.getInstance();
            let responsePreferedLang = await bismService.getPreferedLanguageResult(userID);
            var preferedLang = String(JSON.parse(responsePreferedLang).Data[0].LanguageName).toLowerCase();
            //var preferedLang = "en";
            BISMController.logger.debug("preferedLanguage: BISMController : [getPreferedLanguage] ", preferedLang);
            let responseUserInfo = await bismService.getUserInfoResult(userID);
            var userCountry = String(JSON.parse(responseUserInfo).Data[0].Country).toUpperCase();
            //var userCountry = "DE";
            session.privateConversationData.phoneNumber=String(JSON.parse(responseUserInfo).Data[0].OfficePhone);
            BISMController.logger.debug("preferedCountry: BISMController : [getPreferedLanguage] ", userCountry);
            var userPreferedData = { country: userCountry, language: preferedLang };
            BISMController.logger.debug("userPreferedData: BISMController : [getPreferedLanguage] ", userPreferedData);
            BISMController.logger.info("Exit: BISMController : [getPreferedLanguage] ");
            return userPreferedData;
        }
        catch (error) {
            session.send("<i><font color='red'>Sorry! The Chat Service is currently unavailable.</font></i>");
            session.send("<b>We are working on restoring the Chat Service as soon as possible.</b>".fontcolor('green'));
            session.send("Please check out the http://mysupport page to look for support alternatives.")
            BISMController.logger.info("Error: BISMController : getPreferedLanguage ", error);
            throw new CustomError(error.message, "getPreferedLanguage");
        }
    }
    public static async retreiveAnswer(intent: string, entities: any, session: Session, userMsg: any) {
    try {
        BISMController.logger.info("Entered: BISMController : [retrieveAnswer]");
        let entity = BISMPayloadUtil.parseEntities(entities);
        let payload = null;
        if (entity != null && entity.length > 0 && entity[0].entityName != entity[0].resolution[0]) {
            payload = BISMPayloadUtil.getAnswerPayload(intent, entity[0].resolution[0], session.privateConversationData.preferredLanguage, session.userData.userID);
        } else if (entity != null && entity.length > 0 && entity[0].entityName == entity[0].resolution[0]) {
            payload = BISMPayloadUtil.getAnswerPayload(intent, entity[0].entityName, session.privateConversationData.preferredLanguage, session.userData.userID);
        } else {
            payload = BISMPayloadUtil.getAnswerPayload(intent, '', session.privateConversationData.preferredLanguage, session.userData.userID);
        }
        BISMController.logger.debug("Payload : BISMController : [retrieveAnswer]", payload);
        let bismService: BISMService = BISMService.getInstance();
        let responseGetAnswer = await bismService.getAnswer(payload);
        BISMController.logger.info("Exit: BISMController : [retrieveAnswer]");
        return responseGetAnswer;
    }

    catch (error) {
        session.send("Sorry! The Chat Service is currently unavailable.");
        session.send("We are working on restoring the Chat Service as soon as possible.")
        session.send("Please check out the http://mysupport page to look for support alternatives.")
        BISMController.logger.info("Error: BISMController : retrieveAnswer ", error);
        throw new CustomError(error.message, "retreiveAnswer");
    }
}

    public static async createCallQnA(intent: string, entities: any, description: any, session: Session) {
    BISMController.logger.info("Entered: BISMController : [createCallQnA]");
    try {
        let entity = BISMPayloadUtil.parseEntities(entities);
        let payload = null;
        if (entity != null && entity.length > 0) {
            payload = BISMPayloadUtil.getCallPayload(description, intent, '', session.dialogData.configItem + ' ' + entity[0].entityName, 'Urgent', session.userData.userID);
        } else {
            payload = BISMPayloadUtil.getCallPayload(description, intent, '', session.dialogData.configItem, 'Urgent', session.userData.userID);
        }
        BISMController.logger.debug("Payload : BISMController : [retrieveAnswer]", payload);
        let bismService: BISMService = BISMService.getInstance();
        let response = await bismService.createCall(payload);
        BISMController.logger.info("Exit: BISMController : [createCallQnA]");
        return JSON.parse(response).CallID;

    }
    catch (err) {
        session.send("Sorry! The Chat Service is currently unavailable.");
        session.send("We are working on restoring the Chat Service as soon as possible.")
        session.send("Please check out the http://mysupport page to look for support alternatives.")
        BISMController.logger.info("Error: BISMController : createCallQnA ", err);
        throw new CustomError(err.message, "createCallQnA");
    }
}

    public static async createCall(intent: string, entities: any, description: any, session: Session) {
    try {
        BISMController.logger.info("Entered: BISMController : [createCall]");
        let entity = BISMPayloadUtil.parseEntities(entities);
        let payload = null;
        if (entity != null) {
            payload = BISMPayloadUtil.getCallPayload(description, intent, '', entity[0].entityName + ' ' + entity[0].entityName, 'Urgent', session.userData.userID);
        } else {
            payload = BISMPayloadUtil.getCallPayload(description, intent, '', '' + '', 'Urgent', session.userData.userID);
        }
        BISMController.logger.debug("Payload : BISMController : [createCall]", payload);
        let bismService: BISMService = BISMService.getInstance();
        let response = bismService.createCall(payload);
        BISMController.logger.info("Exit: BISMController : [createCall]");
        return response;
    }
    catch (error) {
        session.send("Sorry! The Chat Service is currently unavailable.");
        session.send("We are working on restoring the Chat Service as soon as possible.")
        session.send("Please check out the http://mysupport page to look for support alternatives.")
        BISMController.logger.info("Error: BISMController : createCall ", error);
        throw new CustomError(error.message, "createCall");
    }
}

public static async closeCall(callId: string, addInfo: any, session: Session, configItem:string) {
    try {
        BISMController.logger.info("Entered: BISMController : [closeCall] ");
        let payload = BISMPayloadUtil.getCloseTicketPayload(callId, addInfo, session.userData.userID, configItem);
        BISMController.logger.debug("Payload : BISMController : [closeCall]", payload);
        let bismService: BISMService = BISMService.getInstance();
        let response = await bismService.closeCall(payload);
        BISMController.logger.info("Exit: BISMController : [closeCall] ");
        return response;
    }
    catch (error) {
        session.send("Sorry! The Chat Service is currently unavailable.");
        session.send("We are working on restoring the Chat Service as soon as possible.")
        session.send("Please check out the http://mysupport page to look for support alternatives.")
        BISMController.logger.info("Error: BISMController : closeCall ", error);
        throw new CustomError(error.message, "closeCall");
    }
}


    public static async updateCall(callId: string, addInfo: string, configItem: string, session: Session) {
    try {
        BISMController.logger.info("Entered : BISMController : [updateCall] ");
        let payload = BISMPayloadUtil.getUpdateTicketPayload(callId, addInfo, configItem, session, session.userData.userID);
        BISMController.logger.debug("Payload : BISMController : [updateCall]", payload);
        let bismService: BISMService = BISMService.getInstance();
        let response = await bismService.updateCall(payload);
        BISMController.logger.info("Exit : BISMController : [updateCall] ");
        return response;
    }
    catch (error) {
        session.send("Sorry! The Chat Service is currently unavailable.");
        session.send("We are working on restoring the Chat Service as soon as possible.")
        session.send("Please check out the http://mysupport page to look for support alternatives.")
        BISMController.logger.info("Error: BISMController : updateCall", error);
        throw new CustomError(error.message, "updateCall");
    }
}

    public static async getMyTickets(userID: string, callId: string, status: string, session: Session) {
    try {
        BISMController.logger.info("Entered :BISMController : [getMyTickets] ");
        let payload = BISMPayloadUtil.getMyTicketPayload(session, userID, callId, status);
        BISMController.logger.debug("Payload : BISMController : [getMyTickets]", payload);
        let bismService: BISMService = BISMService.getInstance();
        let response = await bismService.getMyTickets(payload);
        BISMController.logger.info("Exit : BISMController : [getMyTickets] ");
        return response;
    }
    catch (error) {
        session.send("Sorry! The Chat Service is currently unavailable.");
        session.send("We are working on restoring the Chat Service as soon as possible.")
        session.send("Please check out the http://mysupport page to look for support alternatives.")
        BISMController.logger.info("Error: BISMController : getMyTickets ", error);
        throw new CustomError(error.message, "getMyTickets");
    }
}

public static async getMyLastOpenTicket(userID: string, callId: string, status: string, session: Session) {
    try {
        BISMController.logger.info("Entered :BISMController : [getMyTickets] ");
        let payload = BISMPayloadUtil.getMyLastTicketPayload(session, userID, callId, status);
        BISMController.logger.debug("Payload : BISMController : [getMyTickets]", payload);
        let bismService: BISMService = BISMService.getInstance();
        let response = await bismService.getMyLastOpenTicket(payload);
        BISMController.logger.info("Exit : BISMController : [getMyTickets] ");
        return response;
    }
    catch (error) {
        session.send("Sorry! The Chat Service is currently unavailable.");
        session.send("We are working on restoring the Chat Service as soon as possible.")
        session.send("Please check out the http://mysupport page to look for support alternatives.")
        BISMController.logger.info("Error: BISMController : getMyTickets ", error);
        throw new CustomError(error.message, "getMyTickets");
    }
}

    public static async retreiveAnswerMyShop(intent: string, entities: any, session: Session, dialogName: string):Promise < any > {

    try {
        BISMController.logger.info("Entered: BISMController : retreiveAnswerMyShop ");
        let entity = BISMPayloadUtil.parseEntities(entities);
        let payload = null;

        if(entity.length > 0 && entity[0].entityName != entity[0].resolution[0]) {
            payload = BISMPayloadUtil.getAnswerPayload(intent, entity[0].resolution[0], session.privateConversationData.preferredLanguage, session.userData.userID);

        } else if (entity.length > 0 && entity[0].entityName == entity[0].resolution[0]) {
            payload = BISMPayloadUtil.getAnswerPayload(intent, entity[0].entityName, session.privateConversationData.preferredLanguage, session.userData.userID);

        } else {
            payload = BISMPayloadUtil.getAnswerPayload(intent, '', session.privateConversationData.preferredLanguage, session.userData.userID);
        }
        BISMController.logger.debug("Payload : BISMController : [retreiveAnswerMyShop]", payload);
        let bismService: BISMService=BISMService.getInstance();
        let response = await bismService.getAnswer(payload);
        BISMController.logger.info("Exit: BISMController : retreiveAnswerMyShop ");
        return response;
    }
    catch (error) {
        session.send("Sorry! The Chat Service is currently unavailable.");
        session.send("We are working on restoring the Chat Service as soon as possible.")
        session.send("Please check out the http://mysupport page to look for support alternatives.")
        BISMController.logger.info("Error: BISMController : retreiveAnswerMyShop  ", error);
        throw new CustomError(error.message, "retreiveAnswerMyShop");
    }
}

    public static async createCallKBArtciles(intent: string, entities: any, description: any, session: Session) {
    try {
        BISMController.logger.info("Entered: BISMController : createCallKBArtciles ");
        let payload = null;
        let completeDescription = intent + "-->" + description;
        payload = BISMPayloadUtil.getCallPayload(completeDescription, intent, '', '' + '', 'Urgent', session.userData.userID);
        BISMController.logger.debug("Payload : BISMController : [createCallKBArtciles]", payload);
        let bismService: BISMService = BISMService.getInstance();
        let response = await bismService.createCall(payload);
        BISMController.logger.info("Exit: BISMController : createCallKBArtciles ");
        return response;
    }
    catch (error) {
        session.send("Sorry! The Chat Service is currently unavailable.");
        session.send("We are working on restoring the Chat Service as soon as possible.")
        session.send("Please check out the http://mysupport page to look for support alternatives.")
        BISMController.logger.info("BISMController : createCallKBArtciles : Error : ", error);
        throw new CustomError(error.message, "createCallKBArtciles");
    }
}

    public static async getKbArticleServiceCall(args: string, session: Session) {
    try {
        BISMController.logger.info("Entered : BISMController : getKbArticleServiceCall ");
        let payload = null;
        payload = BISMPayloadUtil.getKnowledgePayload(args, session.privateConversationData.preferredLanguage, session.userData.userID);
        BISMController.logger.debug("Payload : BISMController : [getKbArticleServiceCall]", payload);
        let bismService: BISMService = BISMService.getInstance();
        let response = await bismService.getSearchResult(payload);
        BISMController.logger.info("Exit : BISMController : getKbArticleServiceCall ");
        return response;
    }
    catch (error) {
        session.send("Sorry! The Chat Service is currently unavailable.");
        session.send("We are working on restoring the Chat Service as soon as possible.")
        session.send("Please check out the http://mysupport page to look for support alternatives.")
        BISMController.logger.info("Error: BISMController : getKbArticleServiceCall  ", error);
        throw new CustomError(error.message, "getKbArticleServiceCall");
    }
}

    public static async createCallForDefaultDlg(intent: string, entities: any, description: any, session: Session) {
    try {
        BISMController.logger.info("Entered: BISMController : createCallForDefaultDlg");
        let payload = BISMPayloadUtil.getCallPayload(description, intent, '', '' + '', 'Urgent', session.userData.userID);
        BISMController.logger.debug("Payload : BISMController : [createCallForDefaultDlg]", payload);
        let bismService: BISMService = BISMService.getInstance();
        let response = await bismService.createCall(payload);
        BISMController.logger.info("Exit: BISMController : createCallForDefaultDlg");
        return response;

    }
    catch (error) {
        session.send("Sorry! The Chat Service is currently unavailable.");
        session.send("We are working on restoring the Chat Service as soon as possible.")
        session.send("Please check out the http://mysupport page to look for support alternatives.")
        BISMController.logger.info("Error: BISMController : createCallForDefaultDlg  ", error);
        throw new CustomError(error.message, "createCallForDefaultDlg");
    }
}



    public static async createCancelForTickets(callId: string, addInfo: any, solution: any, session: Session, userID: string) {

    try {
        BISMController.logger.info("Entered: BISMController : createCancelForTickets ");
        let payload = BISMPayloadUtil.getCancelTicketPayload(callId, addInfo, "Ticket Cancelled", session, userID);
        BISMController.logger.debug("Payload : BISMController : [createCancelForTickets]", payload);
        let bismService: BISMService = BISMService.getInstance();
        BISMController.logger.info("Exit: BISMController : createCancelForTickets ");
        return await bismService.cancelTicketResult(payload);
    }
    catch (error) {
        session.send("Sorry! The Chat Service is currently unavailable.");
        session.send("We are working on restoring the Chat Service as soon as possible.")
        session.send("Please check out the http://mysupport page to look for support alternatives.")
        BISMController.logger.info("Error: BISMController : createCancelForTickets ", error);
        throw new CustomError(error.message, "createCallForDefaultDlg");
    }
}



    public static async forwardTicket(callId: string, addInfo: string, session: Session, userID: string) {

    try {

        BISMController.logger.info("Entered: BISMController : forwardTicket ");
        //let payload = BISMPayloadUtil.getForwardTicketPayload(callId, addInfo, userID, session.privateConversationData.preferredLocale); //extra parameter for langcode added by tushar
        let payload = BISMPayloadUtil.getForwardTicketPayload(callId, addInfo, userID);
        BISMController.logger.debug("Payload : BISMController : [forwardTicket]", payload);
        let bismService: BISMService = BISMService.getInstance();
        let response = await bismService.forwardTicketResult(payload);
        BISMController.logger.info("Exit: BISMController : forwardTicket ");
        return response;
    }
    catch (error) {
        session.send("Sorry! The Chat Service is currently unavailable.");
        session.send("We are working on restoring the Chat Service as soon as possible.")
        session.send("Please check out the http://mysupport page to look for support alternatives.")
        BISMController.logger.info("Error: BISMController : forwardTicket ", error);
        throw new CustomError(error.message, "forwardTicket");
    }
}

    public static async forwardTicketOpen(callId: string, session: Session, userID: string) {

    try {

        BISMController.logger.info("Entered: BISMController : forwardTicket ");
        let payload = BISMPayloadUtil.getForwardTicketOpenPayload(callId, userID);
        BISMController.logger.debug("Payload : BISMController : [forwardTicket]", payload);
        let bismService: BISMService = BISMService.getInstance();
        let response = await bismService.forwardTicketResult(payload);
        BISMController.logger.info("Exit: BISMController : forwardTicket ");
        return response;
    }
    catch (error) {
        session.send("Sorry! The Chat Service is currently unavailable.");
        session.send("We are working on restoring the Chat Service as soon as possible.")
        session.send("Please check out the http://mysupport page to look for support alternatives.")
        BISMController.logger.info("Error: BISMController : forwardTicket ", error);
        throw new CustomError(error.message, "forwardTicket");
    }
}

public static async getKbArticleStartServiceCall(args: string, session: Session) {
    try {
        BISMController.logger.info("Entered: BISMController : getKbArticleStartServiceCall ");
        let payload = null;
        payload = BISMPayloadUtil.getKnowledgePayload(args, session.privateConversationData.preferredLanguage, session.userData.userID);
        BISMController.logger.debug("Payload : BISMController : [getKbArticleStartServiceCall]", payload);
        let bismService: BISMService = BISMService.getInstance();
        let response = await bismService.getSearchResult(payload);
        BISMController.logger.info("Exit: BISMController : getKbArticleStartServiceCall ");
        return response;
    }
    catch (error) {
        session.send("Sorry! The Chat Service is currently unavailable.");
        session.send("We are working on restoring the Chat Service as soon as possible.")
        session.send("Please check out the http://mysupport page to look for support alternatives.")
        BISMController.logger.info("Error: BISMController : getKbArticleServiceCall  :", error);
        throw new CustomError(error.message, "getKbArticleServiceCall");
    }
}
public static async getUpdateTicketDescription(session:Session, callId:string, userId:string,description:string) {
    try {
        BISMController.logger.info("Entered: BISMController : getUpdateTicketDescription ");
        let payload = null;
        payload = BISMPayloadUtil.getUpdateTicketDescription(session, callId, userId,description);
        BISMController.logger.debug("Payload : BISMController : [getUpdateTicketDescription]", payload);
        let bismService: BISMService = BISMService.getInstance();
        let response = await bismService.getUpdateTicketDescription(payload);
        BISMController.logger.info("Exit: BISMController : getKbArticleStartServiceCall ");
        return response;
    }
    catch (error) {
        // session.send("Sorry! The Chat Service is currently unavailable.");
        // session.send("We are working on restoring the Chat Service as soon as possible.")
        // session.send("Please check out the http://mysupport page to look for support alternatives.")
        BISMController.logger.info("Error: BISMController : getKbArticleServiceCall  :", error);
        throw new CustomError(error.message, "getKbArticleServiceCall");
    }
}
}