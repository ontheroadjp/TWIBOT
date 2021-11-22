const app = require('../app');
const Twit = require('twit');
const CronJob = require('cron').CronJob;
const moment = require('moment');
moment.locale('ja');

const T = new Twit({
    consumer_key: app.get('options').key,
    consumer_secret: app.get('options').secret,
    access_token: app.get('options').token,
    access_token_secret: app.get('options').token_secret
});

function log(msg) {
    const m = moment();
    const date = m.format('YYYYMMDD-HH:mm:ss');
    console.log(date + ": " + msg);
}

function tweetMessage(msg, repeater) {
    T.post('statuses/update', {status: msg }, (error, data, response) => {
        if (response) {
            log('>> OK: ' + msg.substr(0, 20) + '.. tweet messages.');
        }
        if (error) {
            log('>> NG: ' + msg.substr(0, 20) + '.. tweet messages.');
        }
        repeater('tweet', msg);
    });
}

function retweetLatest(keywords, repeater) {
    const query = {q: keywords, count: 10, result_type: "recent"};

    T.get('search/tweets', query, (error, data, response) => {
        if (!error) {
            var retweetId = data.statuses[0].id_str;
            T.post('statuses/retweet/' + retweetId, { }, (error, data, response) => {
                if (error) {
                    log('>> NG RT: ' + keywords, error);
                } else if (response) {
                    log('>> OK RT: ' + keywords, error);
                }
                repeater('retweet', keywords);
            });
        } else {
            log('NG with your hashtag search: ' + keywords, error);
        }
    });
}

function getRandomMin(min, max) {
    return Math.floor( Math.random() * (max + 1 - min) ) + min;
}

const repeater = (type, content) => {
    let random = 3600;
    switch(type) {
        case 'tweet':
            random = getRandomMin(180, 360);
            setTimeout(() => {tweetMessage(content)}, 1000 * 60 * random);
            break;
        case 'retweet':
            random = getRandomMin(60, 180);
            setTimeout(() => {retweetLatest(content)}, 1000 * 60 * random);
            break;
    }
    log('next will be ' + random + ' min after.');
}

const tweetMessages = [
    'Are you still wearing out the mv and cp commands?\nhttps://ontheroadjp.github.io/Shell-Stash/'
];

const searchWords = [
    '#vuejs', 'vuepress', '#shellscript', '#mediaarts'
];

for (const m of tweetMessages) {
    tweetMessage(m, repeater);
}

for (const w of searchWords) {
    retweetLatest(w, repeater);
}

