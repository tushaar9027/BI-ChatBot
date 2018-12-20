import { ServerHandler } from "../../../../middleware/ServerHandlers";
import { Session, IDialogWaterfallStep, Library, Prompts } from 'botbuilder';
import { BIBotConnector } from "../../connector/BIBotConnector";
import { PorpertiesUtil } from "../../../../util/PropertiesUtil";

export class AskTimeDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("BISM:ask.time", AskTimeDialog​​.getDialog()).triggerAction({
            matches: ["BISM:ask.time"]
        });
    }

    private static getDialog(): IDialogWaterfallStep[] {   // function code added by tushar
        return [
            (session: Session, args) => {
                session.privateConversationData.translationSupport == false;
                AskTimeDialog.logger.info("inside Ask Time dlg :", session.privateConversationData.userDetails);
                //session.privateConversationData.translationSupport = true;
                //if(PorpertiesUtil.translationSupport(session.privateConversationData.preferredLanguage)) {
                // session.message.text = session.privateConversationData.translationBeforeMessage;
                // console.log(session.message.text);
                // }
                //PorpertiesUtil.tranlationFlagCleaner(session);
               // var usercountrycode = session.privateConversationData.countryDetailsCode;
                var usercountrycode = session.privateConversationData.countryDetailsName;
                console.log("user Country Code :- " + usercountrycode);
                var offsetnum = PorpertiesUtil.getJSONPropertiesWithoutSession("BI_TimeOffsets." + usercountrycode);
                console.log("Region Time Offset :- " + offsetnum);
                // var offsetnum =  4;
                var d = new Date();
                //var localTime = d.getTime();
                //var localOffset = d.getTimezoneOffset() * 60000;
                //var utc = localTime + localOffset;
                //var offset = offsetnum;
                //var est = utc + (3600000*offset);
                //var od = new Date(est);
                var od = AskTimeDialog.gettime(d, offsetnum);
                let resultdate = od.toString().slice(0, 24);
                //session.send("Time based on your current setting is:-" + od.toString()).endDialog();
            
                //session.send("Time based on your current setting is:-" + resultdate.toString());
                session.send(resultdate.toString());
               //Prompts.choice(session, "Are you satisfied with the response ?", "Yes|No", { listStyle: 2 });
                //Prompts.choice(session,BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.asktimeDialog.asktimeConfirm"), false, "", "", "", "ignoringInput").toMessage(), "Yes|No", { listStyle: 2 });
             var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.asktimeDialog.ask_prompt_choice"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.asktimeDialog.ask_prompt_choice_result"), "", "", "expectingInput").toMessage();
                console.log("tushar channel data:" + msg.toString());
                Prompts.choice(session, msg, PorpertiesUtil.choiceOption(session).choice, PorpertiesUtil.choiceOption(session).options);

            },
            (session: Session, results: any, args: any) => {
                if (results.response.index == 0) {
                    //session.send("Thank you for contacting Mysupport").endDialog();
                    session.privateConversationData.translationSupport == true;
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank"),true,"","","","ignoringInput").toMessage()).endDialog();
                }
                else {
                    //Prompts.text(session, "Please enter the country?");
                    Prompts.text(session,BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.asktimeDialog.asktimecountry"), false,"","","","ignoringInput").toMessage());
                }
            },
            (session: Session, results: any, args: any) => {
                let countryname = results.response;
                //countryname = "Australia";
                if (PorpertiesUtil.getJSONPropertiesWithoutSession("BI_TimeOffsets." + countryname)) {
                    let d = new Date();
                    let offsetnum = PorpertiesUtil.getJSONPropertiesWithoutSession("BI_TimeOffsets." + countryname)
                    //let offsetnum = 4; 
                    let od = AskTimeDialog.gettime(d, offsetnum);
                    let resultdate = od.toString().slice(0, 24);
                    //session.send("Time based on your country input:-" + resultdate.toString());
                    session.privateConversationData.translationSupport == true;
                    session.send(resultdate.toString()).endDialog();
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank"),true,"","","","ignoringInput").toMessage()).endDialog();
                }
                else {
                    //session.send("The entered country name is not correct,Please try again later.").endDialog();
                    session.privateConversationData.translationSupport == true;
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.asktimeDialog.asktimecountrynotvalid"),false,"","","", "ignoringInput").toMessage());
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank"),true,"","","","ignoringInput").toMessage()).endDialog();
                }

            }

        ]
    }

    private static gettime(d: any, offsetnum: any) {
        var localTime = d.getTime();
        var localOffset = d.getTimezoneOffset() * 60000;
        var utc = localTime + localOffset;
        var offset = offsetnum;
        var est = utc + (3600000 * offset);
        var oddate = new Date(est);
        return oddate;
    }


}