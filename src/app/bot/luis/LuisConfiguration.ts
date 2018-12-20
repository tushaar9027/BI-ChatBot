import { UniversalBot, LuisRecognizer, IntentDialog, Session } from 'botbuilder';
import { ServerHandler } from '../../../middleware/ServerHandlers';
import { BotConfigurations } from '../../../config/Configurations';
import { Properties } from 'ts-json-properties';
import { PorpertiesUtil } from "../../../util/PropertiesUtil";

var XRegExp = require('xregexp');

export class LuisConfiguration {

    static logger = ServerHandler.getLogger();
    public static initializeOnScore(score: number, session: Session, intent: string, args: any) {
        
        LuisConfiguration.logger.info("Entered : LuisConfiguration: [initializeOnScore] ");
        LuisConfiguration.logger.debug("score: LuisConfiguration:[initializeOnScore] ", score);
        console.log("score: LuisConfiguration:[initializeOnScore] ", score);
        session.privateConversationData.translationSupport = false;
        if (session.privateConversationData.countryDetailsSupport) {
            if (score >= 0.50) {
                LuisConfiguration.logger.info("Entered : LuisConfiguration: [initializeOnScore]>0.50 ");
                session.beginDialog(intent, args);
            }
            else {
                LuisConfiguration.logger.info("Entered : LuisConfiguration: [initializeOnScore]<0.50 ");
                args.intent = "BISM:Knowledge.ArticlesMain";
                session.beginDialog("BISM:Knowledge.ArticlesMain", args);
            }
        }
        LuisConfiguration.logger.info("Exit : LuisConfiguration: [initializeOnScore] ");
    }

    public static initDialog(intent: string, session: Session, args: any) {
       
        LuisConfiguration.logger.info("Entered : LuisConfiguration: [initDialog] ");
        LuisConfiguration.logger.debug("score: LuisConfiguration:[initializeOnScore] ", args.score);
        if (!session.privateConversationData.countryDetailsSupport) {
            session.send('Sorry! The Chat Service is not available in your region at the moment.It will be communicated accordingly when the service will be live in your region.');
            session.endDialog('In the meantime check out the MySupport [http://mysupport] page to look for support alternatives.')
            return;
        }
        else {
            LuisConfiguration.initializeOnScore(args.score, session, intent, args);
        }
        LuisConfiguration.logger.info("Exit : LuisConfiguration: [initDialog] ");
    }




