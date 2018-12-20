import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, IFindMatchResult, IDialogResult, Session, Prompts, Library } from 'botbuilder';
import { BISMController } from '../../../controller/BISMController';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { chatHistoryUpdate } from '../../../../util/ChatHistoryUtil'
import { CustomError } from '../../../../util/ErrorHandlingUtil';

export class DemoAskMoreInformationDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("Demo.ask.MoreInformation", DemoAskMoreInformationDialog.getDialog()).triggerAction({
            matches: ["BISM:Demo.ask.MoreInformation", "askMoreInformation", "more Information", "information"]
        });
    }

    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args: any) => {
                DemoAskMoreInformationDialog.logger.info("Entered : AskMoreInformationDialog :[BISM:ask.MoreInformation] ")
                session.dialogData.callId = args.callId;
                session.dialogData.ConfigItemFlag = 'BI-NOS-INFORMATION';
                session.privateConversationData.configItemFlag = 'BI-NOS-INFORMATION';
                var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.prompt_choice"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.prompt_choice_result"), "", "", "expectingInput").toMessage();
                Prompts.choice(session, msg, PorpertiesUtil.choiceOption(session).choice, PorpertiesUtil.choiceOption(session).options);
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                if (results.response.entity == "No" || results.response.entity == "Nein") {
                    Prompts.text(session, BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.didnot_work"), false, "", "", "", "expectingInput").toMessage());
                }
                else if (results.response.entity == "Yes" || results.response.entity == "Ja") {
                    session.privateConversationData.closeRequired = true;
                    PorpertiesUtil.tranlationFlagCleaner(session);
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank"), true, "", "", "", "ignoringInput").toMessage());
                }
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                session.dialogData.additionalInfo = results.response;
                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.knowledge_improve"), false, "", "", "", "ignoringInput").toMessage());
                BISMController.updateCall(session.dialogData.callId, session.dialogData.additionalInfo, '', session).then(response => {
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.updateCall_msg") + JSON.parse(response).CallID + PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.updateCall_msgRemaining"), false, "", "", "", "ignoringInput").toMessage());
                    var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.service_desk"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.prompt_choice_result"), "", "", "expectingInput").toMessage();
                    Prompts.choice(session, msg, PorpertiesUtil.choiceOption(session).choice, PorpertiesUtil.choiceOption(session).options);
                });
                //}
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
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
                        Prompts.text(session, BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage());
                    });
                }
                else {
                    if (results.response.index == 0) {
                        session.replaceDialog("BISM:againCall", session.dialogData.callId);
                    }
                    else if (results.response.index == 1) {
                        BISMController.createCancelForTickets(session.dialogData.callId, session.dialogData.additionalInfo, "Ticket Cancelled", session, session.userData.user_ID).then((response) => {
                            session.privateConversationData.dialogEnd = true;
                            session.privateConversationData.updateTicketDescriptionRequired = false;
                            PorpertiesUtil.tranlationFlagCleaner(session);
                            session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage());
                        }).catch(err => {
                            session.send("We are sorry services are down momentarily");
                            BISMController.logger.info("BISMController : createCancelForTickets :cancelTicketResult : Error", err);
                            throw new CustomError(err.message, "createCall");
                        });
                    }
                    DemoAskMoreInformationDialog.logger.info("Exit : AskMoreInformationDialog :[BISM:ask.MoreInformation] ")
                }
            },

        ]
    }
}