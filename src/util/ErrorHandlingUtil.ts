import { ServerHandler } from '../middleware/ServerHandlers';

export class CustomError extends Error {
    private static logger =  ServerHandler.getLogger();
    constructor(message: string, functionName : string) {
      super(message);
     this.name = 'CustomError';
     this.stack = (<any> new Error()).stack;
     CustomError.logger.error("Error  : " +functionName+" : ",message);
    }
}
