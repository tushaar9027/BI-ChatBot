import { Session, Prompts, Message, ListStyle, EntityRecognizer, IDialogWaterfallStep } from 'botbuilder';
import { ServerHandler } from '../../../middleware/ServerHandlers';
import { PorpertiesUtil } from '../../../util/PropertiesUtil';
export class BISMPayloadUtil {

    public static logger = ServerHandler.getLogger();

    private static instance: BISMPayloadUtil;

    public static getInstance() {
        if (BISMPayloadUtil.instance == null) {
            BISMPayloadUtil.instance = new BISMPayloadUtil();
        }
        return BISMPayloadUtil.instance;
    }


    public static getAnswerPayload(intent: string, entity: string, language: string, userID: string) {
        BISMPayloadUtil.logger.info("Entered : BISMPayloadUtil : [getAnswerPayload]")
        var coreIntent: string = intent.split(":")[1];
        var answerPayload: any = {};
        answerPayload.Intent = coreIntent;
        answerPayload.Entity = entity;
        answerPayload.Prefered_Language = language;
        answerPayload.UserID = userID;
        answerPayload.Profile = '';
        answerPayload.CallingSystem = 'TCM';
        BISMPayloadUtil.logger.info("Exit : BISMPayloadUtil : [getAnswerPayload]")
        console.log("Tushar Payload : " + JSON.stringify(answerPayload));
        return JSON.stringify(answerPayload);
    }


    public static getCallPayload(description: string, topic: string, externalRef: string, configItem: string, urgency: any, userID: string) {
        BISMPayloadUtil.logger.info("Entered : BISMPayloadUtil : [getCallPayload]")
        var callPayload: any = {};
        callPayload.UserID = userID;
        callPayload.Description = description;
        callPayload.TicketType = 'CALL';
        callPayload.Topic = 'IT';
        callPayload.Source = 'ChatBot';
        callPayload.ExternalRef = externalRef;
        callPayload.ConfigItem = configItem;
        callPayload.Urgency = urgency;
        BISMPayloadUtil.logger.info("Exit : BISMPayloadUtil : [getCallPayload]")
        return JSON.stringify(callPayload);
    }

    public static getCloseTicketPayload(callId: string, addInfo: string, userID: string, configItem: string) {
        BISMPayloadUtil.logger.info("Entered : BISMPayloadUtil : [getCloseTicketPayload]")
        var getCloseTicketPayload: any = {};
        getCloseTicketPayload.UserID = userID;
        getCloseTicketPayload.CallID = callId;
        getCloseTicketPayload.AdditionalInformation = addInfo;
        getCloseTicketPayload.Solution = 'Call Closed';
        getCloseTicketPayload.Source = 'ChatBot';
        getCloseTicketPayload.Status = '';
        getCloseTicketPayload.Type = '';
        getCloseTicketPayload.ConfigItem = configItem;
        BISMPayloadUtil.logger.info("Exit : BISMPayloadUtil : [getCloseTicketPayload]")
        return JSON.stringify(getCloseTicketPayload);
    }

    public static getUpdateTicketPayload(callId: string, addInfo: string, configItem: string, session: Session, userID: string) {
        BISMPayloadUtil.logger.info("Entered : BISMPayloadUtil : [getUpdateTicketPayload]")
        var updateTicketPayload: any = {};
        updateTicketPayload.UserID = userID;
        updateTicketPayload.CallID = callId;
        updateTicketPayload.AdditionalInformation = addInfo;
        updateTicketPayload.Source = 'ChatBot';
        updateTicketPayload.ConfigItem = configItem;
        updateTicketPayload.Urgency = '';
        BISMPayloadUtil.logger.info("Exit : BISMPayloadUtil : [getUpdateTicketPayload]")
        return JSON.stringify(updateTicketPayload);
    }

    public static getMyTicketPayload(session: Session, userId: string, callId: string, status: string) {
        BISMPayloadUtil.logger.info("Entered : BISMPayloadUtil : [getMyTicketPayload]")
        var myTicketPayload: any = {};
        myTicketPayload.UserID = userId;
        myTicketPayload.CallID = callId;
        myTicketPayload.StatusFilter = status;
        BISMPayloadUtil.logger.info("Exit : BISMPayloadUtil : [getMyTicketPayload]")
        return JSON.stringify(myTicketPayload);
    }
    
    public static getMyLastTicketPayload(session: Session, userId: string, callId: string, status: string) {
        BISMPayloadUtil.logger.info("Entered : BISMPayloadUtil : [getMyTicketPayload]")
        var myTicketPayload: any = {};
        myTicketPayload.UserID = userId;
        myTicketPayload.CallID = callId;
        myTicketPayload.StatusFilter = status;
        myTicketPayload.Source = "ChatBot";
        BISMPayloadUtil.logger.info("Exit : BISMPayloadUtil : [getMyTicketPayload]")
        return JSON.stringify(myTicketPayload);
    }

