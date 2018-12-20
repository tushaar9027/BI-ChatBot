import * as request from 'request';
import { ServerHandler } from '../../middleware/ServerHandlers';
import { HttpService } from './HttpService';
var parseString = require('xml2js').parseString;
var urlencode = require('urlencode');
import { Value } from 'ts-json-properties';

export class TranslationService extends HttpService {
    @Value("translationService.translationKey")
    translationKey: string;
    @Value("translationService.translateTextUri")
    translateTextUrl: string;
    static logger = ServerHandler.getLogger();
    private token: any;
    private tokeninterval: any;
    private TRANSLATIONKEY = this.translationKey; // Replace this with your translation key as a string

    static instance: TranslationService;

    public static getInstance(): TranslationService {
        if (this.instance == null) {
            this.instance = new TranslationService();
        }
        return this.instance;
    }

    constructor() {
        super();
        //  this.getToken();
        
    }
    public async translateTextV3(event : any, next : any, toLocale : String) {
    TranslationService.logger.info("Entered :TranslationService :[translateTextV3]");
    var urlencodedtext = urlencode(event.text);
    let url = this.translateTextUrl + toLocale;
    TranslationService.logger.debug("translateTextV3 URL : [translateTextV3]", url);
    let result = await this.callPost(url, this.TRANSLATIONKEY, event);
    TranslationService.logger.debug("Translation Service Result : [translateTextV3]", result);
    TranslationService.logger.info("Exit :TranslationService :[translateTextV3]");
    return this.getTranslatedText(JSON.parse(result));

}
    //[{"detectedLanguage":{"language":"en","score":1.0},"translations":[{"text":"Hallo Welt!","to":"de"}]}]
    private getTranslatedText(response: any){
    TranslationService.logger.info("Entered :TranslationService :[getTranslatedText]");
    TranslationService.logger.info("Exit :TranslationService :[getTranslatedText]");
    return response[0].translations[0].text;
}


   

}