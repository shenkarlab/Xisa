from twitter import *
import json
from manage_urls_app import config

twitter = Twitter(
    auth=OAuth(config.access_key, config.access_secret, config.consumer_key, config.consumer_secret))
bad_words = ["racist", "fascist", "ugly", "stupid", "liar", "corrupt", "fat", "misogynist", "chauvinist", "idiot"]


def get_tweets(name):
    texts = {}
    result = []
    max_bad_words = 0
    for word in bad_words:
        phrase = '/"' + name + ' is a ' + word + '/"'
        tweets = twitter.search.tweets(q=phrase, count=100)['statuses']
        texts[word] = {}
        texts[word]['texts'] = []
        for tweet in tweets:
            if tweet['text'] not in texts[word]['texts']:
                texts[word]['texts'].append(tweet['text'])
        bad_words_count = 0
        for text in texts[word]['texts']:
            for bad_word in bad_words:
                bad_words_count += text.count(bad_word)
        texts[word]['bad_words_count'] = bad_words_count
        if bad_words_count >= max_bad_words:
            max_bad_words = bad_words_count
            texts[word]['word'] = word
            result.append(texts[word])
    return json.dumps(result)
