import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { Library, IDialogWaterfallStep, Session } from 'botbuilder';
export class LanguageDialog{
    static logger = ServerHandler.getLogger();

    public static init(library:Library){
        library.dialog("Language", LanguageDialog.getDialog()).triggerAction({
            matches: ["BISM:Language", "Language"]
        });
    
    }
    private static getDialog():IDialogWaterfallStep[]{
        return [
            (session: Session) => {
                if (session.privateConversationData.countryDetailsSupport) {
                    if (session.privateConversationData.languageDetailsSupport) {
                        session.preferredLocale(session.privateConversationData.languageDetailsCode, function (err) {
                            if (!err) {
                                session.sendTyping();
                                session.send("Your preferred language is : " + session.privateConversationData.languageDetailsName);
                                session.endDialog("Hello " + session.userData.userID + ", Thank you for contacting MySupport, How may I help you?");
                            } else {
                                // Problem loading the selected locale
                                session.error(err);
                            }
                        });
                    }
                    else {
                        session.send("Hello " + session.userData.userID + ", Thank you for contacting MySupport, How may I help you?");
                        session.send("  I have recognized that your preferred language is " + session.privateConversationData.languageDetailsName + " and not supported yet.");
                        session.endDialog("You can continue in English");
                    }
                }
                else {
                    session.beginDialog('BISM:NotSupported');
                }
            }
        ]
    }
}