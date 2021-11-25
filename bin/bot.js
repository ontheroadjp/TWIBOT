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

const CONFIG_FILE = './config.js';
const TIMER_FILE = './timer.json';
let conf = '';
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

function setTimer(action, key, interval) {
    setTimeout(() => {action(key)}, interval * 60 * 1000);
    timers[key] = moment()
                        .locale('ja')
                        .add(interval, 'minutes')
                        .format('YYYY-MM-DD HH:mm:ss');
    fs.writeFileSync(TIMER_FILE, JSON.stringify(timers));
    log('next will be ' + interval + ' min after.');
}

function getTimer(key) {
    return moment(timers[key], "YYYY-MM-DD HH:mm:ss");
}

const tweet = (msg) => {
    T.post('statuses/update', {status: msg }, (error, data, response) => {
        const st = error ? 'NG' : 'OK';
        log('>> ' + st + ': ' + msg.substr(0,20));
        const min = conf().interval_between_tweet_min;
        const max = conf().interval_between_tweet_max;
        setTimer(tweet, msg, getRandomInt(min, max));
    });
}

const retweet = (hash) => {
    const query = {q: hash, count: 10, result_type: "recent"};
    T.get('search/tweets', query, (error, data, response) => {
        if (!error) {
            const retweetId = data.statuses[0].id_str;
            T.post('statuses/retweet/' + retweetId, { }, (error, data, response) => {
                const st = error ? 'NG' : 'OK';
                log('>> ' + st + ': ' + hash);
                const min = conf().interval_between_retweet_min;
                const max = conf().interval_between_retweet_max;
                setTimer(retweet, hash, getRandomInt(min, max));
            });
        } else {
            log('NG with your hashtag search: ' + hash, error);
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

loadObject(CONFIG_FILE, (obj) => {
    conf = obj;
    timers = JSON.parse(fs.readFileSync(TIMER_FILE, 'utf8'));

    for (const content of conf().tweetMessages) {
        dispatch(tweet, content);
    }

    for (let content of conf().hashtags) {
        dispatch(retweet, content);
    }

    log('Waiting Tweets: ' + Object.keys(timers).length)
});

function dispatch(action, content) {
    log('call dispatch: ' + content + ', timer: ' + timers[content]);
    if( timers[content] == null ) {
        action(content);
    } else {
        const now = moment().locale('ja').format('YYYY-MM-DD HH:mm:ss');
        const timerDate = getTimer(content);
        if(timerDate.isBefore(now, 'minute')) {
            action(content);
        }
    }
}
