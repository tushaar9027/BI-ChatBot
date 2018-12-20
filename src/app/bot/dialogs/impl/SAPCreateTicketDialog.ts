import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, Session, Library } from 'botbuilder';
import { BISMController } from '../../../controller/BISMController';
import { PorpertiesUtil } from "./../../../../util/PropertiesUtil"

export class SAPCreateTicketDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("SAPCreateTicket", SAPCreateTicketDialog.getDialog()).triggerAction({
            matches: ["BISM:SAPCreateTicket", "SAPCreateTicket"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                if (PorpertiesUtil.translationSupport(session.privateConversationData.preferredLanguage)) {
                    session.message.text = session.privateConversationData.translationBeforeMessage;
                }
                session.privateConversationData.updateTicketDescriptionRequired = true;
                BISMController.retreiveAnswerMyShop(args.intent, args.entities, session, "BISM:SAP").then(responseGetAnswer => {
                    BISMController.createCallQnA(args.intent, '', args.intent + "->" + session.message.text, session).then(responseCreateCallQnA => {
                        session.send(JSON.parse(responseGetAnswer).Data[0].Answer);
                        session.privateConversationData.callId = responseCreateCallQnA;
                        session.beginDialog("BISM:SAP", responseCreateCallQnA);
                    }).catch(err => {
                        BISMController.logger.info("BISMController : retreiveAnswerMyShop :  bismService.getAnswer : Error :", err);
                        session.endDialog();
                    });
                });
            }
        ]
    }
}