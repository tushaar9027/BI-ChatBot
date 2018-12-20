import { ServerHandler } from "../../../../middleware/ServerHandlers";
import { Library, IDialogWaterfallStep, Session } from "botbuilder";
import { BISMController } from "../../../controller/BISMController";
import { CustomError } from '../../../../util/ErrorHandlingUtil';

export class KnowledgeArticleDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("Knowledge.Articles", KnowledgeArticleDialog.getDialog()).triggerAction({
            matches: ["BISM:Knowledge.Articles", "Knowledge Articles", "Knowledge Articles"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                session.privateConversationData.updateTicketDescriptionRequired = true;
                KnowledgeArticleDialog.logger.info("Entered : KnowledgeArticleDialog :[BISM:Knowledge.Articles]")
                session.dialogData.intent = "";
                BISMController.getKbArticleStartServiceCall(session.message.text, session).then(response => {
                    let responseData = JSON.parse(response);
                    if (responseData.Data.length > 0) {
                        let argsValue = {
                            "searchField": session.message.text,
                            "length": responseData.Data.length,
                            "knowledgeArgs": responseData
                        }
                        session.replaceDialog("BISM:Knowledge.ArticlesCheck", argsValue);
                    }
                    else {
                        session.beginDialog("BISM:default.Dialog");
                    }
                }).catch(err => {
                    session.send("We are sorry services are down momentarily");
                    BISMController.logger.info("BISMController : getKbArticleServiceCall : getSearchResult:  Error :", err);
                    throw new CustomError(err.message, "getSearchResult");
                });
                KnowledgeArticleDialog.logger.info("Exit : KnowledgeArticleDialog :[BISM:Knowledge.Articles]")
            }
        ];

    }
}