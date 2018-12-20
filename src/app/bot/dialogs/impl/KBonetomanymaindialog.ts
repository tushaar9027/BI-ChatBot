import { ServerHandler } from "../../../../middleware/ServerHandlers";
import { Library, IDialogWaterfallStep, Session, IDialogResult, IFindMatchResult, Prompts, Message } from 'botbuilder';
import { BISMController } from "../../../controller/BISMController";
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { CardFactory } from '../../card/CardFactory';
import { CustomError } from '../../../../util/ErrorHandlingUtil';
import { chatHistoryUpdate } from "../../../../util/ChatHistoryUtil";

export class KBonetomanymainDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("Knowledge.Onetomanymenu", KBonetomanymainDialog.getDialog()).triggerAction({
            matches: ["BISM:Knowledge.Onetomanymenu", "Hello, who are you?"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                KBonetomanymainDialog.logger.info("Entered : KBonetomanymainDialog :[BISM:Knowledge.Onetomanymenu] :", session.privateConversationData.userDetails);
                session.dialogData.searchField = args.searchField;
                session.dialogData.length = args.length;
                session.dialogData.searchResult = args.searchResult;
                session.dialogData.knowledgeArgs = args.knowledgeArgs;
                var callId;
                 if (session.dialogData.length > 0) {
                        BISMController.createCallKBArtciles(session.dialogData.knowledgeArgs.intent, session.dialogData.knowledgeArgs.entities,session.dialogData.searchField, session).then(response => {
                            callId = JSON.parse(response).CallID;
                            console.log("Tushar Call id Source : " + JSON.parse(response).CallID);
                            console.log("Tushar Call id Dialog Source : " + callId);
                            session.privateConversationData.callId = JSON.parse(response).CallID;
                            session.dialogData.callId = callId;
                            console.log("Inside onetomay tushar dialog");
                            console.log("Tushar Call id Dialog Source : " + session.dialogData.callId);
                            //Prompts.choice(session, "Sorry,I do not have a direct answer for you yet.But i can offer you the following options(please choose a number): ?", "Do a search in knowledge Base based on your question|Get Connected to a Service Desk Agent right now |Book a callback by a //Service Desk Agent for a later time|Cancel the query", { listStyle: 2 });
                    var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.KBManyOptions"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.KBManyOptions_choice_result"), "", "", "expectingInput").toMessage();
                     Prompts.choice(session, msg, msg.sourceEvent.listOption, PorpertiesUtil.choiceOption(session).options);     
                    });
                 }
                
                
            },
           (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
               console.log("Tushar After options function ");
               console.log("Tushar Call id Dialog Source1 : " + session.dialogData.callId);
               let kargsValue = {
                            "searchField": session.dialogData.searchField,
                            "length": session.dialogData.length,
                            "searchResult": session.dialogData.searchResult,
                            "knowledgeArgs": session.dialogData.knowledgeArgs,
                            "CallId": session.dialogData.callId
                        }
               
                 if (results.response.index == 0) {
                        
                        //session.replaceDialog("BISM:Knowledge.Search", kargsValue);
                        session.beginDialog("BISM:Knowledge.Search", kargsValue);
                 }
                 else if (results.response.index == 1) {
                     session.beginDialog("BISM:Knowledge.RouteToAgent", kargsValue);
                     
                     //Prompts.text(session, BIBotConnector.channelDataMessage(session, "Please wait routing to agent.", false, "", session.dialogData.callId, "ROUTE_TO_AGENT", "ignoringInput").toMessage());
                 }
                 else if (results.response.index == 2) {
                     //session.beginDialog("BISM:KBAgentCallbackDialog", args);
                     session.beginDialog("BISM:againCall", session.dialogData.callId);
                 }
                 else if (results.response.index == 3) {
                     session.beginDialog("BISM:Knowledge.CancelTicket", kargsValue);
                 }
            }
           // (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
               
                
           // }
        ];

    }
}
