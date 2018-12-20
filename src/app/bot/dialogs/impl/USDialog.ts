import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, Prompts, Session, Library } from 'botbuilder';
import { BISMController } from '../../../controller/BISMController';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { CustomError } from '../../../../util/ErrorHandlingUtil';
import { chatHistoryUpdate } from '../../../../util/ChatHistoryUtil';
export class USDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("US", USDialog.getDialog()).triggerAction({
            matches: ["BISM:US", "US"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                session.dialogData.callId = args;
                BISMController.forwardTicket(session.dialogData.callId, 'Need Support for Password Change', session, session.userData.user_ID).then(response => {
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.US_Sap_Dialog.ticket_msg") + session.dialogData.callId + PorpertiesUtil.getJSONProperties(session, "bismLanguage.sysntList_SAP_Dialog.ticket_forward"), false, "", "", "", "ignoringInput").toMessage());
                    PorpertiesUtil.tranlationFlagCleaner(session);//this have been commented to stop tranlation before chatHistory
                    session.privateConversationData.closeRequired = false;
                    session.privateConversationData.dialogEnd = true;
                    session.privateConversationData.updateTicketDescriptionRequired = false;
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.ITEMS_sap_Dialog.items_thank"), true, "", "", "", "ignoringInput").toMessage());
                    //session.endDialog();
                }).catch(err => {
                    session.send("We are sorry services are down momentarily");
                    BISMController.logger.info("BISMController : forwardTicket : forwardTicketResult : Error", err);
                    throw new CustomError(err.message, "forwardTicketResult");
                });
            },
            // (session: Session) => {
            //     chatHistoryUpdate(session.message.text, session, '', false);
            // }
        ];
    }
}