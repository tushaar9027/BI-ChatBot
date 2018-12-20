import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, Session, Prompts, IDialogResult, IFindMatchResult, Library } from 'botbuilder';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { BISMController } from '../../../controller/BISMController';
export class MyShopReqStatusDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("MyShop.ReqStatus", MyShopReqStatusDialog.getDialog()).triggerAction({
            matches: ["BISM:MyShop.ReqStatus", "myShopReqStatus", "status of my request", "Status"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                if (PorpertiesUtil.translationSupport(session.privateConversationData.preferredLanguage)) {
                    session.message.text = session.privateConversationData.translationBeforeMessage;
                }
                session.privateConversationData.updateTicketDescriptionRequired = true;
                BISMController.retreiveAnswerMyShop(args.intent, args.entities, session, "BISM:MyShop.Req").then(responseGetAnswer => {
                    BISMController.createCallQnA(args.intent, '', args.intent + "->" + session.message.text, session).then(responseCreateCallQnA => {
                        session.send(JSON.parse(responseGetAnswer).Data[0].Answer);
                        session.privateConversationData.callId = responseCreateCallQnA;
                        session.beginDialog("BISM:MyShop.Req", responseCreateCallQnA);
                    }).catch(err => {
                        BISMController.logger.info("BISMController : retreiveAnswerMyShop :  bismService.getAnswer : Error :", err);
                        session.endDialog();
                    });
                });
                ;
            }
        ];
    }
}