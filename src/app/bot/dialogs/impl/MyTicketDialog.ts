import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, Session, IDialogResult, IFindMatchResult, Prompts, Library } from 'botbuilder';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { BIBotConnector } from '../../connector/BIBotConnector';
export class MyTicketDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("My.Ticket", MyTicketDialog.getDialog()).triggerAction({
            matches: ["BISM:My.Ticket", "myTicket"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.myTicketDialog.prompt_choice"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.myTicketDialog.prompt_choice_Result"), "", "", "expectingInput").toMessage();
                Prompts.choice(session, msg, PorpertiesUtil.choiceOption(session).choice, PorpertiesUtil.choiceOption(session).options);
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                if (results.response.index == 0) {
                    session.beginDialog('BISM:ask.CallId');
                }
                else if (results.response.index == 1) {
                    session.beginDialog('BISM:ask.Status');
                }
            }

        ];
    }
}