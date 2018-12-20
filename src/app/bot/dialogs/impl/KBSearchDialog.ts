import { ServerHandler } from "../../../../middleware/ServerHandlers";
import { Library, IDialogWaterfallStep, Session, IDialogResult, IFindMatchResult, Prompts, Message } from 'botbuilder';
import { BISMController } from "../../../controller/BISMController";
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { CardFactory } from '../../card/CardFactory';
import { CustomError } from '../../../../util/ErrorHandlingUtil';
import { chatHistoryUpdate } from "../../../../util/ChatHistoryUtil";

export class KBSearchDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("Knowledge.Search", KBSearchDialog.getDialog()).triggerAction({
            matches: ["BISM:Knowledge.Search", "Hello, who are you?"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                KBSearchDialog.logger.info("Entered : KBSearchDialog :[BISM:Knowledge.Search]");
                session.dialogData.searchField = args.searchField;
                session.dialogData.length = args.length;
                session.dialogData.searchResult = args.searchResult;
                session.dialogData.knowledgeArgs = args.knowledgeArgs;
                console.log("KBSearch callid : " + args.CallId);
                session.dialogData.callId = args.CallId;
                console.log("KBSearch dialog callid : " + session.dialogData.callId);

                console.log("Tushar Search Field: " + session.dialogData.searchField);
                console.log("Tushar Search Legth: " + session.dialogData.length);
                console.log("Tushar Search Result: " + session.dialogData.searchResult);
                console.log("Tushar Search knowledgeArgs: " + session.dialogData.knowledgeArgs);
                console.log("Tushar Search CallId: " + session.dialogData.callId);

                let responseData = session.dialogData.searchResult;

                var responseTitleArr = new Array();
                var responseTitleArrPrompt = new Array();
                let i;
                var len = 1;

                for (i = 0; i < session.dialogData.length; i++) {
                    //for (i in session.dialogData.length) { 
                    var Title = responseData.Data[i].Title;
                    console.log("KBSearch Title: " + Title);
                    var URL = responseData.Data[i].URL.trim();
                    console.log("KBSearch Url: " + URL);
                    var card: any = CardFactory.knowledgeArticleCard(session, Title, URL);
                    const message = new Message(session);
                    responseTitleArr.push("\n" + len + " : " + URL);
                    responseTitleArrPrompt.push(URL);
                    message.text(card.textCard);
                    setTimeout(function () {
                        session.send(message);
                    }, 5000);
                    if (len == 3) {
                        break;
                    }
                    len = len + 1;
                }
                session.dialogData.TitleArr = responseTitleArr;
                session.dialogData.TitleArrPrompt = responseTitleArrPrompt;
                var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.one_knowledge"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.prompt_choice_result"), "", "", "expectingInput").toMessage();
                setTimeout(function () {
                    Prompts.choice(session, msg, PorpertiesUtil.choiceOption(session).choice, PorpertiesUtil.choiceOption(session).options);
                    //  Prompts.choice(session, 'Was one of these Knowledge Base Entries helpful?', 'Yes|No');
                }, 5002);
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                KBSearchDialog.logger.info("This is the response in Yes not ", results.response);
                if (results.response.index == 0) {
                    var listOptionArr: [string] = session.dialogData.TitleArrPrompt;
                    var listOptionString: string = listOptionArr.toString();
                    listOptionString = listOptionString.replace(/,/g, "|");
                    var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.knowledgeArticleDialog.whichKBArticleHelpful") + session.dialogData.TitleArr, false, listOptionString, "", "", "expectingInput").toMessage();
                    Prompts.choice(session, msg, session.dialogData.TitleArrPrompt, PorpertiesUtil.choiceOption(session).options);
                }
                else if (results.response.index == 1) {
                    //Prompts.text(session, BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.didnot_work"), false, "", "", "", "expectingInput").toMessage());
                    var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.KBSearchOptions"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.KBSearchOptions_choice_result"), "", "", "expectingInput").toMessage();
                    Prompts.choice(session, msg, msg.sourceEvent.listOption, PorpertiesUtil.choiceOption(session).options);
                }
            },

            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                var arrayResponse = [];
                arrayResponse = session.dialogData.TitleArrPrompt;
                if (arrayResponse.includes(results.response.entity)) {
                    BISMController.updateCall(session.dialogData.callId, PorpertiesUtil.getJSONProperties(session, "bismLanguage.knowledgeArticleDialog.AdditionalInfoTicket") + results.response.entity, '', session).then(response => {
                        // BISMController.closeCall(session.dialogData.callId, "Statisfied", session, 'BI-NOS-INFORMATION').then((response) => {
                        PorpertiesUtil.tranlationFlagCleaner(session);
                        session.privateConversationData.closeRequired = true;
                        session.privateConversationData.configItemFlag = 'BI-NOS-INFORMATION';
                        session.privateConversationData.updateTicketDescriptionRequired = false;
                        session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.knowledgeArticleDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage());
                    });
                }
                else {

                    if (results.response.index == 0) {
                        //Prompts.text(session, BIBotConnector.channelDataMessage(session, "Please wait routing to agent.", false, "", session.dialogData.callId, "ROUTE_TO_AGENT", "ignoringInput").toMessage());
                        session.beginDialog("BISM:Knowledge.RouteToAgent", args);
                    }
                    else if (results.response.index == 1) {
                        if (results.response.entity == undefined || results.response.entity == " ") {
                            session.dialogData.additionalInfo = results.response;
                            BISMController.updateCall(session.dialogData.callId, session.dialogData.additionalInfo, '', session).then(response => {
                                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.updateCall_msg") + JSON.parse(response).CallID + PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.updateCall_msgRemaining"), false, "", "", "", "ignoringInput").toMessage());
                                PorpertiesUtil.tranlationFlagCleaner(session);
                                session.privateConversationData.updateTicketDescriptionRequired = false;
                                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage()).endDialog();
                            });
                        }
                        session.replaceDialog("BISM:againCall", session.dialogData.callId);
                    }
                    else if (results.response.index == 2) {
                        //session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage()).endDialog();
                        if (results.response.entity == undefined || results.response.entity == " ") {
                            session.dialogData.additionalInfo = results.response;
                            BISMController.updateCall(session.dialogData.callId, session.dialogData.additionalInfo, '', session).then(response => {
                                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.updateCall_msg") + JSON.parse(response).CallID + PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.updateCall_msgRemaining"), false, "", "", "", "ignoringInput").toMessage());
                                PorpertiesUtil.tranlationFlagCleaner(session);
                                session.privateConversationData.updateTicketDescriptionRequired = false;
                                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage()).endDialog();
                            });
                        }
                        session.beginDialog("BISM:Knowledge.CancelTicket", args);
                    }
                }
            }

        ];

    }
}
