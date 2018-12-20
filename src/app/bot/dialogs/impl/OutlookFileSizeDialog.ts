import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, Session, Library } from 'botbuilder';
import { BISMController } from '../../../controller/BISMController';
export class OutlookFileSizeDialog{
    static logger = ServerHandler.getLogger();

    public static init(library:Library){
        library.dialog("outlook.filesize", OutlookFileSizeDialog​​.getDialog()).triggerAction({
            matches: ["BISM:outlook.filesize", "outlook filesize"]
        });
    }
    private static getDialog():IDialogWaterfallStep[]{
        return [
            (session: Session, args: any, next: any) => {
                BISMController.retreiveAnswerMyShop(args.intent, args.entities, session, "BISM:outlook.file").then(responseGetAnswer => {
                    BISMController.createCallQnA(args.intent, '', args.intent+"->"+session.message.text, session).then(responseCreateCallQnA => {
                        session.send(JSON.parse(responseGetAnswer).Data[0].Answer);
                        session.privateConversationData.callId=responseCreateCallQnA;
                        session.beginDialog("BISM:outlook.file", responseCreateCallQnA);
                    }).catch(err => {
                        BISMController.logger.info("BISMController : retreiveAnswerMyShop :  bismService.getAnswer : Error :", err);
                        session.endDialog();
                    });
                });;
            }
        ]
    }
}