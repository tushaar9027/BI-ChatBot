import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { IDialogWaterfallStep, Session, Prompts, IDialogResult, IFindMatchResult, Library } from 'botbuilder';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { BISMController } from '../../../controller/BISMController';
import { CustomError } from '../../../../util/ErrorHandlingUtil';
export class DefaultDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("default.Dialog", DefaultDialog.getDialog()).triggerAction({
            matches: ["BISM:default.Dialog", "default dialog"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args: any) => {

            }

        ]
    }
}