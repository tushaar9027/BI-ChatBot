import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, Session, Prompts, IDialogResult, IFindMatchResult, Library } from 'botbuilder';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { BISMController } from '../../../controller/BISMController';
import { CustomError } from '../../../../util/ErrorHandlingUtil';
export class DefaultDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("default.Dialog", DefaultDialog.getDialog()).triggerAction({
            matches: ["BISM:default.Dialog", "default dialog"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args: any) => {
                if (PorpertiesUtil.translationSupport(session.privateConversationData.preferredLanguage)) {
                    session.message.text = session.privateConversationData.translationBeforeMessage;
                }
                session.privateConversationData.updateTicketDescriptionRequired = true;
                DefaultDialog.logger.info("Entered : DefaultDialog :[BISM:default.Dialog] ")
                Prompts.text(session, BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.specific_Msg"), false, "", "", "", "expectingInput").toMessage());
            },
            (session: Session, results: IDialogResult<IFindMatchResult>) => {
                session.dialogData.description = results.response;
                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.defaultDialog.message"), false, "", "", "", "ignoringInput").toMessage());
                let entityArray = BISMController.createCallForDefaultDlg(session.message.text, session.message.text, session.message.text, session).then(response => {
                    session.dialogData.callId = JSON.parse(response).CallID;
                    session.privateConversationData.callId = JSON.parse(response).CallID;
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.your_callID") + JSON.parse(response).CallID + '.' + PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.call_msg"), false, "", "", "", "ignoringInput").toMessage());
                    session.replaceDialog("BISM:default.Dialog_remaining", session.dialogData.callId);
                }).catch(err => {
                    session.send("We are sorry services are down momentarily");
                    BISMController.logger.info("BISMController : createCallForDefaultDlg: createCall : Error", err);
                    throw new CustomError(err.message, "createCall");
                });
                DefaultDialog.logger.info("Exit : DefaultDialog :[BISM:default.Dialog] ")

            }
        ]
    }
}