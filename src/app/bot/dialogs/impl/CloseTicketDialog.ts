import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, Session, IFindMatchResult, Prompts, IDialogResult, Library, Message } from 'botbuilder';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { BISMController } from '../../../controller/BISMController';
import { CardFactory } from '../../card/CardFactory';
export class CloseTicketDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("Close.Ticket", CloseTicketDialog.getDialog()).triggerAction({
            matches: ["BISM:Close.Ticket", "closeTicket", "ticket close"]
        });
    }

    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                CloseTicketDialog.logger.info("Entered : CloseTicketDialog :[BISM:Close.Ticket] ")
                session.privateConversationData.updateTicketDescriptionRequired = true;
                var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.closeTicketDialog.prompt_choice"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.closeTicketDialog.prompt_choice_result"), "", "", "expectingInput").toMessage();
                Prompts.choice(session, msg, PorpertiesUtil.choiceOption(session).choice, PorpertiesUtil.choiceOption(session).options);
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                session.dialogData.status = results.response;
                BISMController.getMyTickets(session.userData.userID, '', session.dialogData.status.entity, session).then(response => {
                    let responseDataLength = JSON.parse(response);
                    var card: any = {};
                    var card = CardFactory.getMyTicket(session, responseDataLength);
                    const message = new Message(session);
                    message.text(card.textCard);
                    PorpertiesUtil.tranlationFlagCleaner(session);
                    session.privateConversationData.updateTicketDescriptionRequired = false;
                    session.send(message).endDialog();
                });;
                CloseTicketDialog.logger.info("Exit : CloseTicketDialog :[BISM:Close.Ticket] ")
            }
        ];
    }
}