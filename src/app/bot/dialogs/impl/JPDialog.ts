import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, Session, Prompts, IDialogResult, IFindMatchResult, Library } from 'botbuilder';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { BISMController } from '../../../controller/BISMController';
import { CustomError } from '../../../../util/ErrorHandlingUtil';
import { chatHistoryUpdate } from '../../../../util/ChatHistoryUtil';
export class JPDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("JP", JPDialog.getDialog()).triggerAction({
            matches: ["BISM:JP", "JP"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                JPDialog.logger.info("Entered : JPDialog :[BISM:JP] ")
                session.dialogData.callId = args;
                console.log("value of Call Id in JP Dialog------------------------->>>>>>>>>", session.dialogData.callId);
                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.common_SAP_Dialog.msg1"), false, "", "", "", "ignoringInput").toMessage());
                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.common_SAP_Dialog.msg2"), false, "", "", "", "ignoringInput").toMessage());
                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.JP_Sap_Dialog.jp_msg"), false, "", "", "", "ignoringInput").toMessage());
                var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.JP_Sap_Dialog.jp_prompt_msg"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.prompt_choice_result"), "", "", "expectingInput").toMessage();
                Prompts.choice(session, msg, PorpertiesUtil.choiceOption(session).choice, PorpertiesUtil.choiceOption(session).options);

            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                if (results.response.index == 0) {
                    PorpertiesUtil.tranlationFlagCleaner(session);
                    // BISMController.closeCall(session.dialogData.callId, 'SATISFIED', session, 'BI-AS-SAP-SUPREME-ECC').then(response => {
                    session.privateConversationData.configItem = PorpertiesUtil.getJSONPropertiesWithoutSession("bi_configItems.JPSAPDialog");
                    session.privateConversationData.endOfConversation = true;
                    session.privateConversationData.closeRequired = true;
                    session.privateConversationData.dialogEnd = true;
                    session.privateConversationData.updateTicketDescriptionRequired = false;
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.ITEMS_sap_Dialog.items_ticket_close") + session.dialogData.callId + ".", false, "", "", "", "ignoringInput").toMessage());
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.ITEMS_sap_Dialog.items_thank"), true, "", "", "", "ignoringInput").toMessage());
                    // });
                }
                else if (results.response.index == 1) {
                    BISMController.forwardTicket(session.dialogData.callId, 'Need Support for Password Change', session, session.userData.user_ID).then(response => {
                        session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.ITEMS_sap_Dialog.update_msg1") + session.dialogData.callId + PorpertiesUtil.getJSONProperties(session, "bismLanguage.ITEMS_sap_Dialog.update_msg3"), false, "", "", "", "ignoringInput").toMessage());
                        PorpertiesUtil.tranlationFlagCleaner(session);//this have been commented to stop tranlation before chatHistory
                        session.privateConversationData.configItem = '';
                        session.privateConversationData.endOfConversation = false;
                        session.privateConversationData.closeRequired = false;
                        session.privateConversationData.dialogEnd = true;
                        session.privateConversationData.updateTicketDescriptionRequired = false;
                        session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.ITEMS_sap_Dialog.update_msg4"), true, "", "", "", "ignoringInput").toMessage());
                    }).catch(err => {
                        session.send("We are sorry services are down momentarily");
                        BISMController.logger.info("BISMController : forwardTicket : forwardTicketResult : Error", err);
                        throw new CustomError(err.message, "forwardTicketResult");
                    });
                }
                JPDialog.logger.info("Exit : JPDialog :[BISM:JP] ")
            },
            // (session: Session) => {
            //     chatHistoryUpdate(session.message.text, session, session.privateConversationData.configItem, session.privateConversationData.endOfConversation);
            // }
        ];
    }
}