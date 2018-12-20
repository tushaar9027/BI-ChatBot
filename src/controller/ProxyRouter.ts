import { Router, NextFunction, Response, Request } from 'express';
import { BISMProxy } from '../service/BISMProxy';
export class ProxyRouter{
    private static router: Router

    public static  getInstance(): Router {
        if (ProxyRouter.router == null){
            let er = new ProxyRouter();
            er.init();
        }
        return ProxyRouter.router;
    }

    constructor(){
        ProxyRouter.router =  Router();
    }

    public sendToBISM(req: Request, res: Response, next: NextFunction){
        console.log('inside send to BISM');
        console.log(req.baseUrl + '=='+req.originalUrl);
        console.log(req.body);
        console.log("This is the value of my full url in ProxyRouter : ",'https://smservicesdev.boehringer-ingelheim.com'+req.originalUrl,req.body);
        BISMProxy.callBismPost('https://smservicesdev.boehringer-ingelheim.com'+req.originalUrl,JSON.stringify(req.body)).
        then((response:any)=>{
            //console.log(response);
            res.send(response);
        });
    }

    init() {
        ProxyRouter.router.post('*', this.sendToBISM);
    }
    
}