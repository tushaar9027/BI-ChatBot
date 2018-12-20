import { ServerHandler } from "../../../../middleware/ServerHandlers";
import { Session, IDialogWaterfallStep, Library } from 'botbuilder';
import { BIBotConnector } from "../../connector/BIBotConnector";
import { PorpertiesUtil } from "../../../../util/PropertiesUtil";

export class AboutBotDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("Question.AboutBot", AboutBotDialog​​.getDialog()).triggerAction({
            matches: ["BISM:Question.AboutBot", "Hello, who are you?"]
        });
    }

    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                AboutBotDialog.logger.info("Entered : AboutBotDialog :[BISM:Question.AboutBot] ")
                PorpertiesUtil.tranlationFlagCleaner(session);
                session.privateConversationData.endConversation = true;
                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.questionsAboutBotDialog.msg"), false, "", "", "", "ignoringInput").toMessage()).endDialog();
                AboutBotDialog.logger.info("Exit : AboutBotDialog :[BISM:Question.AboutBot] ")
            }
        ]
    }
}