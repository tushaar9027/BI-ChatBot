import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, Session, Prompts, IDialogResult, IFindMatchResult, Library } from 'botbuilder';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { BISMController } from '../../../controller/BISMController';
import { CustomError } from '../../../../util/ErrorHandlingUtil';
import { chatHistoryUpdate } from '../../../../util/ChatHistoryUtil';
export class MyShopReqContinueDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("MyShop.Req.Other", MyShopReqContinueDialog.getDialog()).triggerAction({
            matches: ["BISM:MyShop.Req.Other", "myShopReq.Other"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args: any) => {
                session.dialogData.callId = args;
                Prompts.text(session, BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.myShopRequestOtherDialog.didnot_work"), false, "", "", "", "expectingInput").toMessage());
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                session.dialogData.additionalInfo = results.response;
                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.knowledge_improve"), false, "", "", "", "ignoringInput").toMessage());
                BISMController.updateCall(session.dialogData.callId, session.dialogData.additionalInfo, '', session).then(response => {
                    //This is forward ticket.
                    BISMController.forwardTicketOpen(session.dialogData.callId, session, session.userData.userID);
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.updateCall_msg") + JSON.parse(response).CallID + PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.updateCall_msgRemaining"), false, "", "", "", "ignoringInput").toMessage());
                    var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.myShopRequestOtherDialog.service_desk"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.myShopRequestOtherDialog.prompt_result"), "", "", "expectingInput").toMessage();
                    Prompts.choice(session, msg, PorpertiesUtil.choiceOption(session).choice, PorpertiesUtil.choiceOption(session).options);
                });
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
                        Prompts.text(session, BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage());
                    });
                }
                else {
                    if (results.response.index == 0) {
                        session.replaceDialog("BISM:againCall", session.dialogData.callId);
                    }
                    else if (results.response.index == 1) {
                        BISMController.createCancelForTickets(session.dialogData.callId, session.dialogData.additionalInfo, "Ticket Cancelled", session, session.userData.user_ID).then((response) => {
                            PorpertiesUtil.tranlationFlagCleaner(session);//this have been commented to stop tranlation before chatHistory
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