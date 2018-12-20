//=============================
// Cognitive API Token Setup 
//=============================
var request = require('request');

var token = "";
var tokeninterval:any;
var TRANSLATIONKEY = "d0afc9641c864a84bdd6990ad0b1a8fb"; // Replace this with your translation key as a string

// Put this in a separate web job if deploying to production, otherwise fine for development
// Why I used setTimeout and not setInterval: http://www.thecodeship.com/web-development/alternative-to-javascript-evil-setinterval/
function getToken() {
    
    var options = {
        method: 'POST',
        url: 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken?subscription-key=' + TRANSLATIONKEY
    };

    request(options, function (error:any, response:any, body:any){
        //Check for error
        if(error){
        } else if(response.statusCode !== 200){
        } else {
            //Token gets returned as string in the body
            console.log("value of token of translation--------------->>>>>>>>>>>>>>>>>",token);
            token = body;
        }
    });

    tokeninterval = setTimeout(getToken, 540000); // runs once every 9 minutes, token lasts for 10
}

// Stop the token generation
function stopInterval() {
    clearTimeout(tokeninterval);
}





module.exports = {
  init: function() {
      getToken();
  }, 
  stop: function() {
      stopInterval();
  },
  token: function () {
      return token;
  }



  

};
