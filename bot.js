const Twit = require('twit');
const T = new Twit(require('./config.js'));

function log(msg) {
    console.log(new Date() + ": " + msg);
}

function tweetMessage(msg) {
    T.post('statuses/update', {status: msg }, (error, data, response) => {
        if (response) {
            log('OK tweet messages.');
        }
        if (error) {
            log('NG tweet message:', error);
        }
    });
//    repeatTweetMessage(msg);
    repeat('tweet', msg);
}

function retweetLatest(keywords) {
    const query = {q: keywords, count: 10, result_type: "recent"};

    T.get('search/tweets', query, (error, data, response) => {
        if (!error) {
            var retweetId = data.statuses[0].id_str;
            T.post('statuses/retweet/' + retweetId, { }, (error, data, response) => {
                if (error) {
                    log('NG RT: ' + keywords, error);
                } else if (response) {
                    log('OK RT: ' + keywords);
                }
            });
        } else {
            log('NG with your hashtag search: ' + keywords, error);
        }
        repeat('retweet', keywords);
    });
}

function getRandomMin(min, max) {
//    var min = 60;
//    var max = 180;
    return Math.floor( Math.random() * (max + 1 - min) ) + min;
}

// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
//function repeatTweetMessage(msg) {
//    var random = getRandomMin();
//    log('----------------------------');
//    log('>> ' + msg);
//    log('next Tweet will be ' + random + ' min after.');
//    setTimeout(() => {tweetMessage(msg)}, 1000 * 60 * random);
//}
//
//function repeatRetweet(keywords) {
//    var random = getRandomMin();
//    log('----------------------------');
//    log('>> ' + keywords);
//    log('next RT will be ' + random + ' min after.');
//    setTimeout(() => {retweetLatest(keywords)}, 1000 * 60 * random);
//}

function repeat(type, content) {
    let random = 3600;
    log('----------------------------');
    log('>> ' + content);
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
    tweetMessage(m);
}

for (const w of searchWords) {
    retweetLatest(w);
}

//tweetMessage('Are you still wearing out the mv and cp commands?\nhttps://ontheroadjp.github.io/Shell-Stash/');
//retweetLatest('#vuejs');
//retweetLatest('vuepress');
//retweetLatest('#shellscript');
//retweetLatest('#mediaarts');

