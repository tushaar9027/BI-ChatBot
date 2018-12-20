import { Library, Session, Prompts, IDialogResult, IFindMatchResult, EntityRecognizer, UniversalBot } from 'botbuilder';
import { ServerHandler } from '../../../middleware/ServerHandlers';
import { CustomError } from '../../../util/ErrorHandlingUtil';
import { BISMController } from '../../controller/BISMController';
import { BIBotConnector } from '../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../util/PropertiesUtil';
import { BIDialogsUtil } from './BIDialogsUtil';
import { QnADialog } from './impl/QnADialogs';
import { SystemIssueDialog } from './impl/SystemIssueDialog';
import { UpdateTicketDialog } from './impl/UpdateTicketDialog';
import { KnowledgeArticleDialog } from './impl/KnowledgeArticleDialog';
import { KnowledgeArticleCheckDialog } from './impl/KnowledgeArticleCheckDialog';
import { MySysNtListedDialog } from './impl/MySysNtListedDialog';
import { HRPDialog } from './impl/HRPDialog';
import { USDialog } from './impl/USDialog';
import { JPDialog } from './impl/JPDialog';
import { ItemsDialog } from './impl/ItemsDialog';
import { IBISDialog } from './impl/IBISDialog';
import { SAPDialog } from './impl/SAPDialog';
import { CloseTicketDialog } from './impl/CloseTicketDialog';
import { AskCallIdDialog } from './impl/AskCallIdDialog';
import { AskMoreInformationDialog } from './impl/AskMoreInformationDialog';
import { MyShopReqDialog } from './impl/MyShopReqDialog';
import { DefaultDialog } from './impl/DefaultDialog';
import { DefaultDialogContinue } from './impl/DefaultDialogContinue';
import { CountryNotSupportedDialog } from './impl/CountryNotSupportedDialog';
import { GreetingDialog } from './impl/GreetingDialog';
import { LanguageDialog } from './impl/LanguageDialog';
import { AskCallIdContinueDialog } from './impl/AskCallIdContinueDialog';
import { AskCallStatusDialog } from './impl/AskCallStatusDialog';
import { MyShopReqStatusDialog } from './impl/MyShopReqStatusDialog';
import { MyShopReqContinueDialog } from './impl/MyShopReqContinueDialog';
import { MyTicketDialog } from './impl/MyTicketDialog';
import { GamificationDialog } from './impl/GamificationDialog';
import { OutlookFileSizeDialog } from './impl/OutlookFileSizeDialog';
import { OutlookFileDialog } from './impl/OutlookFileDialog';
import { AboutBotDialog } from './impl/AboutBotDialog';
import { SAPCreateTicketDialog } from './impl/SAPCreateTicketDialog';
import { SystemAccessDialog } from './impl/SystemAccessDialog';
import { OutlookDLDialog } from './impl/OutlookDLDialog';
import { OutlookDLContinueDialog } from './impl/OutlookDLContinueDialog';
import { DemoQnADialog } from "./impl/DemoQnADialog";
import { DemoAskMoreInformationDialog } from "./impl/DemoAskMoreInformationDialog";
import { WeatherDialog } from "./impl/WeatherDialog";
import { TimeDialog } from "./impl/TimeDialog";
import { KBMainDialog } from "./impl/KBMainDialog";
import { KBonetoonedialog } from "./impl/KBonetoonedialog";
import { KBonetomanymainDialog } from "./impl/KBonetomanymainDialog";
import { KBSearchDialog } from "./impl/KBSearchDialog";
import { KBRouteToAgent } from "./impl/KBRouteToAgent";
import { KBCancelTicketDialog } from "./impl/KBCancelTicketDialog";
import { ExistingTicketDialog } from "./impl/ExistingTicketDialog";
import { ERPDialog } from "./impl/ERPDialog";
import { BWDialog } from "./impl/BWDialog";

const util = require('util');
const utf8 = require('utf8');

// Added for UTF Conversion
export class BIDialogs {

    static bismDialog = new Library("BISM");
    static logger = ServerHandler.getLogger();

    public static registerDialogs(bot: UniversalBot) {
        BIDialogs.initDialogs();
        bot.library(BIDialogs.bismDialog.clone());
    }
    private static initDialogs() {
        AskCallIdDialog.init(BIDialogs.bismDialog);
        AskMoreInformationDialog.init(BIDialogs.bismDialog);
        AskCallIdContinueDialog.init(BIDialogs.bismDialog);
        AskCallStatusDialog.init(BIDialogs.bismDialog);
        CloseTicketDialog.init(BIDialogs.bismDialog);
        MyShopReqStatusDialog.init(BIDialogs.bismDialog);
        MyShopReqDialog.init(BIDialogs.bismDialog);
        MyShopReqContinueDialog.init(BIDialogs.bismDialog);
        MyTicketDialog.init(BIDialogs.bismDialog);
        QnADialog.init(BIDialogs.bismDialog);
        SystemIssueDialog.init(BIDialogs.bismDialog);
        UpdateTicketDialog.init(BIDialogs.bismDialog);
        //KnowledgeArticleDialog​​.init(BIDialogs.bismDialog);
        //KnowledgeArticleCheckDialog​​.init(BIDialogs.bismDialog);
        //KnowledgeArticleContinueDialog​​.init(BIDialogs.bismDialog);
        AboutBotDialog.init(BIDialogs.bismDialog);
        //GamificationDialog.init(BIDialogs.bismDialog);
        OutlookFileSizeDialog.init(BIDialogs.bismDialog);
        OutlookFileDialog.init(BIDialogs.bismDialog);
        OutlookDLDialog.init(BIDialogs.bismDialog);
        OutlookDLContinueDialog.init(BIDialogs.bismDialog);
        SystemAccessDialog.init(BIDialogs.bismDialog);
        DefaultDialog.init(BIDialogs.bismDialog);
        DefaultDialogContinue.init(BIDialogs.bismDialog);
        CountryNotSupportedDialog.init(BIDialogs.bismDialog);
        GreetingDialog.init(BIDialogs.bismDialog);
        LanguageDialog.init(BIDialogs.bismDialog);
        SAPCreateTicketDialog.init(BIDialogs.bismDialog);
        SAPDialog.init(BIDialogs.bismDialog);
        IBISDialog.init(BIDialogs.bismDialog);
        ItemsDialog.init(BIDialogs.bismDialog);
        JPDialog.init(BIDialogs.bismDialog);
        USDialog.init(BIDialogs.bismDialog);
        HRPDialog.init(BIDialogs.bismDialog);
        ERPDialog.init(BIDialogs.bismDialog);
        BWDialog.init(BIDialogs.bismDialog);
        MySysNtListedDialog.init(BIDialogs.bismDialog);
        DemoQnADialog.init(BIDialogs.bismDialog);
        DemoAskMoreInformationDialog.init(BIDialogs.bismDialog);
        TimeDialog.init(BIDialogs.bismDialog);
        WeatherDialog.init(BIDialogs.bismDialog);
        KBMainDialog.init(BIDialogs.bismDialog);
        KBonetoonedialog.init(BIDialogs.bismDialog);
        KBonetomanymainDialog.init(BIDialogs.bismDialog);
        KBSearchDialog.init(BIDialogs.bismDialog);
        KBRouteToAgent.init(BIDialogs.bismDialog);
        KBCancelTicketDialog.init(BIDialogs.bismDialog);
        ExistingTicketDialog.init(BIDialogs.bismDialog);
    }
}
