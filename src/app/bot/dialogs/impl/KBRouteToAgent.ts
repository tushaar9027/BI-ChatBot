import { ServerHandler } from "../../../../middleware/ServerHandlers";
import { Library, IDialogWaterfallStep, Session, IDialogResult, IFindMatchResult, Prompts, Message } from 'botbuilder';
import { BISMController } from "../../../controller/BISMController";
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { CardFactory } from '../../card/CardFactory';
import { CustomError } from '../../../../util/ErrorHandlingUtil';
import { chatHistoryUpdate } from "../../../../util/ChatHistoryUtil";

export class KBRouteToAgent {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("Knowledge.RouteToAgent", KBRouteToAgent.getDialog()).triggerAction({
            matches: ["BISM:Knowledge.RouteToAgent", "Hello, who are you?"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
           
            (session: Session, args,next) => {
                KBRouteToAgent.logger.info("Entered : KBRouteToAgent :[BISM:Knowledge.RouteToAgent]");
                session.dialogData.searchField = args.searchField;
                session.dialogData.length = args.length;
                session.dialogData.searchResult = args.searchResult;
                session.dialogData.knowledgeArgs = args.knowledgeArgs;
                session.dialogData.callId = session.privateConversationData.callId;
                Prompts.text(session, BIBotConnector.channelDataMessage(session, "Please wait routing to agent.", false, "", session.dialogData.callId, "ROUTE_TO_AGENT", "ignoringInput").toMessage());
                //next();
            }
          
        ];

    }
}
