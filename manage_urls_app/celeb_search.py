from twitter import *
import json
import re
from collections import Counter
from manage_urls_app import config

twitter = Twitter(
    auth=OAuth(config.access_key,config.access_secret,config.consumer_key,config.consumer_secret))

def get_celebs():
    celebNames = []
    celebs = []
    celebsRepeat = []
    badWords = ["racist", "fascist", "ugly", "stupid", "liar", "corrupt", "fat", "misogynist", "chauvinist", "idiot"]
    for word in badWords:
        regex = r"\sis\sa*\s" + word
        q1 = '/"is a ' + word + '/"'
        tweetsWithWord = twitter.search.tweets(q=q1, count=100)['statuses']
        tempUser = {}
        retweets = 0
        for tweet in tweetsWithWord:
            outputObj = {'mentions': tweet['entities']['user_mentions'], 'userName': tweet['user']['screen_name'],
                         'text': tweet['text'], 'good': {}}
            retweets += tweet['retweet_count']
            matches = re.search(regex, outputObj['text'])
            if matches:
                firstPart = re.split(regex, outputObj['text'])[0]
                name = firstPart.split(" ")
                firstName = name[-1]
                if firstName and firstName[0].isupper():
                    lastName = firstPart[-2]
                    if lastName and lastName[0].isupper():
                        outputObj['good'] = firstName + lastName
                    else:
                        outputObj['good'] = firstName
                if outputObj['good']:
                    celebNames.append(outputObj['good'])
        outputObj['retweet_count'] = retweets
        if celebNames:
            celebName = Counter(celebNames).most_common(1)[0]
            if celebName[0] not in celebsRepeat:
                celebsRepeat.append(celebName[0])
                users = twitter.users.search(q=celebName[0], count=20)
                followers_count = 0
                userName = 'a'
                image = 'b'
                for user in users:
                    if user["followers_count"] > followers_count:
                        userName = user["name"]
                        followers_count = user["followers_count"]
                        image = user["profile_image_url"].replace('_normal', '')
            tempUser["name"] = userName;
            tempUser["image"] = image
            tempUser["word"] = word.upper()
            tempUser["retweet_count"] = retweets
            celebs.append(tempUser)
        celebNames = []
    return json.dumps(celebs)

