import { Value } from 'ts-json-properties';
export class BIDialogsUtil{

    @Value("bi_entities.bi.entities.BI-AS-SERVICEMANAGER")
    private static serviceManager: any;
    @Value("bi_entities.bi.entities.DE-AS-IDEA4CON")
    private static idea4con: any;

    public static getEntity(entity: string): string{
        let synonyms : string[] = this.serviceManager.values;
        if (synonyms.indexOf(entity.toLocaleLowerCase()) != -1)
            return this.serviceManager.name;
        synonyms=this.idea4con.values;
        if (synonyms.indexOf(entity.toLocaleLowerCase()) != -1)
            return this.idea4con.name;
        return "";
    }
}