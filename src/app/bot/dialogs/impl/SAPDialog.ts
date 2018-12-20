import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, Session, IFindMatchResult, IDialogResult, Prompts, Library } from 'botbuilder';
import { BISMController } from '../../../controller/BISMController';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { CustomError } from '../../../../util/ErrorHandlingUtil';
import { chatHistoryUpdate } from '../../../../util/ChatHistoryUtil';
export class SAPDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("SAP", SAPDialog.getDialog()).triggerAction({
            matches: ["BISM:SAP", "SAP"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args: any) => {
                session.dialogData.callId = args;
                var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.SAPDialog.prompt_msg"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.prompt_choice_result"), "", "", "expectingInput").toMessage();
                var options = PorpertiesUtil.getJSONProperties(session, "BotBuilder.value")
                Prompts.choice(session, msg, msg.sourceEvent.listOption, options);
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                if (results.response.index == 0) {
                    session.sendTyping();
                    setTimeout(function () {
                        session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.SAPDialog.systemAdministratorMsg"), false, "", "", "", "ignoringInput").toMessage());
                    }, 2000);
                    session.sendTyping();
                    setTimeout(function () {
                        var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.SAPDialog.systemAdministratorPrompt"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.SAPDialog.systemAdministratorPromptChoice"), "", "", "expectingInput").toMessage();
                        var options = PorpertiesUtil.getJSONProperties(session, "BotBuilder.value")
                        Prompts.choice(session, msg, msg.sourceEvent.listOption, options);
                    }, 2000);
                }
                else if (results.response.index == 1) {
                    var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.SAPDialog.prompt_no_msg_prompt"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.SAPDialog.prompt_no_msg_prompt_choice"), "", "", "expectingInput").toMessage();
                    var options = PorpertiesUtil.getJSONProperties(session, "BotBuilder.value")
                    Prompts.choice(session, msg, msg.sourceEvent.listOption, options);
                }

            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {

                if (results.response.entity == 'Yes' || results.response.entity == 'Ja') {
                    // BISMController.closeCall(session.dialogData.callId, 'SATISFIED', session, 'BI-NOS-INFORMATION').then((response) => {
                    PorpertiesUtil.tranlationFlagCleaner(session);
                    session.privateConversationData.configItemFlag = 'BI-NOS-INFORMATION';
                    session.privateConversationData.closeRequired = true;
                    session.privateConversationData.dialogEnd = true;
                    session.privateConversationData.updateTicketDescriptionRequired = false;
                    // session.privateConversationData.endOfConversation = true;
                    // session.privateConversationData.callChatUpdate = true;
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.SAPDialog.systemAdministratorPromptYesMessage") + session.dialogData.callId + ".", false, "", "", "", "ignoringInput").toMessage());
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.SAPDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage());
                    // });
                }
                else if (results.response.entity == 'No' || results.response.entity == 'Nein') {
                    BISMController.forwardTicket(session.dialogData.callId, 'Need Support for Password Change', session, session.userData.user_ID).then(response => {
                        session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.SAPDialog.systemAdmininstratorPromptNoMessage") + session.dialogData.callId + PorpertiesUtil.getJSONProperties(session, "bismLanguage.ITEMS_sap_Dialog.update_msg3"), false, "", "", "", "ignoringInput").toMessage());
                        PorpertiesUtil.tranlationFlagCleaner(session);//this have been commented to stop tranlation before chatHistory
                        session.privateConversationData.configItemFlag = '';
                        session.privateConversationData.closeRequired = false;
                        session.privateConversationData.dialogEnd = true;
                        // session.privateConversationData.endOfConversation = false;
                        // session.privateConversationData.callChatUpdate = true;
                        session.privateConversationData.updateTicketDescriptionRequired = false;
                        session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.ITEMS_sap_Dialog.update_msg4"), true, "", "", "", "ignoringInput").toMessage());
                    }).catch(err => {
                        session.send("We are sorry services are down momentarily");
                        BISMController.logger.info("BISMController : forwardTicket : forwardTicketResult : Error", err);
                        throw new CustomError(err.message, "forwardTicketResult");
                    });
                }
                else if (results.response.index == 0) {
                    session.beginDialog("BISM:IBIS", session.dialogData.callId);
                }
                else if (results.response.index == 1) {
                    session.beginDialog("BISM:ITEMS", session.dialogData.callId);
                }
                else if (results.response.index == 2) {
                    session.beginDialog("BISM:JP", session.dialogData.callId);
                }
                else if (results.response.index == 3) {
                    session.beginDialog("BISM:US", session.dialogData.callId);
                }
                else if (results.response.index == 4) {
                    session.beginDialog("BISM:HRP", session.dialogData.callId);
                }
                else if (results.response.index == 5) {
                   let msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.SAPDialog.insure_protection_prompt"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.SAPDialog.insure_protection_prompt_choice"), "", "", "expectingInput").toMessage();
                    Prompts.choice(session, msg, msg.sourceEvent.listOption, PorpertiesUtil.choiceOption(session).options);
                    //session.beginDialog("BISM:MySysNtListed", session.dialogData.callId);
                }
                else if (results.response.index == 6) {
                    session.beginDialog("BISM:MySysNtListed", session.dialogData.callId);
                }
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                if(results.response.index == 0){
                    session.beginDialog("BISM:ERP", session.dialogData.callId);
                }
                else if(results.response.index == 1){
                   session.beginDialog("BISM:BW", session.dialogData.callId);
                }
                else if(results.response.index == 2){
                    session.beginDialog("BISM:MySysNtListed", session.dialogData.callId);
                }
            }
        ]
    }
}