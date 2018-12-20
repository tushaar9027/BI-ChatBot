import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, Session, Prompts, IFindMatchResult, IDialogResult, Library } from 'botbuilder';
import { BISMController } from '../../../controller/BISMController';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
export class OutlookDLContinueDialog{
    static logger = ServerHandler.getLogger();

    public static init(library:Library){
        library.dialog("outlook.distribution", OutlookDLContinueDialog.getDialog()).triggerAction({
            matches: ["BISM:outlook.distribution", "outlook distributionlist"]
        });
    }
    private static getDialog():IDialogWaterfallStep[]{
        return [
            (session: Session, args) => {
                session.dialogData.callId = args;
                Prompts.text(session, BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.outlookDistributionDialog.prompt_msg"), false, "", "", "", "expectingInput").toMessage());
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                session.dialogData.errorMsg = results.response;
                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.outlookDistributionDialog.message1"), false, "", "", "", "ignoringInput").toMessage());
                let argsValue = {
                    "callId": session.dialogData.callId,
                    "ConfigItemFlag": "BI-NOS-INFORMATION"
                }
                session.beginDialog('BISM:ask.MoreInformation', argsValue);
            }
    
        ];
    }
}