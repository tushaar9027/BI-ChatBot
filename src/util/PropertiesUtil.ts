import { Session } from 'botbuilder';
import { Properties } from 'ts-json-properties';
export class PorpertiesUtil {
    public static getLocale(session: Session) {
        if (session.privateConversationData.setPreferredLocale == "Yes") {
            session.preferredLocale(session.privateConversationData.preferredLocale, function (err) {
                if (!err) {
                    // Locale files loaded
                } else {
                    // Problem loading the selected locale
                    session.error(err);
                }
            });
            return session.privateConversationData.preferredLocale;
          //return "en";
        }
        else {
            return "en";

        }
    };
    
    public static randomMessage(msgArray: string[]) {
        return msgArray[Math.floor(Math.random() * (msgArray).length)];
    };
    
    public static getChannelData(session: Session, channelData: any) {
        return JSON.parse('{"' + session.message.source + '":' + JSON.stringify(channelData) + ' }');
    };
    
    public static getJSONProperties(session: Session, jsonKey: string) {
        return Properties.get(jsonKey + "." + PorpertiesUtil.getLocale(session)) || Properties.get(jsonKey + ".en");

    };
    
    public static getJSONPropertiesWithoutSession(jsonKey: string) {
        return Properties.get(jsonKey);

    };
    
    public static getLanguageFullName(session: Session, language: string) {
        return Properties.get("supportedLanguage" + "." + language);

    }
    public static translationSupport(language: string) {
        return Properties.get("translationSupport" + "." + language);
    }
    public static tranlationFlagCleaner(session: Session) {
        session.privateConversationData.translationSupport = true;
    }
    public static choiceOption(session: Session) {
        let choice1 = PorpertiesUtil.getJSONProperties(session, "promptChoice.choice1");
        let choice2 = PorpertiesUtil.getJSONProperties(session, "promptChoice.choice2");
        var options = PorpertiesUtil.getJSONProperties(session, "BotBuilder.value")
        let choices = [choice1, choice2];
        var value =
            {
                "choice": choices,
                "options": options
            }
        return value;
    }

}