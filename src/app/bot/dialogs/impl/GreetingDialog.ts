import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, Session, Library } from 'botbuilder';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { BISMController } from '../../../controller/BISMController';
import { CardFactory } from '../../card/CardFactory'; //by sakshi


export class GreetingDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("Greeting", GreetingDialog.getDialog()).triggerAction({
            matches: ["BISM:Greeting", "Greeting"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            async(session: Session, args) => {
                console.log("in greetings");
                GreetingDialog.logger.info("inside greeting dlg :", session.privateConversationData.userDetails);
		GreetingDialog.logger.info("checking the greeting change in Github :", session.privateConversationData.userDetails);
                if(PorpertiesUtil.translationSupport(session.privateConversationData.preferredLanguage)) {
                    session.message.text = session.privateConversationData.translationBeforeMessage;
                }
             /*   var date = new Date();
             
                // var fmt = 'MMMM DD, YYYY HH:mm:ss';
                  
                // console.log(m.utc().format(fmt));     session.send(m.local().toString()).endDialog();
                var date = new Date();
                session.send(date.toString());
                let finalDate= date.toString();
               
                let check = finalDate.slice(4, 15);
                session.send(check);
                let today:any = new Date();
                let dd:any = today.getDate();

                let mm:any = today.getMonth() + 1; 
                let yyyy:any = today.getFullYear();
                if(dd<10) 
                {
                    dd = '0' + dd;
                } 
                 if(mm<10) {
                    mm = '0' + mm;
                } 
                today = yyyy + '-' + mm + '-' + dd;
             
               
                // session.send(date.toISOString());
                // console.log("---------------"+date.getUTCDate());*/
                session.privateConversationData.endConversation = true;
                // Added by Yashi for Hi Sam Dialog---->
                //session.send(BIBotConnector.channelDataMessage(session, session.message.text, false, "", "", "", "ignoringInput").toMessage());
                // BISMController.getUpdateTicketDescription().then(a=> {

                // })
                PorpertiesUtil.tranlationFlagCleaner(session);  
                // session.send("Welcome to BI");
                session.beginDialog("BISM:ExistingTicket", args);
                
                //session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.greetingDlg.msg1"), false, "", "", "", "ignoringInput").toMessage());  
				//session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.greetingDlg.msg2"), false, "", "", "", "ignoringInput").toMessage());
				//session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.greetingDlg.msg3"), false, "", "", "", "ignoringInput").toMessage());
				//session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.greetingDlg.msg4"), false, "", "", "", "expectingInput").toMessage()).endDialog();  
            }
        ]
    }
}
