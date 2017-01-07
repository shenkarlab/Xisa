from twitter import *
import json
from manage_urls_app import config

twitter = Twitter(
    auth=OAuth(config.access_key, config.access_secret, config.consumer_key, config.consumer_secret))
bad_words = ["racist", "fascist", "ugly", "stupid", "liar", "corrupt", "fat", "misogynist", "chauvinist", "idiot"]


def get_tweets(name):
    texts = {}
    result = []
    for word in bad_words:
        phrase = '/"' + name + ' is a ' + word + '/"'
        tweets = twitter.search.tweets(q=phrase, count=100)['statuses']
        texts[word] = {'word': word, 'texts': [], 'bad_words_count': 0}
        for tweet in tweets:
            if tweet['text'] not in texts[word]['texts']:
                texts[word]['texts'].append(tweet['text'])
        bad_words_count = 0
        for text in texts[word]['texts']:
            bad_words_count += text.count(word)
        texts[word]['bad_words_count'] = bad_words_count
    for value in texts.values():
        temp = value
        result.append(temp)
    result.sort(key=lambda x: x['bad_words_count'])
    return json.dumps(result[5:])