    public static getKnowledgePayload(keywords: string, lang: string, userID: string) {
        BISMPayloadUtil.logger.info("Entered : BISMPayloadUtil : [getKnowledgePayload]")
        var knowledgePayload: any = {};
        knowledgePayload.UserID = userID;
        knowledgePayload.Search_Words = keywords;
        knowledgePayload.CallingSystem = 'TCM';
        knowledgePayload.Profile = '';
        knowledgePayload.Prefered_Language = lang;
        BISMPayloadUtil.logger.info("Exit : BISMPayloadUtil : [getKnowledgePayload]")
        return JSON.stringify(knowledgePayload);
    }

    public static getCancelTicketPayload(callId: string, addInfo: string, solution: string, session: Session, userID: string) {
        BISMPayloadUtil.logger.info("Entered : BISMPayloadUtil : [getCancelTicketPayload]")
        var cancelTicketPayload: any = {};
        cancelTicketPayload.UserID = userID
        cancelTicketPayload.CallID = callId;
        cancelTicketPayload.AdditionalInformation = addInfo;
        cancelTicketPayload.Solution = solution;
        cancelTicketPayload.Source = "ChatBot"
        cancelTicketPayload.Status = "Ticket Cancelled";
        BISMPayloadUtil.logger.info("Exit : BISMPayloadUtil : [getCancelTicketPayload]")
        return JSON.stringify(cancelTicketPayload);
    }

    //public static getForwardTicketPayload(callId: string, addInfo: string, userID: string,userlang: string) {
        public static getForwardTicketPayload(callId: string, addInfo: string, userID: string) {
        BISMPayloadUtil.logger.info("Entered : BISMPayloadUtil : [getForwardTicketPayload]")
        //console.log("Tushar Payload:" + userlang);
        var forwardTicketPayload: any = {};
        forwardTicketPayload.UserID = userID
        forwardTicketPayload.CallID = callId;
        forwardTicketPayload.AdditionalInformation = addInfo;
        forwardTicketPayload.WorkGroup = PorpertiesUtil.getJSONPropertiesWithoutSession("bi_configItems.SAPForwardTicket")
        //if(userlang =="es")
        //{
        //    forwardTicketPayload.WorkGroup = PorpertiesUtil.getJSONPropertiesWithoutSession("bi_configItems.ShanghaiForwardTicket")
        //}
        //else
        //{
        //    forwardTicketPayload.WorkGroup = PorpertiesUtil.getJSONPropertiesWithoutSession("bi_configItems.SAPForwardTicket")
        //}
        forwardTicketPayload.Source = "ChatBot"
        forwardTicketPayload.Status = "Ticket Forwarded";
        BISMPayloadUtil.logger.info("Exit : BISMPayloadUtil : [getForwardTicketPayload]")
        return JSON.stringify(forwardTicketPayload);
    }

    public static getForwardTicketOpenPayload(callId: string, userID: string) {
        BISMPayloadUtil.logger.info("Entered : BISMPayloadUtil : [getForwardTicketOpenPayload]")
        var forwardTicketPayload: any = {};
        forwardTicketPayload.UserID = userID
        forwardTicketPayload.CallID = callId;
        forwardTicketPayload.Topic = "IT";
        BISMPayloadUtil.logger.info("Exit : BISMPayloadUtil : [getForwardTicketOpenPayload]")
        return JSON.stringify(forwardTicketPayload);
    }


    public static getUpdateTicketDescription(session:Session,callId: string, userID: string,description:string) {
        BISMPayloadUtil.logger.info("Entered : BISMPayloadUtil : [getUpdateTicketDescription]")
        var updateTicketDescription: any = {};
        updateTicketDescription.UserID = userID
        updateTicketDescription.CallID = callId;
        updateTicketDescription.Description = description
        updateTicketDescription.Source = "ChatBot";
        BISMPayloadUtil.logger.info("Exit : BISMPayloadUtil : [getUpdateTicketDescription]")
        return JSON.stringify(updateTicketDescription);
    }

    public static getEntity(): BISMEntity {
        BISMPayloadUtil.logger.info("Entered : BISMPayloadUtil : [getEntity]")
        return new BISMEntity();
    }

    public static parseEntities(entities: any) {
        BISMPayloadUtil.logger.info("Entered : BISMPayloadUtil : [parseEntities]")
        if (entities == null || entities == []) {
            return null;
        }
        let entityArray: BISMEntity[] = new Array();
        for (var element of entities) {
            let entity = BISMPayloadUtil.getEntity();
            entity.entityName = element.entity;
            entity.entityType = element.type;
            for(var value of element.resolution.values) {
                entity.resolution.push(value);
            };
        entityArray.push(entity);
    };
    BISMPayloadUtil.logger.info("Exit : BISMPayloadUtil : [parseEntities]")
        return entityArray;
    }
}

class BISMEntity {
    public entityName: string;
    public entityType: string;
    public resolution: string[] = new Array();
}


