import { ChatConnector, IChatConnectorSettings, Session, Message } from 'botbuilder';

import { PorpertiesUtil } from '../../../util/PropertiesUtil';

export class BIBotConnector extends ChatConnector {
    constructor(settings?: IChatConnectorSettings) {
        super(settings);
    }
    public hook(this: ChatConnector) {
    var __this: any = this;
    return function (req: any, res: any, next: any) {
        __this._req = req;
        next();
    }
}
    public request(this: any) {
    return this._req;
}

    public static channelDataMessage(session:Session, message:any,
    endOfConversationFlag:any, listOptionP:string,
    callId:string, eventData:string, inputHint:string) {
    const msg = new Message(session);
    msg.text(message);
    var channelData: any = {};
    channelData.message = msg.toMessage().text;
    channelData.type = "message";
    channelData.event = eventData;
    channelData.inputHint = inputHint;
    channelData.endOfConversation = endOfConversationFlag;
    channelData.listOption = listOptionP;
    channelData.callID = callId;
    channelData.conversationEntities = session.privateConversationData.preferredLocale;
    channelData.customerPreferredLanguage = session.privateConversationData.preferredLocale;
    msg.sourceEvent(PorpertiesUtil.getChannelData(session, channelData));

    //console.log("Channel Data--------------->>>>>>>>>>>>>>>>>>>", msg);

    return msg;
}
    
}