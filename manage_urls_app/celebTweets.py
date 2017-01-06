from twitter import *
import json
from manage_urls_app import config
#import time

texts = {}
#start_time = time.time()
#logFile = open('page2.json', 'a+', 1)
# config = {}
# exec(compile(open("config.py", "rb").read(), "config.py", 'exec'), config)
twitter = Twitter(
    auth=OAuth(config.access_key, config.access_secret, config.consumer_key, config.consumer_secret))
badWords = ["racist", "fascist", "ugly", "stupid", "liar", "corrupt", "fat", "misogynist", "chauvinist", "idiot"]

def searchTweetsForCeleb(celebLastName):
    for word in badWords:
        regex = r"\s" + celebLastName + "\sis\sa*\s" + word
        q1 = '/"'+ celebLastName + ' is a ' + word + '/"'
        tweetsWithWord = twitter.search.tweets(q=q1, count=100)['statuses']
        texts[word] = {}
        texts[word]['Texts'] = []
        for tweet in tweetsWithWord:
            if tweet['text'] not in texts[word]['Texts']:
                texts[word]['Texts'].append(tweet['text'])
        texts[word]['texts_count'] = len(texts[word]['Texts'])
        number = 0
        for text in texts[word]['Texts']:
            for word1 in badWords:
                number +=  text.count(word1) # how many times bad word occurrences in a tweets
        texts[word]['bad_words_count'] = number
    return json.dumps(texts)
# logFile.write('Tweets')
# logFile.write(json.dumps(texts))
# logFile.close()
