import { ServerHandler } from "../../../../middleware/ServerHandlers";
import { IDialogWaterfallStep, Session, IDialogResult, IFindMatchResult, Prompts, Library } from 'botbuilder';
import { BIBotConnector } from "../../connector/BIBotConnector";
import { PorpertiesUtil } from "../../../../util/PropertiesUtil";
import { HttpUtil } from "../../../service/HttpUtil";
export class WeatherDialog {
    static logger = ServerHandler.getLogger()
    public static init(library: Library) {
        library.dialog("Questions.Gamification", WeatherDialog.getDialog()).triggerAction({
            matches: ["BISM:Questions.Gamification", "do I need an umbrella today?"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            async(session: Session, args: any) => {
               
             WeatherDialog.logger.info("Entered : WeatherDialog :[BISM:Questions.Gamification] :", session.privateConversationData.userDetails);
             session.privateConversationData.translationSupport == false;
             var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.weatherDialog.Location"), false, "", "", "", "expectingInput").toMessage();
             //var msg = PorpertiesUtil.getJSONProperties(session,"bismLanguage.weatherDialog.Location");
             Prompts.text(session, msg);
                
            },
            async(session: Session, results: IDialogResult<any>, args: any) => {
               
                if(results.response.includes(","))
                {
                let city = results.response.split(",",2)[0];
				let country = results.response.split(",",2)[1];
                console.log("city : " + city);
                console.log("country : " + country);
                let response = await HttpUtil.httpGetCall("https://api.openweathermap.org/data/2.5/weather?", "APPID=c9e71b396aeaea0b830ed60727f851d6&q=" + city + "," + country + "&mode=json&units=metric", "", "");
                console.log("responce from API 2=============>>>>>>>>", response);
                if(JSON.parse(response).cod == 200) {
                  let temperature = JSON.parse(response).main.temp;
                  console.log("Temp in C: " + temperature);
				  let temp_f = (temperature * 9/5) + 32;
                  console.log("Temp in f: " + temp_f);
                  console.log("round",temp_f.toFixed(2));
                  let msgtemp = PorpertiesUtil.getJSONPropertiesWithoutSession("bismLanguage.weatherDialog.TempText." + session.privateConversationData.preferredLocale);
                  let msgtempor = PorpertiesUtil.getJSONPropertiesWithoutSession("bismLanguage.weatherDialog.TempTextor." + session.privateConversationData.preferredLocale);
                  session.send(msgtemp + temperature.toFixed(2) + msgtempor + temp_f.toFixed(2) + "°F");
                  //session.send("Temperature is " + temperature.toFixed(2) + "°C or " + temp_f.toFixed(2) + "°F");
                  //session.send("Thank you for contacting MySupport.").endDialog();
                  session.privateConversationData.translationSupport == true;
                  session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank"),true,"","","","ignoringInput").toMessage()).endDialog();
                  //session.send(PorpertiesUtil.getJSONProperties(session,"bismLanguage.askMoreInformationDialog.thank")).endDialog();
                  
                  WeatherDialog.logger.info("Exit : WeatherDialog :[BISM:Questions.Gamification] ")
				}
				else {
                  //Prompts.text(session, "Location could not be found.Please Enter your location in correct city,country format");
                  var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.weatherDialog.Locationnotvalid"), false, "", "", "", "expectingInput").toMessage();
                  //var msg = PorpertiesUtil.getJSONProperties(session,"bismLanguage.weatherDialog.Locationnotvalid");
                  Prompts.text(session, msg);
				}
               }
               else
               {
                   console.log("Inside else of includes ");
                   var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.weatherDialog.Locationnotvalid"), false, "", "", "", "expectingInput").toMessage();
                   Prompts.text(session, msg);
               }
			},
			async(session: Session, results: IDialogResult<any>, args: any) => {
                if(results.response.includes(","))
                {
				let city = results.response.split(",",2)[0]
				let country = results.response.split(",",2)[1]
                let response = await HttpUtil.httpGetCall("https://api.openweathermap.org/data/2.5/weather?", "APPID=c9e71b396aeaea0b830ed60727f851d6&q=" + city + "," + country + "&mode=json&units=metric", "", "");
                if(JSON.parse(response).cod == 200) {
                   let temperature = JSON.parse(response).main.temp;
				  
				   let temp_f = (temperature * 9/5) + 32; 
                   console.log("round",temp_f.toFixed(2));
                   let msgtemp = PorpertiesUtil.getJSONPropertiesWithoutSession("bismLanguage.weatherDialog.TempText." + session.privateConversationData.preferredLocale);
                   let msgtempor = PorpertiesUtil.getJSONPropertiesWithoutSession("bismLanguage.weatherDialog.TempTextor." + session.privateConversationData.preferredLocale);
                   session.send(msgtemp + temperature.toFixed(2) + msgtempor + temp_f.toFixed(2) + "°F");
                   //session.send("Temperature is " + temperature.toFixed(2) + "°C or " + temp_f.toFixed(2) + "°F");
                   //session.send("Thank you for contacting MySupport.").endDialog();
                   session.privateConversationData.translationSupport == true;
                  //session.send(PorpertiesUtil.getJSONProperties(session,"bismLanguage.askMoreInformationDialog.thank")).endDialog();
                   session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank"),true,"","","","ignoringInput").toMessage()).endDialog();
                   WeatherDialog.logger.info("Exit : WeatherDialog :[BISM:Questions.Gamification] ")
				}
				else{
				   //session.send("Location could not found.Please try after some time.Thank you for contacting MySupport.").endDialog();
                   session.privateConversationData.translationSupport == true;
                   session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.weatherDialog.Locationnotvalidend"),false,"","","","ignoringInput").toMessage());
                   //session.send(PorpertiesUtil.getJSONProperties(session,"bismLanguage.weatherDialog.Locationnotvalidend"));
                   session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank"),true,"","","","ignoringInput").toMessage()).endDialog();
                   //session.send(PorpertiesUtil.getJSONProperties(session,"bismLanguage.askMoreInformationDialog.thank")).endDialog();
                   WeatherDialog.logger.info("Exit : WeatherDialog :[BISM:Questions.Gamification]");
				}
                }
                else
                {
                    //session.send("Location is not in correct format.Please try after some time.").endDialog();
                   session.privateConversationData.translationSupport == true;
                   session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.weatherDialog.Locationnotvalidend1"),false,"","","","ignoringInput").toMessage());
                   //session.send(PorpertiesUtil.getJSONProperties(session,"bismLanguage.weatherDialog.Locationnotvalidend"));
                   session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank"),true,"","","","ignoringInput").toMessage()).endDialog();
                   //session.send(PorpertiesUtil.getJSONProperties(session,"bismLanguage.askMoreInformationDialog.thank")).endDialog();
                   WeatherDialog.logger.info("Exit : WeatherDialog :[BISM:Questions.Gamification]");
                }
			}
        ]
    }
}