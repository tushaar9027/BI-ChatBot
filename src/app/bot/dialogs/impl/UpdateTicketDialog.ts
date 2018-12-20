import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, Session, Prompts, IFindMatchResult, IDialogResult, Library } from 'botbuilder';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { BISMController } from '../../../controller/BISMController';
export class UpdateTicketDialog {

    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("Update.Ticket", UpdateTicketDialog.getDialog()).triggerAction({
            matches: ["BISM:Update.Ticket", "updateTicket", "Ticket Update"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                Prompts.text(session, BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.updateTicketDialog.call_ID"), false, "", "", "", "expectingInput").toMessage());
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                session.dialogData.callId = results.response;
                Prompts.text(session, BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.updateTicketDialog.update_information"), false, "", "", "", "expectingInput").toMessage());
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                session.dialogData.additionalInfo = results.response;
                session.privateConversationData.updateTicketDescriptionRequired = false;
                BISMController.updateCall(session.dialogData.callId, session.dialogData.additionalInfo, '', session).then(response => {
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.updateCall_msg") + JSON.parse(response).CallID + PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.updateCall_msgRemaining"), false, "", "", "", "ignoringInput").toMessage());
                });;
            }
        ]
    }
}