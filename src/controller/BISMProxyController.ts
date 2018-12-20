import { Request, Response } from 'express';

export class BISMProxyController{
	
	    private static instance: BISMProxyController;

    public static getInstance =  () => {
        if(BISMProxyController.instance == null){
            BISMProxyController.instance = new BISMProxyController();
        }
        return BISMProxyController.instance;
    } 
	
	public routeToProxy(req: Request, res: Response){
	}
}