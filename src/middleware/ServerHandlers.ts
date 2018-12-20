import { Request, Response, NextFunction } from 'express';
import * as winston from 'winston';
var date = require('date-and-time');


export class ServerHandler {
    public static getErrorHandler(error: any, req: Request, res: Response, next: NextFunction) {
        ServerHandler.getLogger().error('bot:error:', error);
        res.json({ error: error });
    }

    public static getLogger(): winston.LoggerInstance {
        var now = date.format(new Date(), 'YYYY-MM-DD');
        return new winston.Logger({
            transports: [
                new winston.transports.File({
                    level: 'debug',
                    filename: '../'+now + '_all-logs.log',
                    handleExceptions: true,
                    json: true,
                    maxsize: 5242880, //5MB
                    maxFiles: 5,
                    colorize: false
                }),
                new winston.transports.Console({
                    level: 'debug',
                    handleExceptions: true,
                    json: false,
                    colorize: true,
                    timestamp: true
                })
            ],
            exitOnError: false
        });
    }
}