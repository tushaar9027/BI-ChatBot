import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, Session, Prompts, IFindMatchResult, IDialogResult, Library, Message } from 'botbuilder';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { BISMController } from '../../../controller/BISMController';
import { CardFactory } from '../../card/CardFactory';
export class AskCallIdDialog {
    static logger = ServerHandler.getLogger();
    public static init(library: Library) {
        library.dialog("ask.CallId", AskCallIdDialog.getDialog()).triggerAction({
            matches: ["BISM:ask.CallId", "Call id", "askCallId"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                AskCallIdDialog.logger.info("Entered : AskCallIdDialog :[BISM:ask.CallId] ")
                Prompts.text(session, BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askCallIdDialog.call_id"), false, "", "", "", "expectingInput").toMessage());
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                session.dialogData.callId = results.response;
                BISMController.getMyTickets(session.userData.userID, session.dialogData.callId, '', session).then(response => {
                    let responseDataLength = JSON.parse(response);
                    if (responseDataLength.Data.length > 0) {
                        var card: any = {};
                        var card = CardFactory.getMyTicket(session, responseDataLength);
                        const message = new Message(session);
                        message.text(card.textCard);
                        session.send(message);
                        session.dialogData.DialogEndFlag = true;
                        Prompts.text(session, BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage());
                    }
                    else {
                        Prompts.text(session, BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.enter_again"), false, "", "", "", "expectingInput").toMessage());
                        //Prompts.text(session, BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askCallIdDialog.call_id"), false, "", "", "", "expectingInput").toMessage());
                        //   session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.enter_again"), false, "", "", "", "ignoringInput").toMessage()).endDialog();
                    }
                });
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                if (session.dialogData.DialogEndFlag) {
                    PorpertiesUtil.tranlationFlagCleaner(session);
                    session.endDialog();
                }
                else {
                    session.dialogData.callIdAfterResponse = results.response;
                    if (session.dialogData.callIdAfterResponse == "0") {
                          session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage()).endDialog();
                       // Prompts.text(session, BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage());
                    }
                    else if (session.dialogData.callIdAfterResponse != "0") {
                        BISMController.getMyTickets(session.userData.userID, session.dialogData.callIdAfterResponse, '', session).then(response => {
                            let responseDataLength = JSON.parse(response);
                            if (responseDataLength.Data.length > 0) {
                                var card: any = {};
                                var card = CardFactory.getMyTicket(session, responseDataLength);
                                const message = new Message(session);
                                message.text(card.textCard);
                                session.send(message);
                                //     session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage()).endDialog();
                                //Prompts.text(session, BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage());
                                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), false, "", "", "", "ignoringInput").toMessage()).endDialog();
                            }
                            else {
                                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.ticket_not_found"), false, "", "", "", "ignoringInput").toMessage());
                                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), false, "", "", "", "ignoringInput").toMessage()).endDialog();
                                //Prompts.text(session, BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage());
                                //PorpertiesUtil.tranlationFlagCleaner(session);
                                //session.privateConversationData.updateTicketDescriptionRequired = false;
                                //session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage());
                            }
                        });
                    }
                }
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                PorpertiesUtil.tranlationFlagCleaner(session);
                session.privateConversationData.updateTicketDescriptionRequired = false;
                session.endDialog();
            }
        ]
    }
}