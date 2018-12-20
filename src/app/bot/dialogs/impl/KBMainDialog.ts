import { ServerHandler } from "../../../../middleware/ServerHandlers";
import { Library, IDialogWaterfallStep, Session } from "botbuilder";
import { BISMController } from "../../../controller/BISMController";
import { CustomError } from '../../../../util/ErrorHandlingUtil';

export class KBMainDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("Knowledge.ArticlesMain", KBMainDialog.getDialog()).triggerAction({
            matches: ["BISM:Knowledge.ArticlesMain", "Knowledge Articles", "Knowledge Articles"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                console.log("Tushar Entered KB main dialog");
                session.privateConversationData.updateTicketDescriptionRequired = true;
                KBMainDialog.logger.info("Entered : KBMainDialog :[BISM:Knowledge.ArticlesMain]")
                session.dialogData.intent = "";
                BISMController.getKbArticleStartServiceCall(session.message.text, session).then(response => {
                    let responseData = JSON.parse(response);
                    let argsValue = {
                        "searchField": session.message.text,
                        "length": responseData.Data.length,
                        "searchResult": responseData,
                        "knowledgeArgs": args
                    }
                    if (responseData.Data.length == 1) {
                        session.beginDialog("BISM:Knowledge.ArticlesOne", argsValue);
                    }
                    else if (responseData.Data.length > 1) {
                        session.beginDialog("BISM:Knowledge.Onetomanymenu", argsValue);
                    }
                    else {
                        session.beginDialog("BISM:default.Dialog");
                    }
                }).catch(err => {
                    session.send("We are sorry services are down momentarily");
                    BISMController.logger.info("BISMController : getKbArticleServiceCall : getSearchResult:  Error :", err);
                    throw new CustomError(err.message, "getSearchResult");
                });
                KBMainDialog.logger.info("Exit : KBMainDialog :[BISM:Knowledge.ArticlesMain]")
            }
        ];

    }
}