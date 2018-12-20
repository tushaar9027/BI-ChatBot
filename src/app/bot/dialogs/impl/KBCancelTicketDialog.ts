import { ServerHandler } from "../../../../middleware/ServerHandlers";
import { Library, IDialogWaterfallStep, Session, IDialogResult, IFindMatchResult, Prompts, Message } from 'botbuilder';
import { BISMController } from "../../../controller/BISMController";
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { CardFactory } from '../../card/CardFactory';
import { CustomError } from '../../../../util/ErrorHandlingUtil';
import { chatHistoryUpdate } from "../../../../util/ChatHistoryUtil";

export class KBCancelTicketDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("Knowledge.CancelTicket", KBCancelTicketDialog.getDialog()).triggerAction({
            matches: ["BISM:Knowledge.CancelTicket", "Hello, who are you?"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                KBCancelTicketDialog.logger.info("Entered : KBCancelTicketDialog :[BISM:Knowledge.CancelTicket]");
                session.dialogData.searchField = args.searchField;
                session.dialogData.length = args.length;
                session.dialogData.searchResult = args.searchResult;
                session.dialogData.knowledgeArgs = args.knowledgeArgs;
                session.dialogData.callId = session.privateConversationData.callId;
                session.dialogData.additionalInfo ="";
                   BISMController.createCancelForTickets(session.dialogData.callId, session.dialogData.additionalInfo, "Ticket Cancelled", session, session.userData.user_ID).then((response) => {
                            session.privateConversationData.dialogEnd = true;
                            PorpertiesUtil.tranlationFlagCleaner(session);
                            session.privateConversationData.updateTicketDescriptionRequired = false;
                            session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.SAM_FAQ"), false, "", "", "", "ignoringInput").toMessage());
                            session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage());
                        }).catch(err => {
                            session.send("We are sorry services are down momentarily");
                            BISMController.logger.info("BISMController : createCancelForTickets :cancelTicketResult : Error", err);
                            throw new CustomError(err.message, "createCall");
                        });
                
            }
            
        ];
    }
}