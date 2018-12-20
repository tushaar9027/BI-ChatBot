import { Dialog, IDialogWaterfallStep, Session, EntityRecognizer, Library } from 'botbuilder';
import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { BIDialogsUtil } from '../BIDialogsUtil';
import { BISMController } from '../../../controller/BISMController';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from "../../../../util/PropertiesUtil";

export class QnADialog {
    static logger = ServerHandler.getLogger();

    public static getConfigItem(args: any, session: Session) {


        var intent: string = args.intent.split(":")[1].replace(/\./g, "");
        var entities: any = args.entities;
        console.log("value of intent=======>>>>>>>>>>>>>>>>>>>>>", intent);
        console.log("value of entity===============>>>>>>>>>>>>", entities);

        if (entities.length == 0) {
            session.dialogData.configItem = PorpertiesUtil.getJSONPropertiesWithoutSession("bi_configItems." + intent);
        }
        else {
            var entity = args.entities[0].entity.trim().replace(/ /g, '');
            session.dialogData.configItem = PorpertiesUtil.getJSONPropertiesWithoutSession("bi_configItems." + intent + entity);
        }
    }

    public static init(library: Library) {
        library.dialog("Qna.Dialog", QnADialog.getDialog()).triggerAction({
            matches: ["BISM:Qna.Dialog", "qnaDialog"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args: any) => {
                this.getConfigItem(args, session);
                if (PorpertiesUtil.translationSupport(session.privateConversationData.preferredLanguage)) {
                    session.message.text = session.privateConversationData.translationBeforeMessage;
                }
                session.privateConversationData.updateTicketDescriptionRequired = true;
                console.log("Tushar Entities: ");
                console.log(args.entities);
                var softwareNameEntity: any = EntityRecognizer.findEntity(args.entities, 'BI.AS');
                console.log("Tushar Soft Entities: ");
                console.log(softwareNameEntity);
                
                QnADialog.logger.debug("Entity Name : [QnADialog] ", softwareNameEntity);
                if (args.intent) {
                    BISMController.retreiveAnswer(args.intent, args.entities, session, session.message.text).then((responseGetAnswer) => {
                    //BISMController.retreiveAnswer(args.intent, null, session, session.message.text).then((responseGetAnswer) => {
                        let description = args.intent + "->" + session.message.text;
                        console.log("Tushar Description : " + description);
                        var flag = JSON.parse(responseGetAnswer).Data[0].Answer;
                        session.privateConversationData.issue = args.intent + "->" + session.message.text;
                        BISMController.createCallQnA(args.intent, '', description, session).then(responseCreateCallQnA => {
                            var str = JSON.parse(responseGetAnswer).Data[0].Answer;
                            var newMessage = str.replace("%20https", "https");
                            session.send(BIBotConnector.channelDataMessage(session, newMessage, false, "", "", "", "ignoringInput").toMessage());
                            session.privateConversationData.callId = responseCreateCallQnA;
                            session.dialogData.callId = responseCreateCallQnA;
                            let argsValue = {
                                "callId": responseCreateCallQnA,
                                "ConfigItemFlag": session.dialogData.configItem
                            }
                            if (flag) {
                                session.beginDialog('BISM:ask.MoreInformation', argsValue);
                            }
                            else {
                                session.send("Dialog Ended=========>>>>>>>>>>>>>>").endDialog();
                            }
                        }).catch(err => {
                            session.send("We are sorry services are down momentarily");
                            BISMController.logger.info("BISMController : retrieveAnswer : getAnswer: Error :", err);
                            session.endDialog();
                        });
                    })
                }

            }
        ]
    }
}