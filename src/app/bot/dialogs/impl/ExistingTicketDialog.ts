import { ServerHandler } from '../../../../middleware/ServerHandlers';
import { Library, IDialogWaterfallStep, Session, IDialogResult, IFindMatchResult, Prompts, Message } from 'botbuilder';
import { BIBotConnector } from '../../connector/BIBotConnector';
import { PorpertiesUtil } from '../../../../util/PropertiesUtil';
import { BISMController } from '../../../controller/BISMController';
import { CardFactory } from '../../card/CardFactory';
import { CustomError } from '../../../../util/ErrorHandlingUtil';


export class ExistingTicketDialog {
    static logger = ServerHandler.getLogger();

    public static init(library: Library) {
        library.dialog("ExistingTicket", ExistingTicketDialog.getDialog()).triggerAction({
            matches: ["BISM:ExistingTicket", "Ticket"]
        });
    }
    private static getDialog(): IDialogWaterfallStep[] {
        return [
            async(session: Session, args) => {
                console.log("Inside ExistingTicketDialog");
                ExistingTicketDialog.logger.info("Entered ExistingTicketDialog :", session.privateConversationData.userDetails);
                var responseDataLength = 0;
                //Get Open Tickets
                let payloadStatus = PorpertiesUtil.getJSONPropertiesWithoutSession("getMyTicket.open")
                BISMController.getMyLastOpenTicket(session.userData.userID, '', payloadStatus, session).then(response => {
                    let responseData = JSON.parse(response);
                    console.log("Response Data Length: " + responseData.Data.length)
                    if(responseData.Data.length > 0)
                    {
                        console.log("Inside if more than zero");
                    // Format created on date and check if it was created less than 2 hours ago
                    let lastTicketTime = responseData.Data[0].CreatedOn;
                    var splitDate = lastTicketTime.split('.');
                    var formattedDate = new Date(splitDate[1]+"."+splitDate[0]+"."+splitDate[2]).getTime();
                    var TimeDiff = Date.now() - formattedDate;
                    let lastTicket;
                    if(TimeDiff<=7200000) {
                       //If ticket was created less than 2 hours ago
                       lastTicket = responseData.Data[0];
                       session.dialogData.lastTicket = lastTicket;
                       //console.log(lastTicket);
                       let callid = lastTicket.CallID;
                        //let callid = ""+ response.callID;
                        session.dialogData.callId = callid;
                        session.privateConversationData.callId = callid;
                        session.dialogData.additionalInfo ="";
                        
                        
                        let description = lastTicket.ShortDescription.includes('>') ? lastTicket.ShortDescription.split('>')[1] : lastTicket.ShortDescription;
                        let initialMsg = PorpertiesUtil.getJSONPropertiesWithoutSession("bismLanguage.existingTicketDialog.msg1." + session.privateConversationData.preferredLocale) + lastTicket.CallID + PorpertiesUtil.getJSONPropertiesWithoutSession("bismLanguage.existingTicketDialog.msg2." + session.privateConversationData.preferredLocale)+  description + PorpertiesUtil.getJSONPropertiesWithoutSession("bismLanguage.existingTicketDialog.msg3." + session.privateConversationData.preferredLocale);
                      
                        console.log("Initial Msg" + initialMsg);
                        //let msg = "There is an open ticket with your name \n Ticket Number: " + lastTicket.CallID + "\n Description : " + lastTicket.ShortDescription.split('>')[1] + "\n Would you like to continue with that?";
                       // var msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, initialMsg), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.existingTicketDialog.ask_prompt_choice_result"), "", "", "expectingInput").toMessage();
                        var msg = BIBotConnector.channelDataMessage(session, initialMsg, false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.existingTicketDialog.ask_prompt_choice_result"), "", "", "expectingInput").toMessage();
                        console.log("After Initial Msg" + msg);
                        Prompts.choice(session, msg, msg.sourceEvent.listOption, PorpertiesUtil.choiceOption(session).options);
                        
                        
                        // Prompts.choice(session, msg, 'Yes|No',{ listStyle: 2 });
                    }
                    else {
                        //Normal greeting message
                        session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.greetingDlg.msg1"), false, "", "", "", "ignoringInput").toMessage());  
        				session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.greetingDlg.msg2"), false, "", "", "", "ignoringInput").toMessage());
        				session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.greetingDlg.msg3"), false, "", "", "", "ignoringInput").toMessage());
        				session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.greetingDlg.msg4"), false, "", "", "", "expectingInput").toMessage()).endDialog();  
                        }
                    }
                    else
                    {
                        console.log("Inside else more than zero");
                        //Normal greeting message
                        session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.greetingDlg.msg1"), false, "", "", "", "ignoringInput").toMessage());  
        				session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.greetingDlg.msg2"), false, "", "", "", "ignoringInput").toMessage());
        				session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.greetingDlg.msg3"), false, "", "", "", "ignoringInput").toMessage());
        				session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.greetingDlg.msg4"), false, "", "", "", "expectingInput").toMessage()).endDialog();  
                    }
                }).catch(err => {
                        session.send("We are sorry services are down momentarily");
                        BISMController.logger.info("ExistingTicketDialog : createCancelForTickets :cancelTicketResult : Error", err);
                        throw new CustomError(err.message, "LastTicketSearch");
                });
                   
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                
                if (results.response.index == 0) {
                    if(session.dialogData.lastTicket.ShortDescription.includes('Call Me Back Requested between'))
                    {
                         let msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.existingTicketDialog.prompt_choice1"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.existingTicketDialog.prompt_choice_result1"), "", "", "expectingInput").toMessage();
                         Prompts.choice(session, msg, msg.sourceEvent.listOption, PorpertiesUtil.choiceOption(session).options);
                    }
                    else
                    {
                        let msg = BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.existingTicketDialog.prompt_choice"), false, PorpertiesUtil.getJSONProperties(session, "bismLanguage.existingTicketDialog.prompt_choice_result"), "", "", "expectingInput").toMessage();
                        Prompts.choice(session, msg, msg.sourceEvent.listOption, PorpertiesUtil.choiceOption(session).options);
                    }
                     //Prompts.choice(session, "What action would you like to perform on ticket ?", "Get Connected to a Service Desk Agent right now |Book a callback by a Service Desk Agent for a later time|Cancel the query", { listStyle: 2 });
                 }
                 else
                 {
                     session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.greetingDlg.msg1"), false, "", "", "", "ignoringInput").toMessage());  
        			 session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.greetingDlg.msg2"), false, "", "", "", "ignoringInput").toMessage());
        			 session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.greetingDlg.msg3"), false, "", "", "", "ignoringInput").toMessage());
        			 session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.greetingDlg.msg4"), false, "", "", "", "expectingInput").toMessage()).endDialog(); 
                 }
            },
            (session: Session, results: IDialogResult<IFindMatchResult>, args: any) => {
                 if(session.dialogData.lastTicket.ShortDescription.includes('Call Me Back Requested between'))
                 {
                     if (results.response.index == 0) {
                        Prompts.text(session, BIBotConnector.channelDataMessage(session, "Please wait routing to agent.", false, "", session.dialogData.callId, "ROUTE_TO_AGENT", "ignoringInput").toMessage());
                     }
                     
                     else if(results.response.index == 1) {
                        BISMController.createCancelForTickets(session.dialogData.callId, session.dialogData.additionalInfo, "Ticket Cancelled", session, session.userData.user_ID).then((response) => {
                                session.privateConversationData.dialogEnd = true;
                                PorpertiesUtil.tranlationFlagCleaner(session);
                                session.privateConversationData.updateTicketDescriptionRequired = false;
                                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage());
                        }).catch(err => {
                                session.send("We are sorry services are down momentarily");
                                BISMController.logger.info("ExistingTicketDialog : createCancelForTickets :cancelTicketResult : Error", err);
                                throw new CustomError(err.message, "createCall");
                        });
                     }
                 }
                 else
                 {
                     if (results.response.index == 0) {
                        Prompts.text(session, BIBotConnector.channelDataMessage(session, "Please wait routing to agent.", false, "", session.dialogData.callId, "ROUTE_TO_AGENT", "ignoringInput").toMessage());
                     }
                     else if(results.response.index == 1) {
                        session.beginDialog("BISM:againCall", session.dialogData.callId);
                     }
                     else if(results.response.index == 2) {
                        BISMController.createCancelForTickets(session.dialogData.callId, session.dialogData.additionalInfo, "Ticket Cancelled", session, session.userData.user_ID).then((response) => {
                                session.privateConversationData.dialogEnd = true;
                                PorpertiesUtil.tranlationFlagCleaner(session);
                                session.privateConversationData.updateTicketDescriptionRequired = false;
                                session.send(BIBotConnector.channelDataMessage(session, PorpertiesUtil.getJSONProperties(session, "bismLanguage.askMoreInformationDialog.thank_msg"), true, "", "", "", "ignoringInput").toMessage());
                        }).catch(err => {
                                session.send("We are sorry services are down momentarily");
                                BISMController.logger.info("ExistingTicketDialog : createCancelForTickets :cancelTicketResult : Error", err);
                                throw new CustomError(err.message, "createCall");
                        });
                     }
                 }
            }
        ]
    }  
}