    public static configureLuis(bot: UniversalBot) {
      
        console.log(BotConfigurations.getLuisAppUrl());
        let recognizer = new LuisRecognizer(BotConfigurations.getLuisAppUrl());
        let intents = new IntentDialog({ recognizers: [recognizer] })
            .matches('BISM:ask.CallId',(session, args) => {
            session.beginDialog("BISM:ask.CallId", args);
        })
            .matches('BISM:ask.MoreInformation',(session, args) => {
            session.beginDialog("BISM:ask.MoreInformation", args);
        })
            .matches('BISM:ask.Status',(session, args) => {
            session.beginDialog("BISM:ask.Status", args);
        })
            .matches('BISM:MyShop.ReqStatus',(session, args) => {
            this.initDialog("BISM:MyShop.ReqStatus", session, args);
        })
            .matches('BISM:access.system',(session, args) => {
            this.initDialog("BISM:access.system", session, args);
        })
            .matches('BISM:ERP.AccountIssue',(session, args) => {
            this.initDialog("BISM:SAPCreateTicket", session, args);
        })
            .matches('BISM:Question.AboutBot',(session, args) => {
            session.beginDialog("BISM:Question.AboutBot", args);
        })
            .matches('BISM:Questions.Gamification',(session, args) => {
            this.initDialog("BISM:Questions.Gamification", session, args);
        })
        //     .matches('BISM:outlook.distributionlist',(session, args) => {
        //     this.initDialog("BISM:outlook.distributionlist", session, args);
        // })
        //     .matches('BISM:outlook.filesize',(session, args) => {
        //     this.initDialog("BISM:outlook.filesize", session, args);
        // })
            .matches('BISM:BI.Knowledgebase.Hardware.Issue',(session, args) => {
            this.initDialog("BISM:Knowledge.ArticlesMain", session, args);
        })
            .matches('BISM:BI.Knowledgebase.Network',(session, args) => {
            this.initDialog("BISM:Knowledge.ArticlesMain", session, args);
        })
            .matches('BISM:BI.Knowledgebase.Software.Issue',(session, args) => {
            this.initDialog("BISM:Knowledge.ArticlesMain", session, args);
        })
            .matches('BISM:sd.my.tickets',(session, args) => {
            this.initDialog("BISM:My.Ticket", session, args);
        })
            .matches('BISM:sd.update.ticket',(session, args) => {
            this.initDialog("BISM:Update.Ticket", session, args);
        })
            .matches('BISM:sd.close.ticket',(session, args) => {
            this.initDialog("BISM:Close.Ticket", session, args);
        })
            .matches('BISM:System.Issue',(session, args) => {
            this.initDialog("BISM:System.Issue", session, args);
        })
            .matches('BISM:qna.visitor.site.register',(session, args) => {

            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.activedirectory.getmember',(session, args) => {

            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.outlook.access.external',(session, args) => {

            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.myshop.order.status',(session, args) => {

            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.link.create',(session, args) => {

            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.hw.return',(session, args) => {

            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.folder.structure',(session, args) => {

            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.data.share.internal',(session, args) => {

            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.software.install',(session, args) => {

            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.data.share.external',(session, args) => {

            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.network.connectivity.external',(session, args) => {

            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.shareroom.training',(session, args) => {

            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.data.externalemployee.update',(session, args) => {

            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.presentation.corporate.images',(session, args) => {

            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.activedirectory.managemembers',(session, args) => {

            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.outlook.distributionlist',(session, args) => {

            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.skype.image',(session, args) => {

            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.presentation.projector.screen',(session, args) => {

            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.visitor.internet.access',(session, args) => {
            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.system.access',(session, args) => {
            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:Greeting',(session, args) => {
            this.initDialog("BISM:Greeting", session, args);
        })
            .matches('BISM:qna.outlook.permission.servicemailbox',(session, args) => {
            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.botinteraction.changelanguage',(session, args) => {
            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.botinteraction.exitchat',(session, args) => {
            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.botinteraction.gotoagent',(session, args) => {
            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:ask.time',(session, args) => {
            this.initDialog("BISM:ask.time",session, args);
        })
            .matches('BISM:demo.qna1',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna2',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna3',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna4',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna5',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })

