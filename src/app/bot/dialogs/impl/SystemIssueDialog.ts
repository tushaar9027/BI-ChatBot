import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, Session, Prompts, IFindMatchResult, IDialogResult, Library } from 'botbuilder';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { BISMController } from '../../../controller/BISMController';
export class SystemIssueDialog {

    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("System.Issue", SystemIssueDialog.getDialog()).triggerAction({
            matches: ["BISM:System.Issue", "systemIssue", "issue in system"]
        });

    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                Prompts.text(session, BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.systemIssueDialog.host_Name"), false, "", "", "", "expectingInput").toMessage());
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                session.dialogData.hostName = results.response;
                Prompts.text(session, BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.systemIssueDialog.user_Name"), false, "", "", "", "expectingInput").toMessage());
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                session.dialogData.userName = results.response;
                Prompts.text(session, BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.systemIssueDialog.description"), false, "", "", "", "expectingInput").toMessage());
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                session.dialogData.description = results.response;
                let description = session.dialogData.hostName + '\n' + session.dialogData.userName + '\n'
                    + session.dialogData.description;
                BISMController.createCall(args.intent, args.entities, description, session).then(response => {
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.your_callID") + JSON.parse(response).CallID + '.' + PorpertiesUtil.getJSONProperties(session, "bismLanguage.controller_msg.call_msg"), false, "", "", "", "ignoringInput").toMessage());
                    PorpertiesUtil.tranlationFlagCleaner(session);
                    session.endDialog();
                });
            }
        ];
    }
}