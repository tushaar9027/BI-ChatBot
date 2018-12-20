import { ServerHandler } from "../../../../middleware/ServerHandlers";
import { IDialogWaterfallStep, Session, Library } from 'botbuilder';
import { BISMController } from "../../../controller/BISMController";
import { PorpertiesUtil } from "../../../../util/PropertiesUtil";

export class SystemAccessDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("access.system", SystemAccessDialog.getDialog()).triggerAction({
            matches: ["BISM:access.system", "cant login to system"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                let entityArray = BISMController.retreiveAnswer(args.intent, args.entities, session, "");
                session.send(PorpertiesUtil.getJSONProperties(session, "bismLanguage.accessSystemDialog.message") + 'issue=' + args.intent + entityArray[0].resolution[0]);
                PorpertiesUtil.tranlationFlagCleaner(session);
                session.privateConversationData.updateTicketDescriptionRequired = false;
                session.endDialog('closing the dialog', args);
            }
        ]
    }
}