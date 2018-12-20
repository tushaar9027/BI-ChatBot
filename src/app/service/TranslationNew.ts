
var tokenHandler = require('./tokenHandler');
var request = require('request');
var parseString = require('xml2js').parseString;
var urlencode = require('urlencode');
import { ServerHandler } from '../../middleware/ServerHandlers';


tokenHandler.init();

export let traslateText = (event: any, next: any, fromLocale: String, toLocale: String) => {
    console.log("Entered in the Latest Translation");
    var token = tokenHandler.token();
    if (token && token !== "") { //not null or empty string
        var urlencodedtext = urlencode(event.text); // convert foreign characters to utf8
        console.log("value of urlencodedtext",urlencodedtext);
        var options = {
            method: 'GET',
            url: 'http://api.microsofttranslator.com/v2/Http.svc/Translate' + '?text=' + urlencodedtext + '&from=' + fromLocale + '&to=' + toLocale + "&category=5f237097-b735-4345-8831-7c9e56d666c5_GENERAL",
            headers: {
                'Authorization': 'Bearer ' + token
            }

        };
        request(options, function (error: any, response: any, body: any) {
            //Check for error
            if (error) {
            } else if (response.statusCode !== 200) {
            } else {
                // Returns in xml format, no json option :(
                parseString(body, function (err: any, result: any) {
                    event.text = result.string._;
                    next();
                });

            }
        });
    } else {
        next();
    }
}