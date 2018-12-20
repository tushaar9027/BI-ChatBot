import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, Session, Prompts, IDialogResult, IFindMatchResult, Library } from 'botbuilder';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
export class MyShopReqDialog{
    static logger = ServerHandler.getLogger();

    public static init(library:Library){
        library.dialog("MyShop.Req", MyShopReqDialog.getDialog()).triggerAction({
            matches: ["BISM:MyShop.Req", "myShopReq", "status of my request", "Status"]
        });
    }
    private static getDialog():IDialogWaterfallStep[]{
        return [
            (session: Session, args: any) => {
                session.dialogData.callId = args;
                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.myShopRequestDialog.order_History"), false, "", "", "", "ignoringInput").toMessage());
                var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.myShopRequestDialog.prompt_choice"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.myShopRequestDialog.prompt_choice_Result"), "false", "", "expectingInput").toMessage();
                Prompts.choice(session, msg, msg.sourceEvent.listOption,PorpertiesUtil.choiceOption(session).options);
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                let argsValue = {
                    "callId": session.dialogData.callId,
                    "ConfigItemFlag": PorpertiesUtil.getJSONPropertiesWithoutSession("bi_configItems.MYShop")
                }
                MyShopReqDialog.logger.info("This is the value of my response ", results.response.entity);
                if (results.response.index==0) {
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.myShopRequestDialog.pending_approval_msg"), false, "", "", "", "ignoringInput").toMessage());
                    session.beginDialog('BISM:ask.MoreInformation', argsValue);
                }
                else if (results.response.index==1) {
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.myShopRequestDialog.pending_training_msg"), false, "", "", "", "ignoringInput").toMessage());
                    session.beginDialog('BISM:ask.MoreInformation', argsValue);
                }
                else if (results.response.index==2) {
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.myShopRequestDialog.cancel_msg"), false, "", "", "", "ignoringInput").toMessage());
                    session.beginDialog('BISM:ask.MoreInformation', argsValue);
                }
                // else if (results.response.index==3) {
                //     MyShopReqDialog.logger.info("This is the value of my call ID when we are creating the ticket \n\n", session.dialogData.callId);
                //     session.beginDialog('BISM:MyShop.Req.Other', session.dialogData.callId);
                // }
            },
        ]
    }
}