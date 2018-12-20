import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { Library, IDialogWaterfallStep, Session, Prompts, IFindMatchResult, IDialogResult, EntityRecognizer } from 'botbuilder';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { BISMController } from '../../../controller/BISMController';
import { chatHistoryUpdate } from '../../../../util/ChatHistoryUtil';
let date = require('date-and-time');

export class AskCallIdContinueDialog {

    static logger = ServerHandler.getLogger();
    public static init(library: Library) {
        library.dialog("againCall", AskCallIdContinueDialog.getDialog()).triggerAction({
            matches: ["BISM:againCall", "again call", "again call"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                AskCallIdContinueDialog.logger.info("Entered : AskCallIdContinueDialog :[BISM:againCall] ")
                session.dialogData.callId = args;
                var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.callAgain.prompt_choice"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.callAgain.prompt_choice_Result"), "", "", "expectingInput").toMessage();
                var options = PorpertiesUtil.getJSONProperties(session, "BotBuilder.value")
                Prompts.choice(session, msg, msg.sourceEvent.listOption, options);
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                session.dialogData.additionalInfo = results.response.entity;
                BISMController.updateCall(session.dialogData.callId, PorpertiesUtil.getJSONProperties(session, "bismLanguage.dateTimeValidation.msg3") + ":" + session.dialogData.additionalInfo, '', session).then(result=> {
                    let description = "Call Me Back Requested between " + session.dialogData.additionalInfo + "\n" + "Phone Number:" + session.privateConversationData.phoneNumber + "\n" + "Current Location:" + session.privateConversationData.countryDetailsName + "\n" + "Issue Description:"
                    BISMController.getUpdateTicketDescription(session, session.dialogData.callId, session.userData.userID, description);
                });
                if (session.privateConversationData.preferredLanguage == "de") {
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.agent_call") + session.dialogData.additionalInfo + " " + PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.agent_call1"), false, "", "", "", "ignoringInput").toMessage());
                }
                else if (session.privateConversationData.preferredLanguage == "en") {
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.agent_call") + session.dialogData.additionalInfo + ".", false, "", "", "", "ignoringInput").toMessage());
                }
                setTimeout(function () {
                    PorpertiesUtil.tranlationFlagCleaner(session);
                    session.privateConversationData.updateTicketDescriptionRequired = false;
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage());
                }, 1500);
                AskCallIdContinueDialog.logger.info("Exit : AskCallIdContinueDialog :[BISM:againCall] ")
            }
        ];
    }
}