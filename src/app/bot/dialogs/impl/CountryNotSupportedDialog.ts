import { ServerHandler } from "../../../../middleware/ServerHandlers";
import { IDialogWaterfallStep, Session, Library } from 'botbuilder';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';

export class CountryNotSupportedDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("NotSupported", CountryNotSupportedDialog.getDialog()).triggerAction({
            matches: ["BISM:NotSupported", "NotSupported"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            (session: Session, args) => {
                session.send('I have recognized that your preferred language is ' + args + ' and not supported yet.');
                session.send('For your information: This setting can be maintained in your  MyShop Profile[:https://myshop.eu.boehringer.com/myshop/Customer.asp?]')
                PorpertiesUtil.tranlationFlagCleaner(session);
                session.send('You can continue in English').endDialog();
            }
        ]
    }
}