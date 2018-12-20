import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, Session, Prompts, IDialogResult, IFindMatchResult, Library, Message } from 'botbuilder';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { BISMController } from '../../../controller/BISMController';
import { CardFactory } from '../../card/CardFactory';
export class AskCallStatusDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("ask.Status", AskCallStatusDialog.getDialog()).triggerAction({
            matches: ["BISM:ask.Status", "askStatus", "Status"]
        });
    }

    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                AskCallStatusDialog.logger.info("Entered : AskCallStatusDialog :[BISM:ask.Status] ")
                var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askStatusDialog.prompt_choice"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askStatusDialog.prompt_choice_result"), "", "", "expectingInput").toMessage();
                Prompts.choice(session, msg, msg.sourceEvent.listOption, PorpertiesUtil.choiceOption(session).options);
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                session.dialogData.status = results.response;
                let payloadStatus;
                if (results.response.index == 0) {
                    payloadStatus = PorpertiesUtil.getJSONPropertiesWithoutSession("getMyTicket.open");
                    console.log(payloadStatus);
                }
                else if (results.response.index == 1) {
                    payloadStatus = PorpertiesUtil.getJSONPropertiesWithoutSession("getMyTicket.closed30")
                }
                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askStatusDialog.ticket_msg"), false, "", "", "", "ignoringInput").toMessage());
                BISMController.getMyTickets(session.userData.userID, '', payloadStatus, session).then(response => {
                    let responseDataLength = JSON.parse(response);
                    var card: any = {};
                    var card = CardFactory.getMyTicket(session, responseDataLength);
                    const message = new Message(session);
                    message.text(card.textCard);
                    session.privateConversationData.updateTicketDescriptionRequired = false;
                    PorpertiesUtil.tranlationFlagCleaner(session);
                    console.log("Before send Tushar");
                    session.send(message);
                    console.log("Message Tushar:- " + message);
                    console.log("After send Tushar");
                    //Prompts.text(session, BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage());
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"),false,"","","","ignoringInput").toMessage()).endDialog();
                    //session.privateConversationData.updateTicketDescriptionRequired = false;
                    //session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), false, "", "", "", "ignoringInput").toMessage());
                    //session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true,"","","","ignoringInput").toMessage()).endDialog();
                    
                });
                AskCallStatusDialog.logger.info("Exit : AskCallStatusDialog :[BISM:ask.Status] ")
            }
        ]
    }
}