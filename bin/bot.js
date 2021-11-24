const app = require('../app');
const Twit = require('twit');
const moment = require('moment');

const T = new Twit({
    consumer_key: app.get('options').key,
    consumer_secret: app.get('options').secret,
    access_token: app.get('options').token,
    access_token_secret: app.get('options').token_secret
});

console.log('start...');

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
        if (response) {
            log('>> OK: ' + msg.substr(0, 20));
        } else if (error) {
            log('>> NG: ' + msg.substr(0, 20));
        }
        const random = getRandomInt(180, 360);
        setTimeout(() => {tweet(msg)}, 1000 * 60 * random);
        log('next will be ' + random + ' min after.');
    });
}

function retweet(keywords) {
    const query = {q: keywords, count: 10, result_type: "recent"};

    T.get('search/tweets', query, (error, data, response) => {
        if (!error) {
            var retweetId = data.statuses[0].id_str;
            T.post('statuses/retweet/' + retweetId, { }, (error, data, response) => {
                if (response) {
                    log('>> OK RT: ' + keywords);
                } else if (error) {
                    log('>> NG RT: ' + keywords, error);
                }

                const random = getRandomInt(60, 90);
                setTimeout(() => {retweet(keywords)}, 1000 * 60 * random);
                log('next will be ' + random + ' min after.');
            });
        } else {
            log('NG with your hashtag search: ' + keywords, error);
        }
    });
}

const tweetMessages = [
    'Are you still wearing out the mv and cp commands?\nhttps://ontheroadjp.github.io/Shell-Stash/'
];

const searchWords = [
    '#vuejs', 'vuepress', '#shellscript', '#mediaarts'
];

for (const m of tweetMessages) {
    tweet(m);
}

for (const w of searchWords) {
    retweet(w);
}

