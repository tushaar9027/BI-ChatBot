import { BotConfigurations } from '../../../config/Configurations';
import { BIBotConnector } from './BIBotConnector';
import { IChatConnectorSettings, UniversalBot, IBotStorage, MemoryBotStorage, Session, IAddress, BotConnectorBot, ChatConnector } from 'botbuilder';
import { AzureTableClient, AzureBotStorage } from 'botbuilder-azure';
import { BISMController } from '../../controller/BISMController';
import { PorpertiesUtil } from '../../../util/PropertiesUtil';
import { ServerHandler } from '../../../middleware/ServerHandlers';
import { TranslationService } from '../../service/TranslationService';
import { LuisConfiguration } from '../luis/LuisConfiguration';
import { BIDialogs } from '../dialogs/BIDialogs';
import { traslateText } from '../../service/TranslationNew';
let timeout = require('botbuilder-timeout');
var XRegExp = require('xregexp');


export class BIBotConnectorService {
    static logger = ServerHandler.getLogger();
    private static instance: BIBotConnectorService;
    private bot: UniversalBot;
    private connector: BIBotConnector;

    public static getInstance(): BIBotConnectorService {
        if (this.instance == null) {
            this.instance = new BIBotConnectorService();
        }
        return this.instance;
    }

    constructor() {
        this.bot = this.getBotInstance();
    }

    public getBot(): UniversalBot {
        return this.bot;
    }

    public getBotConnector(): BIBotConnector {
        return this.connector;
    }

    private getConnectorSettings(): IChatConnectorSettings {

        let botConfig = BotConfigurations.getBotConfig();

        console.log("authentication.Id:", botConfig.authentication.Id);
        console.log("authentication.password:", botConfig.authentication.password);
        let settings: IChatConnectorSettings = {
            appId: botConfig.authentication.Id,
            appPassword: botConfig.authentication.password
        }
        return settings;
    }

    private getBotInstance(): UniversalBot {
        this.connector = new BIBotConnector(this.getConnectorSettings());
        return new UniversalBot(this.connector);
    }

    private getBotStorage(): IBotStorage {
        let storage: IBotStorage;
        let botConfig = BotConfigurations.getBotConfig();
        if (process.env.NODE_ENV !== "production") {
            storage = new MemoryBotStorage();
        } else {
            const tableClient = new AzureTableClient(
                botConfig.botStorage.tableName,
                botConfig.botStorage.accountName,
                botConfig.botStorage.accountKey
                );
            storage = new AzureBotStorage({ gzipData: false }, tableClient);
        }
        return storage;
    }

    private setBotTimeOut(bot: UniversalBot) {
        let options = {
            PROMPT_IF_USER_IS_ACTIVE_MSG: "Hey are you there?",
            PROMPT_IF_USER_IS_ACTIVE_BUTTON_TEXT: "Yes I am",
            PROMPT_IF_USER_IS_ACTIVE_TIMEOUT_IN_MS: 1800000,
            END_CONVERSATION_MSG: "Conversation Ended",
            END_CONVERSATION_TIMEOUT_IN_MS: 120000
        };
        timeout.setConversationTimeout(bot, options);
    }

    private logUserConversation(event: any) {
        BIBotConnectorService.logger.info('message: ' + event.text + ', user: ', event);
        BIBotConnectorService.logger.info(event);
    }

    private receiveUseConversation(event: any, next: any) {
        this.logUserConversation(event);
        next();
    }
    private sendUseConversation(event: any, next: any) {
        //BIBotConenctorService.logUserConversation(event);
        next();
    }

