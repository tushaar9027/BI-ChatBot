import { ServerHandler } from "../../../../middleware/ServerHandlers";
import { IDialogWaterfallStep, Session, IDialogResult, IFindMatchResult, Prompts, Library } from 'botbuilder';
import { BIBotConnector } from "../../connector/BIBotConnector";
import { PorpertiesUtil } from "../../../../util/PropertiesUtil";
import { HttpUtil } from "../../../service/HttpUtil";

export class TimeDialog {
    
    static logger = ServerHandler.getLogger();
    public static init(library: Library) {
        console.log("Inside time");
        library.dialog("BISM:ask.time", TimeDialog.getDialog()).triggerAction({
            matches: ["BISM:ask.time", "What time is it?"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            async(session: Session, args: any) => {
               
             TimeDialog.logger.info("Entered : TimeDialog :[BISM:Questions.Gamification] :", session.privateConversationData.userDetails);
             //session.privateConversationData.translationSupport == false;
             //var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.weatherDialog.Location"), false, "", "", "", "expectingInput").toMessage();
             //Prompts.text(session, msg);
             
             //Prompts.text(session, "Please Enter your location in city,country format");
             //var msg = PorpertiesUtil.getJSONProperties(session,"bismLanguage.TimeDialog.LocationIncorrect1");
             var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.TimeDialog.LocationIncorrect1"), false, "", "", "", "expectingInput").toMessage();
             Prompts.text(session,msg);   

                
            },
            async(session: Session, results: IDialogResult<any>, args: any) => {
                
                
                let city = results.response.split(",",2)[0];
				let country = results.response.split(",",2)[1];
                console.log("City: " + city);
                console.log("Country: " + country);
				let coordinates = await HttpUtil.httpGetCall("https://nominatim.openstreetmap.org/search?city=" + city + "&country=" + country + "&format=json","","","");
                console.log("openstreetmap Coordinates: " + coordinates);
                console.log(country);
                let count = JSON.parse(coordinates).length;
                //let count = Object.keys(coordinates).length;
                console.log("openstreetmap coordinates length: " + count);
                //console.log(" Lat: " + JSON.parse(coordinates)[0].lat);
                //console.log(" Lon: " + JSON.parse(coordinates)[0].lon);
                if(count>=1) {
                    
                let lat = JSON.parse(coordinates)[0].lat;
				let long = JSON.parse(coordinates)[0].lon;
				let timeresponse = await HttpUtil.httpGetCall("http://new.earthtools.org/timezone/" + lat + "/" +long,"","","");
                console.log("time response : " + timeresponse);
                let localtime = "";
                let parseString = require('xml2js').parseString;
                parseString(timeresponse, function (err :any, result :any) {
                console.log(" xmlparse result : " + result.timezone.localtime);
                localtime = result.timezone.localtime;
                 });
                console.log(" Time from Earth API : " + localtime);
                
                var msgtime = PorpertiesUtil.getJSONPropertiesWithoutSession("bismLanguage.TimeDialog.LocalTime." + session.privateConversationData.preferredLocale);
               
                session.send(msgtime + localtime);
                
                //session.send("Thank you for contacting MySupport.").endDialog();
                //var msgtime = PorpertiesUtil.getJSONProperties(session,"bismLanguage.TimeDialog.LocalTime");
                //var msgtimethanks = PorpertiesUtil.getJSONProperties(session,"bismLanguage.TimeDialog.ThanksMessage");
                //var msgtime = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.TimeDialog.LocalTime"), false, "", "", "", "ignoringInput").toMessage();
                //console.log("msgtime: " + msgtime);
                //var msgtimethanks = PorpertiesUtil.getJSONPropertiesWithoutSession("TimeDialog.ThanksMessage");
                var msgtimethanks = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.TimeDialog.ThanksMessage"), true, "", "", "", "ignoringInput").toMessage();
                session.send(msgtimethanks).endDialog();
                
                TimeDialog.logger.info("Exit : TimeDialog :[BISM:Questions.Gamification] ");
				}
               // else if(count>1){
                   // Prompts.text(session, "Multiple locations found, please enter the location in correct city,country format");
                   //var msg = PorpertiesUtil.getJSONProperties(session,"bismLanguage.TimeDialog.MultipleLocationsFound");
                   
                   //var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.TimeDialog.MultipleLocationsFound"), false, "", "", "", "expectingInput").toMessage();
                  // Prompts.text(session,msg); 
               // }
				else  {
                 // Prompts.text(session, "Please enter the location in correct city,country format");
                 //var msg = PorpertiesUtil.getJSONProperties(session,"bismLanguage.TimeDialog.LocationIncorrect2");
                 var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.TimeDialog.LocationIncorrect2"), false, "", "", "", "expectingInput").toMessage();
                 Prompts.text(session,msg); 

				}
			},
			async(session: Session, results: IDialogResult<any>, args: any) => {
				let city = results.response.split(",",2)[0];
				let country = results.response.split(",",2)[1];
                console.log("City: " + city);
                console.log("Country: " + country);
                let apiurl = "https://nominatim.openstreetmap.org/search?city=" + city + "&country=" + country + "&format=json";
                console.log("cordinate api url: " + apiurl);
				let coordinates = await HttpUtil.httpGetCall("https://nominatim.openstreetmap.org/search?city=" + city + "&country=" + country + "&format=json","","","");
                //let count = Object.keys(coordinates).length;
                console.log("openstreetmap Coordinates: " + coordinates);
                let count = JSON.parse(coordinates).length;
                //let count = Object.keys(coordinates).length;
                console.log("openstreetmap coordinates length: " + count);
                //console.log(" Lat: " + JSON.parse(coordinates)[0].lat);
                //console.log(" Lon: " + JSON.parse(coordinates)[0].lon);
				if(count>=1) {
               	let lat = JSON.parse(coordinates)[0].lat;
				let long =JSON.parse(coordinates)[0].lon;
                
				let timeresponse = await HttpUtil.httpGetCall("http://new.earthtools.org/timezone/" + lat + "/" +long,"","","");
                console.log("time response : " + timeresponse);
	            let localtime = "";
                let parseString = require('xml2js').parseString;
                parseString(timeresponse, function (err :any, result :any) {
                console.log(" xmlparse result : " + result.timezone.localtime);
                localtime = result.timezone.localtime;
                 });
                console.log(" Time from Earth API : " + localtime);
                 var msgtime = PorpertiesUtil.getJSONPropertiesWithoutSession("bismLanguage.TimeDialog.LocalTime." + session.privateConversationData.preferredLocale);
               
                session.send(msgtime + localtime);
                //session.send("Thank you for contacting MySupport.").endDialog();
                //var msgtime = PorpertiesUtil.getJSONProperties(session,"bismLanguage.TimeDialog.LocalTime");
                //var msgtimethanks = PorpertiesUtil.getJSONProperties(session,"bismLanguage.TimeDialog.ThanksMessage");
                //var msgtime = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.TimeDialog.LocalTime"), false, "", "", "", "ignoringInput").toMessage();
                //console.log("msgtime: " + msgtime);
                var msgtimethanks = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.TimeDialog.ThanksMessage"), true, "", "", "", "ignoringInput").toMessage();
               	session.send(msgtimethanks).endDialog();
                
                TimeDialog.logger.info("Exit : TimeDialog :[BISM:Questions.Gamification] ");
				}
                //else if(count>1){
                   // Prompts.text(session, "Location was not in correct format, Please try after some time.Thank you for contacting MySupport.");
                   //var msg = PorpertiesUtil.getJSONProperties(session,"bismLanguage.TimeDialog.LocationIncorrectBye");
                   
                   //let msg1 = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.TimeDialog.LocationIncorrectBye"), false, "", "", "", "ignoringInput").toMessage();
                   //session.send(msg1);
                   //var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.TimeDialog.LocationIncorrectBye"), true, "", "", "", "ignoringInput").toMessage();
                   //session.send(msg).endDialog();
            
                //}
				
				else {
                  // session.send("Location could not found.Please try after some time.Thank you for contacting MySupport.").endDialog();
                  //var msg = PorpertiesUtil.getJSONProperties(session,"bismLanguage.TimeDialog.LocationNotFoundBye");
                   let msg1 = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.TimeDialog.LocationNotFoundBye"), false, "", "", "", "ignoringInput").toMessage();
                   session.send(msg1);
                  var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.TimeDialog.LocationNotFoundBye"), true, "", "", "", "ignoringInput").toMessage();
                   session.send(msg).endDialog();
                   TimeDialog.logger.info("Exit : TimeDialog :[BISM:Questions.Gamification] ");
				}
			}
        ]
    }
}