import { Session } from 'botbuilder';
import { BotConfigurations } from '../../../config/Configurations';
import { PorpertiesUtil } from "../../../util/PropertiesUtil";
import { BIBotConnector } from '../connector/BIBotConnector';

export class CardFactory {
    public static knowledgeArticleCard(session: Session, Title: any, URL: any): any {
        var textCard = "\n";
        textCard = textCard + "Title:  " + Title + "\n";
        textCard = textCard + "URL:  " + URL + "\n";
        var card: any = {};
        card.textCard = textCard;
        return card;
    }

    public static getMyTicket(session: Session, response: any): any {
        
        var textCard = "-------------------------Call Details:----------------------------\n";
        function textCardComplete(responseLen: any) {
            //var splitarray = response.Data[i].CreatedOn.split('.');
            //var date = new Date(splitarray[1]+"."+splitarray[0]+"."+splitarray[2]).getTime();
           // var test = Date.now() - date;
            //console.log('########## Date.now()' + Date.now() + '################');
           // console.log('########## date' + date + '################');
            //.log('########## value ' + test + '################');
            //if(test<7200000){
             //   console.log('<2 hrs');
            //}
            
            
            textCard = textCard + "\n";
            textCard = textCard + "Breached:  " + response.Data[i].Breached;
            textCard = textCard + "\n";
            textCard = textCard + "CallID:  " + response.Data[i].CallID;
            textCard = textCard + "\n";
            textCard = textCard + "CreatedOn:  " + response.Data[i].CreatedOn;
            textCard = textCard + "\n";
            textCard = textCard + "LastOfficerAction:  " + response.Data[i].LastOfficerAction;
            textCard = textCard + "\n";
            textCard = textCard + "ShortDescription:  " + response.Data[i].ShortDescription;
            textCard = textCard + "\n";
            textCard = textCard + "Status:  " + response.Data[i].Status;
            textCard = textCard + "\n";
            textCard = textCard + "SupportLevel:  " + response.Data[i].SupportLevel;
            textCard = textCard + "\n";
            textCard = textCard + "TargetTime:  " + response.Data[i].TargetTime;
            textCard = textCard + "\n";
            textCard = textCard + "******************************************************************************  ";
            return textCard;

        }
        let i: any;
        var responseLen = response.Data.length;
        var loopRun = 0;
        if (responseLen > BotConfigurations.showTicket()) {
            loopRun = Number(BotConfigurations.showTicket()) + 1;
        } else {
            loopRun = responseLen;
        }

        if (responseLen > 1) {
            for (i = responseLen - 1; i > responseLen - loopRun; i--) {
                textCardComplete(response);
            }
            var card: any = {};
            card.textCard = textCard;
            return card;
        }
        else if (responseLen == 1) {
            for (i = responseLen - 1; i < responseLen; i++) {
                textCardComplete(response);
            }
            var card: any = {};
            card.textCard = textCard;
            return card;
        }
    }
    
    //----------Sakshi started--------
    
    public static getMyLastOpenTicket(session: Session, response: any): any {
        
        var textCard = "-------------------------Call Details:----------------------------\n";
        function textCardComplete(responseLen: any) {
            console.log("searching last ticket")
            var splitarray = response.Data[i].CreatedOn.split('.');
            var date = new Date(splitarray[1]+"."+splitarray[0]+"."+splitarray[2]).getTime();
            var time = Date.now() - date;
            //console.log('########## Date.now()' + Date.now() + '################');
           // console.log('########## date' + date + '################');
            //.log('########## value ' + test + '################');
            if(time<24 * 7200000 && response.Data[i].Status=="Open"){
             //   console.log('<2 hrs');
            //}
            
                textCard = textCard + "\n";
                textCard = textCard + "Breached:  " + response.Data[i].Breached;
                textCard = textCard + "\n";
                textCard = textCard + "CallID:  " + response.Data[i].CallID;
                textCard = textCard + "\n";
                textCard = textCard + "CreatedOn:  " + response.Data[i].CreatedOn;
                textCard = textCard + "\n";
                textCard = textCard + "LastOfficerAction:  " + response.Data[i].LastOfficerAction;
                textCard = textCard + "\n";
                textCard = textCard + "ShortDescription:  " + response.Data[i].ShortDescription;
                textCard = textCard + "\n";
                textCard = textCard + "Status:  " + response.Data[i].Status;
                textCard = textCard + "\n";
                textCard = textCard + "SupportLevel:  " + response.Data[i].SupportLevel;
                textCard = textCard + "\n";
                textCard = textCard + "TargetTime:  " + response.Data[i].TargetTime;
                textCard = textCard + "\n";
                textCard = textCard + "******************************************************************************  ";
               // console.log("last ticket found" + textCard)
                return textCard;
            }

        }
        let i: any;
        var responseLen = response.Data.length;
        //var loopRun = 0;
       // if (responseLen > BotConfigurations.showTicket()) {
           // loopRun = Number(BotConfigurations.showTicket()) + 1;
       // } else {
        //    loopRun = responseLen;
       // }
       console.log("responselen " + JSON.stringify(response.Data));
        console.log("tickets" + BotConfigurations.showTicket());
        i = BotConfigurations.showTicket();
        for (i = responseLen - 1; i > 0; i--) {
                textCardComplete(response);
            }
            console.log(textCard);
        //textCardComplete(response);
    
    //----------Sakshi ended----------
    }
}