import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, IFindMatchResult, IDialogResult, Session, Prompts, Library } from 'botbuilder';
import { BISMController } from '../../../controller/BISMController';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { CustomError } from '../../../../util/ErrorHandlingUtil';
import { chatHistoryUpdate } from '../../../../util/ChatHistoryUtil';

export class IBISDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("IBIS", IBISDialog.getDialog()).triggerAction({
            matches: ["BISM:IBIS", "IBIS"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                IBISDialog.logger.info("Entered : IBISDialog :[BISM:IBIS] ")
                session.dialogData.callId = args;
                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.common_SAP_Dialog.msg1"), false, "", "", "", "ignoringInput").toMessage());
                setTimeout(function () {
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.common_SAP_Dialog.msg2"), false, "", "", "", "ignoringInput").toMessage());
                }, 3000);
                setTimeout(function () {
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.ibis_Sap_Dialog.ibis_msg"), false, "", "", "", "ignoringInput").toMessage());
                }, 3000);
                setTimeout(function () {
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.ibis_Sap_Dialog.ibis_msg2"), false, "", "", "", "ignoringInput").toMessage());
                }, 3000);
                setTimeout(function () {
                    var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.ibis_Sap_Dialog.ibis_prompt_msg"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.prompt_choice_result"), "", "", "expectingInput").toMessage();
                    Prompts.choice(session, msg, PorpertiesUtil.choiceOption(session).choice, PorpertiesUtil.choiceOption(session).options);
                }, 3000);

            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                if (results.response.index == 0) {
                    // BISMController.closeCall(session.dialogData.callId, 'SATISFIED', session, 'DE-AS-IBIS2007').then(response => {
                    PorpertiesUtil.tranlationFlagCleaner(session);
                    session.privateConversationData.configItemFlag = PorpertiesUtil.getJSONPropertiesWithoutSession("bi_configItems.IBISSAPDilaog");
                    session.privateConversationData.closeRequired = true;
                    session.privateConversationData.dialogEnd = true;
                    session.privateConversationData.endOfConversation = true;
                    session.privateConversationData.updateTicketDescriptionRequired = false;
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.ITEMS_sap_Dialog.items_ticket_close") + session.dialogData.callId + ".", false, "", "", "", "ignoringInput").toMessage());
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.ITEMS_sap_Dialog.items_thank"), true, "", "", "", "ignoringInput").toMessage());
                    //});
                }
                else if (results.response.index == 1) {
                    BISMController.forwardTicket(session.dialogData.callId, 'Need Support for Password Change', session, session.userData.user_ID).then(response => {
                        session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.ITEMS_sap_Dialog.update_msg1") + session.dialogData.callId + PorpertiesUtil.getJSONProperties(session, "bismLanguage.ITEMS_sap_Dialog.update_msg3"), false, "", "", "", "ignoringInput").toMessage());
                        PorpertiesUtil.tranlationFlagCleaner(session);//this have been commented to stop tranlation before chatHistory
                        session.privateConversationData.configItemFlag = '';
                        session.privateConversationData.closeRequired = false;
                        session.privateConversationData.dialogEnd = true;
                        session.privateConversationData.endOfConversation = false;
                        session.privateConversationData.updateTicketDescriptionRequired = false;
                        session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.ITEMS_sap_Dialog.update_msg4"), true, "", "", "", "ignoringInput").toMessage());
                    }).catch(err => {
                        session.send("We are sorry services are down momentarily");
                        BISMController.logger.info("BISMController : forwardTicket : forwardTicketResult : Error", err);
                        throw new CustomError(err.message, "forwardTicketResult");
                    });
                }
                IBISDialog.logger.info("Exit : IBISDialog :[BISM:IBIS] ")
            }
            // (session: Session) => {
            //     chatHistoryUpdate(session.message.text, session, session.privateConversationData.configItem, session.privateConversationData.endOfConversation);
            //     session.endDialog();
            // }
        ]
    }
}