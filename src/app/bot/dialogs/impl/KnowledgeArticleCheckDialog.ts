import { ServerHandler } from "../../../../middleware/ServerHandlers";
import { IDialogWaterfallStep, Session, IDialogResult, IFindMatchResult, Prompts, Library } from 'botbuilder';
import { BISMController } from "../../../controller/BISMController";
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';

export class KnowledgeArticleCheckDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("Knowledge.ArticlesCheck", KnowledgeArticleCheckDialog​​.getDialog()).triggerAction({
            matches: ["BISM:Knowledge.ArticlesCheck", "Knowledge Articles", "Knowledge Articles"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args: any, next: any) => {
                KnowledgeArticleCheckDialog.logger.info("Entered : KnowledgeArticleCheckDialog :[BISM:Knowledge.ArticlesCheck]")
                session.dialogData.searchField = args.searchField;
                session.dialogData.length = args.length;
                session.dialogData.knowledgeArgs = args.knowledgeArgs;
                if (session.dialogData.length == 1) {
                    //session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.knowledgeArticleDialog.twoKnowledgeArticleMessage"), false, "", "", "", "ignoringInput").toMessage()); //Added by Tushar
                    session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.knowledgeArticleDialog.oneKnowledgeArticleMessage"), false, "", "", "", "ignoringInput").toMessage());
                }
                next();
            },
           (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                session.dialogData.queryKBArticles = results.response;
                BISMController.getKbArticleServiceCall((results.response == null) ? session.message.text : session.dialogData.queryKBArticles, session).then(responseKnowledge=> {
                    var parseKnowledge = JSON.parse(responseKnowledge);
                    if (parseKnowledge.Data.length > 0) {
                        BISMController.createCallKBArtciles(session.dialogData.knowledgeArgs.intent, session.dialogData.knowledgeArgs.entities,(results.response == null) ? session.message.text : results.response, session).then(response => {
                            session.dialogData.callId = JSON.parse(response).CallID;
                            session.privateConversationData.callId = JSON.parse(response).CallID;
                            let knowledgeargsValue = {
                                "callId": session.dialogData.callId,
                                "knowledgeDescription": (results.response == null) ? session.message.text : results.response
                            }
                           session.beginDialog("BISM:Knowledge.ArticlesRemaining", knowledgeargsValue);
                           //session.beginDialog("BISM:Knowledge.Onetomanymenu", knowledgeargsValue);
                        });
                    }
                    else {
                        session.beginDialog("BISM:default.Dialog");
                    }

                })
                KnowledgeArticleCheckDialog.logger.info("Exit : KnowledgeArticleCheckDialog :[BISM:Knowledge.ArticlesCheck]")
            }
        ];

    }
}