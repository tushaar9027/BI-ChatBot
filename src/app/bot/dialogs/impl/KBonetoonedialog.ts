import { ServerHandler } from "../../../../middleware/ServerHandlers";
import { Library, IDialogWaterfallStep, Session, IDialogResult, IFindMatchResult, Prompts, Message } from 'botbuilder';
import { BISMController } from "../../../controller/BISMController";
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { CustomError } from '../../../../util/ErrorHandlingUtil';
import { CardFactory } from '../../card/CardFactory';
import { chatHistoryUpdate } from "../../../../util/ChatHistoryUtil";
export class KBonetoonedialog {
    static logger = ServerHandler.getLogger();
    public static init(library: Library) {
        library.dialog("Knowledge.ArticlesOne", KBonetoonedialog.getDialog()).triggerAction({
            matches: ["BISM:Knowledge.ArticlesOne", "Knowledge Articles", "Knowledge Articles"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                
                KBonetoonedialog.logger.info("Entered : KBonetoonedialog :[BISM:Knowledge.ArticlesOne]");
                session.dialogData.searchField = args.searchField;
                session.dialogData.length = args.length;
                session.dialogData.searchResult = args.searchResult;
                session.dialogData.knowledgeArgs = args.knowledgeArgs;
                
                
                 if (session.dialogData.length > 0) {
                        BISMController.createCallKBArtciles(session.dialogData.knowledgeArgs.intent, session.dialogData.knowledgeArgs.entities,session.dialogData.searchField, session).then(response => {
                            session.dialogData.callId = JSON.parse(response).CallID;
                            session.privateConversationData.callId = JSON.parse(response).CallID;        
                    });
                    
                            let responseData = session.dialogData.searchResult;
                            var responseTitleArr = new Array();
                            var responseTitleArrPrompt = new Array();
                            let i;
                            var len = 1;
                               for (i = 0; i < session.dialogData.length; i++){
                               //for (i in session.dialogData.length) {
                                var Title = responseData.Data[i].Title;
                                var URL = responseData.Data[i].URL.trim();
                                var card: any = CardFactory.knowledgeArticleCard(session, Title, URL);
                                const message = new Message(session);
                                responseTitleArr.push("\n" + len + " : " + URL);
                                responseTitleArrPrompt.push(URL);
                                message.text(card.textCard);
                                 
                                session.send(message);
                             //                   setTimeout(function () {
                             //   session.send(message);
                             //                   }, 5000);
                                if (len == 3) {
                                    break;
                                }
                                len = len + 1;
                            }
                    session.dialogData.TitleArr = responseTitleArr;
                    session.dialogData.TitleArrPrompt = responseTitleArrPrompt;
                    
                    var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.all_knowledgeArticle"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.prompt_choice_result"), "", "", "expectingInput").toMessage();
                     Prompts.choice(session, msg, PorpertiesUtil.choiceOption(session).choice, PorpertiesUtil.choiceOption(session).options);
                //   Prompts.choice(session, 'Was this Knowledge Base Entry helpful?', 'Yes|No');
                    
                    }
                    
            },
                    
           (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
              KBonetoonedialog.logger.info("This is the response in Yes not ", results.response);
               if (results.response.index == 0) {
                    BISMController.updateCall(session.dialogData.callId, PorpertiesUtil.getJSONProperties(session, "bismLanguage.knowledgeArticleDialog.AdditionalInfoTicket") + session.dialogData.TitleArr[0], '', session).then(response => {
                            PorpertiesUtil.tranlationFlagCleaner(session);
                            session.privateConversationData.callId = session.dialogData.callId;
                            session.privateConversationData.closeRequired = true;
                            session.privateConversationData.updateTicketDescriptionRequired = false;
                            session.privateConversationData.configItemFlag = 'BI-NOS-INFORMATION';
                            session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.knowledgeArticleDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage());
                        });
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
                        session.privateConversationData.configItemFlag = 'BI-NOS-INFORMATION';
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