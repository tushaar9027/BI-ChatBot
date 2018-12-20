
import { BISMController } from '../app/controller/BISMController';
import { Session } from 'botbuilder';
import { PorpertiesUtil } from "./PropertiesUtil";

export function chatHistoryUpdate(chatHistory: any, session: Session, configItemFlag: string, closeOrNot: boolean) {
    BISMController.updateCall(session.dialogData.callId, session.message.text, '', session).then(response => {
        if (closeOrNot) {
            BISMController.closeCall(session.dialogData.callId, 'SATISFIED', session, configItemFlag).then(response => {
                PorpertiesUtil.tranlationFlagCleaner(session);
                session.privateConversationData.endOfConversation = false;
                session.endDialog();
            });
        }
        else {
            PorpertiesUtil.tranlationFlagCleaner(session);
            session.privateConversationData.endOfConversation = false;
            session.endDialog();
        }
        session.endDialog();
    });
}







