import { Dialog, IDialogWaterfallStep, Session, EntityRecognizer, Library } from 'botbuilder';
import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { BIDialogsUtil } from '../BIDialogsUtil';
import { BISMController } from '../../../controller/BISMController';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from "../../../../util/PropertiesUtil";

export class DemoQnADialog {
    static logger = ServerHandler.getLogger();
    public static init(library: Library) {
        library.dialog("Demo.Qna.Dialog", DemoQnADialog.getDialog()).triggerAction({
            matches: ["BISM:Demo.Qna.Dialog", "qnaDialog"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args: any) => {

                var intent: string = args.intent.split(":")[1].replace(/\./g, "");
                let check = intent.slice(7, 9);
                if (parseInt(check) > 42) {
                    session.dialogData.dataDisplay = PorpertiesUtil.getJSONPropertiesWithoutSession("demoData1." + intent);
                }
                else if (parseInt(check) <= 42) {
                    session.dialogData.dataDisplay = PorpertiesUtil.getJSONPropertiesWithoutSession("demoData." + intent);
                }
                if (PorpertiesUtil.translationSupport(session.privateConversationData.preferredLanguage)) {
                    session.message.text = session.privateConversationData.translationBeforeMessage;
                }
                session.privateConversationData.updateTicketDescriptionRequired = true;
                var softwareNameEntity: any = EntityRecognizer.findEntity(args.entities, 'BI.AS');
                DemoQnADialog.logger.debug("Entity Name : [QnADialog] ", softwareNameEntity);
                if (args.intent) {
                    let description = session.message.text;
                    console.log("args.intent----------->", args.intent);
                    console.log("session.dialogData.dataDisplay---->", session.dialogData.dataDisplay);
                    session.send(session.dialogData.dataDisplay);
                    BISMController.createCallQnA(args.intent, '', description, session).then(responseCreateCallQnA => {
                        session.privateConversationData.callId = responseCreateCallQnA;
                        session.dialogData.callId = responseCreateCallQnA;
                        let argsValue = {
                            "callId": responseCreateCallQnA,
                            "ConfigItemFlag": 'BI-NOS-INFORMATION'
                        }
                        session.beginDialog('BISM:Demo.ask.MoreInformation', argsValue);
                    }).catch(err => {
                        session.send("We are sorry services are down momentarily");
                        BISMController.logger.info("BISMController : retrieveAnswer : getAnswer: Error :", err);
                        session.endDialog();
                    });
                }

            }
        ]
    }
}