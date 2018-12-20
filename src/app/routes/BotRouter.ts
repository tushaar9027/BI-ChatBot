import { Router, NextFunction, Request, Response } from 'express';
import { BIBotConnector } from '../bot/connector/BIBotConnector';
import { BIBotConnectorService } from '../bot/connector/BIBotConnectorService';
export class BotRouter {
    private static router: Router
  
    public static getInstance(): Router{
      if (BotRouter.router == null) {
        let er = new BotRouter()
        er.init();
      }
      return BotRouter.router;
    }
  
  
    /**
     * Initialize the HeroRouter
     */
    constructor() {
        BotRouter.router = Router();
    }
  
  
  

  /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
      let botService = BIBotConnectorService.getInstance();
      botService.initBot();      
      let bot = botService.getBotConnector(); 
      BotRouter.router.post('/messages', [
        function (req: Request, res: Response, next: NextFunction) {
            next();
        },
        bot.hook(),
        bot.listen()
    ]);
    }
  
  }
  