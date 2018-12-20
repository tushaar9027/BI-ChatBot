import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, Session, Library } from 'botbuilder';
import { BISMController } from '../../../controller/BISMController';
export class OutlookDLDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("outlook.distributionlist", OutlookDLDialog.getDialog()).triggerAction({
            matches: ["BISM:outlook.distributionlist", "outlook distributionlist"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                BISMController.retreiveAnswerMyShop(args.intent, args.entities, session, "BISM:outlook.distribution").then(responseGetAnswer => {
                    BISMController.createCallQnA(args.intent, '', args.intent + "->" + session.message.text, session).then(responseCreateCallQnA => {
                        session.send(JSON.parse(responseGetAnswer).Data[0].Answer);
                        session.privateConversationData.callId=responseCreateCallQnA;
                        session.beginDialog("BISM:outlook.distribution", responseCreateCallQnA);
                    }).catch(err => {
                        BISMController.logger.info("BISMController : retreiveAnswerMyShop :  bismService.getAnswer : Error :", err);
                        session.endDialog();
                    });
                });;

            }
        ]
    }
}