            .matches('BISM:demo.qna6',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna7',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna8',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna9',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna10',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna11',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna12',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna13',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })

            .matches('BISM:demo.qna14',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna15',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna16',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna17',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna18',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna19',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna20',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna21',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna22',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna23',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna24',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna25',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna26',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna27',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna28',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna29',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna30',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna31',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna32',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna33',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna34',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna35',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna36',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna37',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna38',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna39',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna40',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna41',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna42',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna43',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna44',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna45',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna46',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna47',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna48',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna.49',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna50',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna51',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna52',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna53',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna54',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna55',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna56',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna57',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna58',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna59',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna60',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna61',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna62',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna63',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna64',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna65',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna66',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna67',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna68',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna69',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna70',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna71',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna72',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna73',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna74',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna75',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna76',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna77',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna78',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna79',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:demo.qna80',(session, args) => {
            session.beginDialog("BISM:Demo.Qna.Dialog", args);
        })
            .matches('BISM:qna.uscompliance.whatae',(session, args) => {
            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.uscompliance.whenae',(session, args) => {
            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.uscompliance.signinsheetmeal',(session, args) => {
           this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.uscompliance.coveredrecipient',(session, args) => {
            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.uscompliance.progattendance',(session, args) => {
            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.uscompliance.itemvalue',(session, args) => {
            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.uscompliance.signinsheethelp',(session, args) => {
            this.initDialog("BISM:Qna.Dialog", session, args);
        })
            .matches('BISM:qna.uscompliance.signinsheetreq',(session, args) => {
            this.initDialog("BISM:Qna.Dialog", session, args);
        })
        .matches('BISM:qna.software.request.obic20',(session, args) => {
            this.initDialog("BISM:Qna.Dialog", session, args);
        })
         .matches('BISM:qna.platform.bipeople.change',(session, args) => {
            this.initDialog("BISM:Qna.Dialog", session, args);
        })
         .matches('BISM:qna.platform.mybi.mobileuse',(session, args) => {
            this.initDialog("BISM:Qna.Dialog", session, args);
        })
         .matches('BISM:qna.o365.onedrive.restore',(session, args) => {
            this.initDialog("BISM:Qna.Dialog", session, args);
        })
          .matches('BISM:qna.software.ie.defaultbrowser',(session, args) => {
            this.initDialog("BISM:Qna.Dialog", session, args);
        })
        .matches('BISM:qna.software.webuy.grqueue',(session, args) => {
            this.initDialog("BISM:Qna.Dialog", session, args);
        })
        .matches('BISM:qna.software.request.o365',(session, args) => {
                    this.initDialog("BISM:Qna.Dialog", session, args);
                })
        .matches('BISM:qna.software.outlook.noenddate',(session, args) => {
                    this.initDialog("BISM:Qna.Dialog", session, args);
                })
        .matches('BISM:qna.software.outlook.noweeknum',(session, args) => {
                    this.initDialog("BISM:Qna.Dialog", session, args);
                })
        .matches('BISM:qna.o365.planner.newplan',(session, args) => {
                    this.initDialog("BISM:Qna.Dialog", session, args);
                })
        .matches('BISM:qna.o365.teams.newgroup',(session, args) => {
                    this.initDialog("BISM:Qna.Dialog", session, args);
                })
        .matches('BISM:qna.o365.teams.nomeetingtab',(session, args) => {
                    this.initDialog("BISM:Qna.Dialog", session, args);
                })
        .matches('BISM:qna.software.items.newacc',(session, args) => {
                    this.initDialog("BISM:Qna.Dialog", session, args);
                })
        .matches('BISM:qna.information.helpdesknumber',(session, args) => {
                    this.initDialog("BISM:Qna.Dialog", session, args);
                })
        .matches('BISM:qna.information.phonenumbers',(session, args) => {
                    this.initDialog("BISM:Qna.Dialog", session, args);
                })
        .matches('BISM:qna.botinteraction.whatissam',(session, args) => {
                    this.initDialog("BISM:Qna.Dialog", session, args);
                })
        .matches('BISM:qna.process.kbcreation',(session, args) => {
                    this.initDialog("BISM:Qna.Dialog", session, args);
               })
        .matches('BISM:qna.software.mysupportapp.information',(session, args) => {
                    this.initDialog("BISM:Qna.Dialog", session, args);
                })
        .matches('BISM:qna.platform.hpc.access',(session, args) => {
            this.initDialog("BISM:Qna.Dialog", session, args);
                })
        .matches('BISM:qna.platform.successfactors.mobile',(session, args) => {
                    this.initDialog("BISM:Qna.Dialog", session, args);
                })
        .matches('BISM:qna.platform.successfactors.timeoffapproval',(session, args) => {
                    this.initDialog("BISM:Qna.Dialog", session, args);
                })
        .matches('BISM:qna.platform.successfactors.notimeoff',(session, args) => {
                   this.initDialog("BISM:Qna.Dialog", session, args);
                })
        .matches('BISM:qna.platform.successfactors.talentcard',(session, args) => {
                    this.initDialog("BISM:Qna.Dialog", session, args);
                })
        .matches('BISM:qna.platform.successfactors.generichelp',(session, args) => {
                    this.initDialog("BISM:Qna.Dialog", session, args);
                })
            .onDefault((session, args) => {
            session.privateConversationData.translationSupport = false;
            if (!session.privateConversationData.countryDetailsSupport) {
                session.send('Sorry! The Chat Service is not available in your region at the moment. It will be communicated accordingly when the service will be live in your region.');
                session.send('In the meantime check out the MySupport [http://mysupport] page to look for support alternatives.')
                return;
            }
            else {
                LuisConfiguration.logger.info("Entered :[Default Dialog]");
                args.intent = "BISM:Knowledge.ArticlesMain"
                session.beginDialog("BISM:Knowledge.ArticlesMain", args);
            }
        });
        bot.dialog('/', intents);
    }
}
