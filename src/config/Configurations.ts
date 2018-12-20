
export enum Environment{
    DEV = 'DEV',
    PROD = 'PROD',
    TEST = 'TEST'
}

export class ServerConfiguration{
    private static environment =  process.env.NODE_ENV || Environment.DEV;
    private static port =  process.env.PORT || '3000';
    private static logging: true

    private static normalizePort(val: string) {
        const parsedPort = parseInt(val, 10);
        if (isNaN(parsedPort)) {
          // named pipe
          return val;
        }
        if (parsedPort >= 0) {
          // port number
          return parsedPort;
        }
        return false;
    }

    public static getServerPort(){
        return ServerConfiguration.normalizePort(ServerConfiguration.port)
    }
  
}

export class BotConfigurations {
    private static botConfig: any;
    private static webAppConfig: any;

    public static getBotConfig(){
        if (BotConfigurations.botConfig == null){
            BotConfigurations.botConfig ={ authentication:{Id:process.env.MICROSOFT_BOT_ID, password:process.env.MICROSOFT_BOT_PASSWORD},
            botStorage : {accountName :process.env.BOT_STORAGE_ACCOUNT_NAME, accountKey :process.env.BOT_STORAGE_ACCOUNT_KEY,tableName:process.env.TABLE_NAME },
            botDirectLineConfig: {secret:process.env.BOT_CHANNEL_SECRECT, uri:process.env.BOT_DIRECTLINE_BASE_URI}}
          }
        return BotConfigurations.botConfig;
    };

    public static getWebAppConfig(){
        if (BotConfigurations.webAppConfig == null){
            BotConfigurations.webAppConfig = {id:process.env.WEB_APP_ID, 
            secret:process.env.WEB_APP_PASSWORD, 
            redirectUri:process.env.WEB_APP_REDIRECT_URI, 
            redirectPage:process.env.WEB_APP_REDIRECT_PAGE};
        }  else 
            return BotConfigurations.webAppConfig;

    }

    private static getLuisUrl(val: string | undefined) {
        if (val === undefined) {
          throw new SettingUndefinedError(
            "Environment variable (LUIS_APP_URL) is not specified."
          );
        }  
        return val;
    }

    public static getLuisAppUrl(){
        return this.getLuisUrl(process.env.LUIS_APP_URL);
    }

    public static showTicket(){
        return process.env.TICKETS_SHOW;
    }

}

class SettingUndefinedError extends Error {
    constructor(message: string) {
      super(message);
    }
}