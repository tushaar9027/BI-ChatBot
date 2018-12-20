import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, Session, IDialogResult, IFindMatchResult, Library } from 'botbuilder';
import { BISMController } from '../../../controller/BISMController';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
export class OutlookFileDialog{
    static logger = ServerHandler.getLogger();

    public static init(library:Library){
        library.dialog("outlook.file", OutlookFileDialog.getDialog()).triggerAction({
            matches: ["BISM:outlook.file", "outlook file"]
        });
    }
    private static getDialog():IDialogWaterfallStep[]{
        return [
            (session: Session, args: any, next: any) => {
                session.dialogData.callId = args;
                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.outlookFileDialog.message1"), false, "", "", "", "ignoringInput").toMessage());
                next();
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.outlookFileDialog.message2"), false, "", "", "", "ignoringInput").toMessage());
                let argsValue = {
                    "callId": session.dialogData.callId,
                    "ConfigItemFlag": "BI-NOS-INFORMATION"
                }
                session.beginDialog('BISM:ask.MoreInformation', argsValue);
            }
    
        ];
    }
}