    public initBot() {
        //let bot = this.getBotInstance();
        let storage = this.getBotStorage();
        this.bot.set('storage', storage);
        this.setBotTimeOut(this.bot);
        this.bot.set('localizerSettings', { defaultLocale: "en" });
        var obj = this.bot;
        this.bot.on('event', function (message) {
            if (message.name == 'requestWelcomeDialog') {
                var iAddress: IAddress = message.address;
                this.bot.loadSession(iAddress,(error: any, session: Session) => {
                    //       session.beginDialog('BISM:Greeting');
                });
            }
        });

        this.bot.on('endOfConversation', function (message) {
            console.log("event is triggered or not");
            setTimeout(function () {
                let chatHistory = message.text;
                var iAddress: IAddress = message.address;
                obj.loadSession(iAddress,(error: any, session: Session) => {
                    if (session.privateConversationData.callId) {
                        if (session.privateConversationData.closeRequired) {
                            BISMController.updateCall(session.dialogData.callId, chatHistory, '', session).then(response => {
                                BISMController.closeCall(session.dialogData.callId, 'SATISFIED', session, session.privateConversationData.configItemFlag).then(response => {
                                    PorpertiesUtil.tranlationFlagCleaner(session);
                                    session.privateConversationData.closeRequired = false;
                                    session.privateConversationData.configItemFlag = '';
                                })
                            })
                        }
                        else if (!session.privateConversationData.closeRequired) {
                            if (session.privateConversationData.updateTicketDescriptionRequired) {
                                BISMController.getUpdateTicketDescription(session, session.privateConversationData.callId, session.userData.userID, "CallBack:").then(result=> {
                                    BISMController.updateCall(session.privateConversationData.callId, chatHistory, '', session).then(result=> {
                                        session.privateConversationData.updateTicketDescriptionRequired = false;
                                        if (!session.privateConversationData.dialogEnd) {
                                            BISMController.forwardTicketOpen(session.privateConversationData.callId, session, session.userData.userID).then(result => {
                                                session.privateConversationData.dialogEnd = false;
                                            });
                                        }
                                    })
                                })
                            }
                            else {
                                BISMController.updateCall(session.privateConversationData.callId, chatHistory, '', session).then(result=> {
                                    if (!session.privateConversationData.dialogEnd) {
                                        BISMController.forwardTicketOpen(session.privateConversationData.callId, session, session.userData.userID).then(result => {
                                            session.privateConversationData.dialogEnd = false;
                                        });
                                    }
                                })
                            }
                        }
                    }
                });
            }, 2000);
        });


        this.bot.use({
            botbuilder: this.initializeBotBuilder,
            send: function (event, next) {
                BIBotConnectorService.logger.info(event.address + '######');
                next();
            }
        });
        LuisConfiguration.configureLuis(this.bot);
        BIDialogs.registerDialogs(this.bot);
    }



