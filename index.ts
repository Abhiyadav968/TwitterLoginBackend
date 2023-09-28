const PORT = 3000;
const path = require('path');
const Cors = require('cors');
const passport = require('passport');
const express = require('express');
const app = express();
const Strategy = require('passport-twitter').Strategy;
const session = require('express-session');
require('dotenv').config();

passport.use(new Strategy({
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    callbackURL: process.env.TWITTER_CALLBACK, 
}, function (token: any, tokenSecret: any, profile: any, callback: any) {
    const user = {
        token,
        tokenSecret,
    };
    return callback(null, profile);
}));

passport.serializeUser(function (user: any, callback: any) {
    callback(null, user);
});

passport.deserializeUser(function (obj: any, callback: any) {
    callback(null, obj);
});

app.use(Cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client')));

app.use(session({ secret: 'SECRETE-KEY', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req: any, res: any) => {
    res.sendFile('index.html', { user: req.user });
});

app.get('/profile', (req: any, res: any) => {
    const user = req.user;
    const name = user.displayName;
    const profileImageUrl = user.photos[0].value;
    res.send(`Name ${name} <br> <br> <img src="${profileImageUrl}" alt="User Profile Image">  <br> <br> `);
});

app.get('/twitter/login', passport.authenticate('twitter'));

app.get('/twitter/return', passport.authenticate('twitter', {
    failureRedirect: '/'}), function (req: any, res: any) {
    res.redirect('/profile')
});

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
});
