import * as express from 'express';
import * as session from 'express-session';
import * as passport from 'passport'
import { Properties } from 'ts-json-properties';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import { BasicStrategy } from 'passport-http';

import { ServerHandler } from './middleware/ServerHandlers';
import * as dotenv from 'dotenv';
import { BotRouter } from './app/routes/BotRouter';
import { ProxyRouter } from './controller/ProxyRouter';


// let tunnel = require('global-tunnel');

// tunnel.initialize();

let app = express();

dotenv.load();
Properties.initialize();

//  let staticPage = express.static(path.join(__dirname, './'));
// //console.log("This is the value of my sttaic page \n",staticPage);
// //app.get(/\/(.*)?.*/,passport.authenticate('basic',{ session: false}),app.use('/',staticPage));
// //app.use('/',[ auth, staticPage]);
// app.use('/',staticPage);

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use('/api', BotRouter.getInstance());
app.use('/BISMServices/Service.svc', ProxyRouter.getInstance());
app.use(session({
    secret: 'somesecretgoeshere',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000000 }
}));

app.use(ServerHandler.getErrorHandler);

var credentials = {
    userName: "bipoc",
    password: "bipoc@0304"
};

passport.use(new BasicStrategy(
  function(username: any, password: any, done: any) {;
    if (username.valueOf() === credentials.userName &&
      password.valueOf() === credentials.password)
      return done(null, true);
    else
      return done(null, false);
  }
));


export default app;
