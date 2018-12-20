import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, Session, Prompts, IDialogResult, IFindMatchResult, Library } from 'botbuilder';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { BISMController } from '../../../controller/BISMController';
import { CustomError } from '../../../../util/ErrorHandlingUtil';
import { chatHistoryUpdate } from '../../../../util/ChatHistoryUtil';
export class DefaultDialogContinue {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("default.Dialog_remaining", DefaultDialogContinue.getDialog()).triggerAction({
            matches: ["BISM:default.Dialog_remaining", "default dialog"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args: any) => {
                DefaultDialogContinue.logger.info("Entered : DefaultDialogContinue :[BISM:default.Dialog_remaining] ")
                session.dialogData.callId = args;
                var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.service_desk"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.prompt_choice_result"), "", "", "expectingInput").toMessage();
                Prompts.choice(session, msg, PorpertiesUtil.choiceOption(session).choice, PorpertiesUtil.choiceOption(session).options);
            },
            (session: Session, results: IDialogResult<IFindMatchResult>) => {
                session.dialogData.personalChatResp = results.response.entity;
                if (results.response.index == 0) {
                    Prompts.text(session, BIBotConnector.channelDataMessage(session, "Please wait routing to agent.", false, "", session.dialogData.callId, "ROUTE_TO_AGENT", "ignoringInput").toMessage());
                }
                else if (results.response.index == 1) {
                    var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.agent_later"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.prompt_choice_result"), "", "", "expectingInput").toMessage();
                    Prompts.choice(session, msg, PorpertiesUtil.choiceOption(session).choice, PorpertiesUtil.choiceOption(session).options);
                }
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                if (results.response.entity == undefined || results.response.entity == " ") {
                    session.dialogData.additionalInfo = results.response;
                    BISMController.updateCall(session.dialogData.callId, session.dialogData.additionalInfo, '', session).then(response => {
                        session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.updateCall_msg") + JSON.parse(response).CallID + PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.updateCall_msgRemaining"), false, "", "", "", "ignoringInput").toMessage());
                        PorpertiesUtil.tranlationFlagCleaner(session);
                        session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage()).endDialog();
                    });
                }
                else {
                    if (results.response.index == 0) {
                        session.replaceDialog("BISM:againCall", session.dialogData.callId);
                    }
                    else if (results.response.index == 1) {
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
                DefaultDialogContinue.logger.info("Exit : DefaultDialogContinue :[BISM:default.Dialog_remaining]")
            }
        ]
    }
}