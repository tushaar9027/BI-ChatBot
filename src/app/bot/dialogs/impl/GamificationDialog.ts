import { ServerHandler } from "../../../../middleware/ServerHandlers";
import { IDialogWaterfallStep, Session, IDialogResult, IFindMatchResult, Prompts, Library } from 'botbuilder';
import { BIBotConnector } from "../../connector/BIBotConnector";
import { PorpertiesUtil } from "../../../../util/PropertiesUtil";
import { HttpUtil } from "../../../service/HttpUtil";
export class GamificationDialog {
    static logger = ServerHandler.getLogger()

    public static init(library: Library) {
        library.dialog("Questions.Gamification", GamificationDialog.getDialog()).triggerAction({
            matches: ["BISM:Questions.Gamification", "do I need an umbrella today?"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            async(session: Session, args: any) => {
                GamificationDialog.logger.info("Entered : GamificationDialog :[BISM:Questions.Gamification] ")
                console.log("value of User Country-------->>>>>>>>", session.privateConversationData.countryDetailsName);
                let userPrefCountry = session.privateConversationData.countryDetailsName.toUpperCase().match('AUSTRIA') ? 'Vienna' : session.privateConversationData.countryDetailsName;
                let response= await HttpUtil.httpGetCall("https://api.openweathermap.org/data/2.5/weather?", "APPID=c9e71b396aeaea0b830ed60727f851d6&q=" + userPrefCountry + "&mode=json&units=metric", "", "");
                console.log("responce from API 1===========>>>>>>>", response);
                let temperature= JSON.parse(response).main.temp;
                session.send("Temperature according to your prefered Location is " + temperature + " ℃.");
                Prompts.choice(session, "Has this answer your question", "Yes|No");
                PorpertiesUtil.tranlationFlagCleaner(session);
                session.send("Thank you for contacting MySupport.").endDialog();
                GamificationDialog.logger.info("Exit : GamificationDialog :[BISM:Questions.Gamification] ")
                /*
                if (PorpertiesUtil.translationSupport(session.privateConversationData.preferredLanguage)) {
                    session.message.text = session.privateConversationData.translationBeforeMessage;
                }            
                session.privateConversationData.updateTicketDescriptionRequired = false;
                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.questionsGamificationDialog.weatherMsg")
                    , false, "", "", "", "ignoringInput").toMessage());
                session.privateConversationData.endConversation = true;
                Prompts.text(session, BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage());
                */
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                if (results.response.index == 0) {
                    session.send("Thank you for contacting MySupport.").endDialog();
                    GamificationDialog.logger.info("Exit : GamificationDialog :[BISM:Questions.Gamification] ")
                }
                else {
                    Prompts.text(session, "Please Enter your country/city?");
                }
            },
            async(session: Session, results: IDialogResult<any>, args: any) => {
                let country = results.response.toUpperCase().match('AUSTRIA')  ? 'Vienna' : results.response;
            let response = await HttpUtil.httpGetCall("https://api.openweathermap.org/data/2.5/weather?", "APPID=c9e71b396aeaea0b830ed60727f851d6&q=" + country + "&mode=json&units=metric", "", "");
            console.log("responce from API 2=============>>>>>>>>", response);
            if(JSON.parse(response).cod == 200) {
            let temperature = JSON.parse(response).main.temp;
            session.send("Temperature " + temperature + " ℃.");
            session.send("Thank you for contacting MySupport.").endDialog();
            GamificationDialog.logger.info("Exit : GamificationDialog :[BISM:Questions.Gamification] ")
        }
        else {
            Prompts.text(session, "Please Enter your country/city in right format?");
        }
    },
    async(session: Session, results: IDialogResult<any>, args: any) => {
        
    let country = results.response.toUpperCase().match('AUSTRIA')  ? 'Vienna' : results.response;
    let response = await HttpUtil.httpGetCall("https://api.openweathermap.org/data/2.5/weather?", "APPID=c9e71b396aeaea0b830ed60727f851d6&q=" + country + "&mode=json&units=metric", "", "");
    console.log("responce from API 3=============>>>>>>>>", response);
    if (JSON.parse(response).cod == 200) {
        let temperature = JSON.parse(response).main.temp;
        session.send("Temperature " + temperature + " ℃.");;
    }
    session.send("Thank you for contacting MySupport.").endDialog();
    GamificationDialog.logger.info("Exit : GamificationDialog :[BISM:Questions.Gamification] ")
}
]
}
}