    async initializeBotBuilder(session: Session, next: Function) {
    let nextDummy = next;
    BIBotConnectorService.logger.info("Entered : BIBotConnectorService: [initializeBotBuilder]")
    let self = this;
    console.log("Tushar Before Translation : " + session.message.text);
    session.send("<font color='red'>Tushar Before Translation :</font> " + session.message.text);
    session.message.text = session.message.text.replace(/[<>]/g,"");
    var search = XRegExp('([^?<first>\\pL 0-9 ,]+)');
    session.message.text = XRegExp.replace(session.message.text, search, '',"all");
    //session.message.text = session.message.text.replace(/[|&;$%@"<>(){}!?¿='`#*.+]/g, " ");
    //session.message.text = session.message.text.replace(/([^a-z0-9,]+)/gi, ' ');
    //session.message.text = session.message.text.replace(/\s+/g,' ');
    session.send("<font color='green'>Tushar After Translation : </font>" + session.message.text);
    console.log("Tushar After Translation : " + session.message.text);
    session.userData.userID = session.message.user.id;
    if (!session.privateConversationData.countryDetailsSupport && !session.privateConversationData.languageDetailsSupport) {
        let userData = await BISMController.getPreferedLanguage(session.userData.userID, session);
        //userData.language = "de"; //to hardcode lang while testing
        var userCountryDetails: any = PorpertiesUtil.getJSONPropertiesWithoutSession("BI_supportedCountriesList." + userData.country);
        BIBotConnectorService.logger.debug(" userCountryDetails:BIBotConnectorService :[initializeBotBuilder]", userCountryDetails);
        var userLanguageDetails: any = PorpertiesUtil.getJSONPropertiesWithoutSession("BI_supportedLanguagesList." + userData.language);
        BIBotConnectorService.logger.debug(" userLanguageDetails:BIBotConnectorService:[initializeBotBuilder]", userLanguageDetails);
        if (userCountryDetails.support) {
            if (userLanguageDetails.support) {
                setPrivateConversationData(session, userData.language, userData, userCountryDetails, userLanguageDetails);
            } else {
                session.replaceDialog("BISM:NotSupported", userLanguageDetails.name);
                userLanguageDetails = { code: 'en', name: 'English', nativeName: 'English', support: true }
                setPrivateConversationData(session, 'en', userData, userCountryDetails, userLanguageDetails);
            }
        }
        else {
            session.privateConversationData.countryDetailsSupport = false;
            next();
        }
    }

    if (session.privateConversationData.translationSupport == true) {
        if (PorpertiesUtil.translationSupport(session.privateConversationData.preferredLanguage)) {
            let ts = TranslationService.getInstance();
            //session.message.text = session.message.text.replace(/[|&;$%@"<>(){}!?¿=,'`#*.+-]/g, "");
            //session.send(session.message.text);
            let msg = JSON.stringify([{ 'Text': session.message.text }]);
            ts.translateTextV3(msg, next, "en").then((response) => {
                session.privateConversationData.translationBeforeMessage = session.message.text;
                console.log("Tushar Before set Translation : " + session.privateConversationData.translationBeforeMessage);
                BIBotConnectorService.logger.info("Entered  : BIBotConnectorService: [translateTextV3]")
                //session.message.text = response.replace(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/gi, '');
                //console.log("specialremove" + response.replace(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/gi, ''));
                session.message.text = response;
                console.log("Tushar After set Translation : " + session.message.text);
                //session.send(session.message.text);
                next();
            });
        }
        else { next(); }
    }
    else if (session.privateConversationData.countryDetailsSupport == true && session.privateConversationData.translationSupport == false) {
         //console.log("Tushar Before Translation : " + session.message.text);
              // session.message.text = session.message.text.replace(/[|&;$%@"<>(){}!?¿='`#*.+-]/g, "");
              // console.log("Tushar After Translation : " + session.message.text);
               //session.message.text = session.message.text.replace(/[|&;$%@"<>(){}!?¿=,'`#*.+-]/g, "");
              //session.send(session.message.text);
               // session.send("Before translation: " + session.message.text);
               // var replacetext = session.message.text.replace(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/gi, '');
              //  console.log("specialremove" + replacetext);
              //  session.message.text = replacetext;
               // session.send("After regex:" + replacetext);
        next();
    }

}
}

function setPrivateConversationData(session: Session, locale: string, userData: any,
    userCountryDetails: any, userLanguageDetails: any) {
    session.privateConversationData.setPreferredLocale = "Yes";
    session.privateConversationData.preferredLocale = locale;
    session.privateConversationData.userID = session.userData.userID;
    session.privateConversationData.preferredLanguage = locale;
    session.privateConversationData.isPreferredLanguageSet = "Yes";
    session.privateConversationData.countryDetailsName = userCountryDetails.name;
    session.privateConversationData.countryDetailsCode = userCountryDetails.code;
    session.privateConversationData.countryDetailsSupport = userCountryDetails.support;
    session.privateConversationData.languageDetailsCode = userLanguageDetails.code;
    session.privateConversationData.languageDetailsName = userLanguageDetails.name;
    session.privateConversationData.languageDetailsNativeName = userLanguageDetails.nativeName;
    session.privateConversationData.languageDetailsSupport = userLanguageDetails.support;
    session.privateConversationData.translationSupport = true;
}

