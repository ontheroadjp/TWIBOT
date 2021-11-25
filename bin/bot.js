const app = require('../app');
const Twit = require('twit');
const moment = require('moment');

const T = new Twit({
    consumer_key: app.get('options').key,
    consumer_secret: app.get('options').secret,
    access_token: app.get('options').token,
    access_token_secret: app.get('options').token_secret
});

const fs = require('fs');
const vm = require('vm');

let interval_between_tweet_min = 120
let interval_between_tweet_max = 180
let interval_between_retweet_min = 60
let interval_between_retweet_max = 180
let timers = {};

log('start...');

function log (msg) {
    const m = moment()
    const date = m.locale('ja').format('YYYYMMDD-HH:mm:ss');
    console.log('twibot.log', '[' + date + '] ' + msg);
}

function getRandomInt(min, max) {
    return Math.floor( Math.random() * (max + 1 - min) ) + min;
}

function tweet(msg) {
    T.post('statuses/update', {status: msg }, (error, data, response) => {
        const st = error ? 'NG' : 'OK';
        log('>> ' + st + ': ' + msg.substr(0,20));

        const min = interval_between_tweet_min;
        const max = interval_between_tweet_max;

        const random = getRandomInt(min, max);
        const timeoutObj = setTimeout(() => {tweet(msg)}, 1000 * 60 * random);

        clearTimeout(timers[msg]);
        timers[msg] = timeoutObj;

        log('next will be ' + random + ' min after.');
    });
}

function retweet(keywords) {
    const query = {q: keywords, count: 10, result_type: "recent"};

    T.get('search/tweets', query, (error, data, response) => {
        if (!error) {
            var retweetId = data.statuses[0].id_str;
            T.post('statuses/retweet/' + retweetId, { }, (error, data, response) => {
                const st = error ? 'NG' : 'OK';
                log('>> ' + st + ': ' + keywords);

                const min = interval_between_retweet_min;
                const max = interval_between_retweet_max;
                const random = getRandomInt(min, max);
                timeoutObj = setTimeout(() => {retweet(keywords)}, 1000 * 60 * random);

                clearTimeout(timers[keywords]);
                timers[keywords] = timeoutObj;

                log('next will be ' + random + ' min after.');
            });
        } else {
            log('NG with your hashtag search: ' + keywords, error);
        }
    });
}

function loadObject (file, callback) {
    const load = () => {
        const sandbox = {};
        fs.readFile(file, (err, data) => {
            const script = vm.createScript(data, file);
            script.runInNewContext(sandbox);
            obj = sandbox.exports;
            callback(sandbox.exports);
        });
    }
    load();
    fs.watchFile(file, load);
}

loadObject('config.js', (obj) => {
    interval_between_tweet_min = obj().interval_between_tweet_min;
    interval_between_tweet_max = obj().interval_between_tweet_max;
    interval_between_retweet_min = obj().interval_between_retweet_min;
    interval_between_retweet_max = obj().interval_between_retweet_max;

    for (const m of obj().tweetMessages) {
        if( timers[m] == null ) {
            tweet(m);
        }
    }

    for (let w of obj().searchWords) {
        if( timers[w] == null ) {
            retweet(w);
        }
    }
    console.log('Waiting Tweets: ' + Object.keys(timers).length)
});


