# Tweet Bot

This is a Twitter Bot working with Twitter API v2.0 based on Node.js. TWIBOT is a program that automatically tweets and retweets. 



### Interval to repeat a tweet/retweet

The interval between tweets is not constant. The interval for each tweeting or retweeting will be randomly executed within the specified range of time.



For example, if you set three different tweet contents and set the tweet interval from 60 minutes to 180 minutes, each tweet will be tweeted at any time from 60 minutes to 180 minutes later.

In other words, the three tweets will be tweeted at different times.

The timing of the subsequent tweets will also be randomly set from 60 minutes to 180 minutes after each of the three tweets.



### How retweeting works

You can set any hashtag, and TWIBOT will search for that hashtag when it retweets, and retweet the latest tweet.



## Getting Started



### STEP1: clone this repository and install npm libraries.

```bash
$ git clone https://github.com/ontheroadjp/TWIBOT
$ cd TWIBOT
$ npm install
```



### STEP2: Create run file

replace ``xxxxxxx`` to your own keys below

- ``TWIBOT_API_KEY`` is ``consumer_key``
- ``TWIBOT_API_KEY_SECRET`` is ``consumer_key_secret``
- ``TWIBOT_ACCESS_TOKEN`` is ``access_token``
- ``TWIBOT_ACCESS_TOKEN_SECRET`` is ``access_token_secret``

```bash
#!/bin/bash

export TWIBOT_API_KEY=xxxxxxx
export TWIBOT_API_KEY_SECRET=xxxxxxx
export TWIBOT_ACCESS_TOKEN=xxxxxxx
export TWIBOT_ACCESS_TOKEN_SECRET=xxxxxxx

npm start

exit 0
```



### STEP3: Run script

```bash
$ run
```



## set your tweet and interval to tweet/retweet

Open ``config.js`` in a text editor such as vim and change each item.

By default, 2 tweets and 11 hashtags are set.

The two tweets are set to be repeated between 120 and 180 minutes after they are tweeted, and the retweets are set to be repeated between 60 and 180 minutes after they are tweeted.

```bash
$ vim config.js

exports = function () {
    return {
        interval_between_tweet_min: 120,
        interval_between_tweet_max: 180,
        interval_between_retweet_min: 60,
        interval_between_retweet_max: 180,
        tweetMessages: [
            'Are you still wearing out the mv and cp commands?\n\nhttps://ontheroadjp.github.io/Shell-Stash/\n\n#shell #Linux #shell #shellscript #100DaysOfCode',
            'Generate a directory tree for testing at breakneck speed!\n\nhttps://ontheroadjp.github.io/dammy/\n\n#100DaysOfCode #programmer'
        ],
        hashtags: [
            'vuejs',
            'vuepress',
            'nodejs',
            'laravel',
            'webpack',
            'javascript',
            'es6',
            'shellscript',
            'mediaarts',
            'vim',
            'zsh'
        ],
    }
}
```

4. That's all
5. run script to exec TWIBOT !

```bash
$ run
```



## Deploy to Heroku

TWIBOT is already ready to be deployed to Heroku. Once you have created your Heroku app and set your environment variables, all you need to do is git push.

### STEP 1: Create Heroku app.

```bash
$ heroku create
```

### STEP 2: Set environment variables

Replace each ``xxxxxxx`` to yours. 

```bash
$ heroku config:set TWIBOT_API_KEY=xxxxxxx
$ heroku config:set TWIBOT_API_KEY_SECRET=xxxxxxx
$ heroku config:set TWIBOT_ACCESS_TOKEN=xxxxxxx
$ heroku config:set TWIBOT_ACCESS_TOKEN_SECRET=xxxxxxx
```

### STEP 3: Deploy

```bash
$ git push heroku master
```

Execute the ``heroku open`` command to launch a web browser. If you see the string ``This is a Twitter-bot application.``, you're all done!



