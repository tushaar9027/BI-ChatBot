import { ServerHandler } from "../../../../middleware/ServerHandlers";
import { Library, IDialogWaterfallStep, Session, IDialogResult, IFindMatchResult, Prompts, Message } from 'botbuilder';
import { BISMController } from "../../../controller/BISMController";
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { CardFactory } from '../../card/CardFactory';
import { CustomError } from '../../../../util/ErrorHandlingUtil';
import { chatHistoryUpdate } from "../../../../util/ChatHistoryUtil";

export class KnowledgeArticleContinueDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("Knowledge.ArticlesRemaining", KnowledgeArticleContinueDialog​​.getDialog()).triggerAction({
            matches: ["BISM:Knowledge.ArticlesRemaining", "Hello, who are you?"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                session.dialogData.callId = args.callId;
                session.dialogData.queryKBArticles = args.knowledgeDescription;

                var response = BISMController.getKbArticleServiceCall(session.dialogData.queryKBArticles, session).then(response => {
                    let responseDataLength = JSON.parse(response);
                    var responseTitleArr = new Array();
                    var responseTitleArrPrompt = new Array();
                    let i;
                    var len = 1;
                    //Start--New dialog added for 1:many kb----By Rupinder 24Oct2018
                    if (responseDataLength.Data.length > 1) {
                        session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.knowledgeArticleDialog.manyKnowledgeArticleMessage"), false, "", "", "", "ignoringInput").toMessage());
                    }
                    // session.sendTyping();
                    //Stop--New dialog added for 1:many kb----By Rupinder 24Oct2018
                    for (i in responseDataLength.Data) {
                        var Title = responseDataLength.Data[i].Title;
                        var URL = responseDataLength.Data[i].URL.trim();
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
                    if (responseDataLength.Data.length == 1) {
                        session.dialogData.responseLen = 1;
                        var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.all_knowledgeArticle"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.prompt_choice_result"), "", "", "expectingInput").toMessage();
                        Prompts.choice(session, msg, PorpertiesUtil.choiceOption(session).choice, PorpertiesUtil.choiceOption(session).options);
                        //   Prompts.choice(session, 'Was this Knowledge Base Entry helpful?', 'Yes|No');
                    } else {
                        var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.one_knowledge"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.prompt_choice_result"), "", "", "expectingInput").toMessage();
                        setTimeout(function () {
                            Prompts.choice(session, msg, PorpertiesUtil.choiceOption(session).choice, PorpertiesUtil.choiceOption(session).options);
                            //  Prompts.choice(session, 'Was one of these Knowledge Base Entries helpful?', 'Yes|No');
                        }, 5002);
                    }
                }).catch(err => {
                    session.send("We are sorry services are down momentarily");
                    BISMController.logger.info("BISMController : getKbArticleServiceCall : getSearchResult:  Error :", err);
                    throw new CustomError(err.message, "getSearchResult");
                });
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                KnowledgeArticleContinueDialog​​.logger.info("This is the response in Yes not ", results.response);
                if (results.response.index == 0) {
                    if (session.dialogData.responseLen == 1) {
                        BISMController.updateCall(session.dialogData.callId, PorpertiesUtil.getJSONProperties(session, "bismLanguage.knowledgeArticleDialog.AdditionalInfoTicket") + session.dialogData.TitleArr[0], '', session).then(response => {
                            PorpertiesUtil.tranlationFlagCleaner(session);
                            session.privateConversationData.callId = session.dialogData.callId;
                            session.privateConversationData.closeRequired = true;
                            session.privateConversationData.updateTicketDescriptionRequired = false;
                            session.privateConversationData.configItemFlag = 'BI-NOS-INFORMATION';
                            session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.knowledgeArticleDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage())
                        });
                    }
                    else {
                        var listOptionArr: [string] = session.dialogData.TitleArrPrompt;
                        var listOptionString: string = listOptionArr.toString();
                        listOptionString = listOptionString.replace(/,/g, "|");
                        var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.knowledgeArticleDialog.whichKBArticleHelpful") + session.dialogData.TitleArr, false, listOptionString, "", "", "expectingInput").toMessage();
                        Prompts.choice(session, msg, session.dialogData.TitleArrPrompt, PorpertiesUtil.choiceOption(session).options);
                    }
                }
                else if (results.response.index == 1) {
                    Prompts.text(session, BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.didnot_work"), false, "", "", "", "expectingInput").toMessage());
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
                        session.privateConversationData.configItemFlag = 'BI-NOS-INFORMATION'
                        session.privateConversationData.updateTicketDescriptionRequired = false;
                        session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.knowledgeArticleDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage());
                    });
                }
                else {
                    session.dialogData.additionalInfo = results.response;
                    var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.service_desk"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.prompt_choice_result"), "", "", "expectingInput").toMessage();
                    Prompts.choice(session, msg, msg.sourceEvent.listOption, PorpertiesUtil.choiceOption(session).options);
                }

            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                if (results.response.index == 0) {
                    Prompts.text(session, BIBotConnector.channelDataMessage(session, "Please wait routing to agent.", false, "", session.dialogData.callId, "ROUTE_TO_AGENT", "ignoringInput").toMessage());
                }
                else if (results.response.index == 1) {
                    var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.agent_later"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.prompt_choice_result"), "", "", "expectingInput").toMessage();
                    Prompts.choice(session, msg, msg.sourceEvent.listOption, PorpertiesUtil.choiceOption(session).options);
                }
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                if (results.response.entity == undefined || results.response.entity == " ") {
                    session.dialogData.additionalInfo = results.response;
                    BISMController.updateCall(session.dialogData.callId, session.dialogData.additionalInfo, '', session).then(response => {
                        session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.updateCall_msg") + JSON.parse(response).CallID + PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.updateCall_msgRemaining"), false, "", "", "", "ignoringInput").toMessage());
                        PorpertiesUtil.tranlationFlagCleaner(session);
                        session.privateConversationData.updateTicketDescriptionRequired = false;
                        session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage()).endDialog();
                    });
                }
                else {
                    if (results.response.index == 0) {
                        session.replaceDialog("BISM:againCall", session.dialogData.callId);
                    }
                    else {
                        BISMController.createCancelForTickets(session.dialogData.callId, session.dialogData.additionalInfo, "Ticket Cancelled", session, session.userData.user_ID).then((response) => {
                            session.privateConversationData.dialogEnd = true;
                            PorpertiesUtil.tranlationFlagCleaner(session);
                            session.privateConversationData.updateTicketDescriptionRequired = false;
                            session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage());
                        }).catch(err => {
                            session.send("We are sorry services are down momentarily");
                            BISMController.logger.info("BISMController : createCancelForTickets :cancelTicketResult : Error", err);
                            throw new CustomError(err.message, "createCall");
                        });
                    }
                }
            }
        ];

    }
}