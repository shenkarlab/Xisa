'use strict';

var app = angular.module('xisa', []);
var path = 'https://xisasimpleserver.herokuapp.com/api/';
var WIDTH_MULTIPLIER = 400;

function getUrlParameter(param) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split(/[&||?]/),
        res;
    for (var i = 0; i < sURLVariables.length; i += 1) {
        var paramName = sURLVariables[i],
            sParameterName = (paramName || '').split('=');
        if (sParameterName[0] === param) {
            res = sParameterName[1];
        }
    }
    return res;
}

function setMovingTextClass(news, i){
    $("#text_move" + (i + 1)).hover(function(){
        news[0].pauseTicker();
    }, function(){
        news[0].startTicker();
    });
}

function showPopup(i, tweetId, top){
    $("#ti_news" + (i + 1)).mouseenter(function(){
        var tweet = document.getElementById("tweet");
        twttr.widgets.createTweet(
            tweetId, tweet,
            {
                conversation : 'none',    // or all
                cards        : 'hidden',  // or visible
                linkColor    : '#cc0000', // default is blue
                theme        : 'light'    // or dark
            }).then (function (el) {
                $('#tweet').css('visibility', "visible");
                $('#tweet').css('top', top + 140);
                $('#tweet').append('<span class="arrow" style="visibility: hidden;"></span>');
                $('.arrow').css('visibility', "visible");
        });
    }).mouseleave(function(){
        $('#tweet ').empty();
        $('.arrow').css('visibility', "hidden");
        $('#tweet').css('visibility', "hidden");
    });
}

app.controller('whoCtrl', ['$scope', '$http', '$timeout',  function ($scope, $http, $timeout) {
    $scope.selectFilter = 'ALL';
    $scope.categories = [
        {
            name: 'ALL',
            ref: 'characteristics'
        },
        {
            name: 'BODY PARTS',
            ref: 'body-parts'
        },
        {
            name: 'CRAZY/ILL',
            ref: 'crazy-ill'
        },
        {
            name: 'GAY/SEXUALITY',
            ref: 'gay-sexuality'
        },
        {
            name: 'BELIEF/AGENDA',
            ref: 'belief-agenda'
        },
        {
            name: 'MISOGYNIST',
            ref: 'misogynist'
        }
    ];


    var config = {
        headers : {
            'Content-Type': 'application/json'
        }
    };

    $http.get('/api/getCelebs').then(function (response) {
        $scope.mostHated = 'MOST HATED';
        $scope.people = 'PEOPLE';
        $scope.past = 'The past 7 days on Twitter';
        $scope.cubes = [];
        var hatedArray = [];
        $scope.isError = false;
        angular.forEach(response.data, function (data) {
            hatedArray.push({name: data.twitter_name});
            var url = '/hated?name=' + data.name + '&twitter_name=' + data.twitter_name;
            $scope.cubes.push({
                name: data.name,
                word: data.word,
                image: data.image,
                url: url
            });
        });
        $http.post('/local/hated', JSON.stringify(hatedArray), config).then(function(response){
            console.log('hated file saved');
        },function (response) {
            console.log('error saving file');
        });
    }, function (error) {
        $scope.isError = true;
    });
    $scope.getCelebs = function (category) {
        $http.get('/api/getCelebs/'+category.ref).then(function (response) {
            $timeout(function(){
                var hatedArray = [];
                $scope.cubes = [];
                $scope.isError = false;
                $scope.selectFilter = category.name;
                $scope.hideOptions = false;
                angular.forEach(response.data, function (data) {
                    hatedArray.push({name: data.twitter_name});
                    var url = '/hated?name=' + data.name + '&twitter_name=' + data.twitter_name;
                    $scope.cubes.push({
                        name: data.name,
                        word: data.word,
                        image: data.image,
                        url: url
                    });
                });
                $http.post('/local/hated',JSON.stringify(hatedArray), config).then(function(response){
                    console.log('hated file saved');
                },function (response) {
                    console.log('error saving file');
                });
            });
        }, function (error) {
            $scope.isError = true;
        });
    };
}]);

app.controller('howCtrl', ['$scope', '$http', '$compile', function ($scope, $http, $compile) {
    $scope.isError = false;
    var lastName = getUrlParameter('name').split("%20");
    var twitter_name = getUrlParameter('twitter_name');
    var array = [];
    $http.get('/local/hated').then(function (response) {
        angular.forEach(response.data, function(data){
            array.push(data.name);
        });
    },function (response) {
        console.log('error getting hated array')
    });
    lastName = lastName[lastName.length - 1];
    if (lastName == null) {
        lastName = getUrlParameter('name');
    }
    var request = decodeURIComponent('/api/celeb/' + lastName + '/' + twitter_name);
    $http.get(request).then(function (response) {
        if (response.data == null || response.data.error != null) {
            $scope.isError = true;
        }
        else {
            $scope.celebImage = response.data.user_details.image;
            $scope.celebName = response.data.user_details.name.toUpperCase();
            $scope.twitterName = '@' + response.data.user_details.twitter_name;
            $scope.numOfPeople = response.data.total_bad_tweets + ' mean tweets were posted this week about ';
            $scope.badWord = response.data.mostUsedWord;
            $scope.also = 'Here are the most offensive ones.';
            var maxLen = 0;
            angular.forEach(response.data.words_with_tweets, function (data) {
                if (maxLen < data.bad_words_count) {
                    maxLen = data.bad_words_count;
                }
            });
            $scope.bars = [];
            var i = 0;
            var k = 0;
            angular.forEach(response.data.words_with_tweets, function (data) {
                if (data.texts == null) {
                    $scope.isError = true;
                }
                else {
                    $scope.bars.push({
                        word: data.word.toUpperCase(),
                        width: {'width': data.bad_words_count / maxLen * WIDTH_MULTIPLIER},
                        bad_words_count: data.bad_words_count
                    });
                    var texts = '<div class="TickerNews" id="text_move' + (i + 1) + '"><div class="ti_wrapper"><div class="ti_slide"><div class="ti_content" id="ti_content' + (i + 1) + '"></div></div></div></div>';
                    var compiled = $compile(texts)($scope);
                    $("#bad_words").append(compiled);
                    angular.forEach(data.texts, function (text) {
                        var innerTexts = "";
                        $scope.tweetId = text.tweet_id;
                        innerTexts += '<div class="ti_news" id="ti_news' + (k + 1) + '">';
                        text.tweet.split(" ").forEach(function (word) {
                            if (word == data.word) {
                                innerTexts += '<span id="markWord">' + word.toUpperCase() + '&nbsp</span>';
                            } else if (word.startsWith('@')) {
                                var found = $.inArray(word, array) > -1;
                                if (found) {
                                    innerTexts += '<a href="/hated?name=' + word.substring(1) + '">' + word.toUpperCase() + '&nbsp</a>'
                                }
                                else {
                                    innerTexts += '<a href="/hater?name=' + word.substring(1) + '">' + word.toUpperCase() + '&nbsp</a>'
                                }
                            } else {
                                innerTexts += word.toUpperCase() + '&nbsp';
                            }
                        });
                        innerTexts += '&nbsp&nbsp <a class="reply" href="https://twitter.com/intent/tweet?in_reply_to=' + text.tweet_id + '"></a> &nbsp&nbsp </div>';
                        var compiled = $compile(innerTexts)($scope);
                        $("#ti_content" + (i + 1)).append(compiled);
                        var elemLoaction = $("#ti_content" + (i + 1)).offset();
                        showPopup(k, text.tweet_id, elemLoaction.top);
                        k++;
                    });
                    var news = $("#text_move"+(i+1)).newsTicker();
                    setMovingTextClass(news, i);
                }
                i++;
            });
        }
    }, function (error) {
        $scope.isError = true;
    });
}]);

app.controller('whatCtrl', function ($scope, $http, $compile) {
    $scope.isError = false;
    var twitterName = getUrlParameter('name');
    var request = decodeURIComponent('/api/user/' + twitterName);
    var array = [];
    $http.get('/local/hated').then(function (response) {
        angular.forEach(response.data, function(data){
            array.push(data.name);
        });
    },function (response) {
        console.log('error getting hated array')
    });
    $http.get(request).then(function (response) {
        if (response.data == null || response.data.error != null) {
            $scope.isError = true;
        }
        else {
            $scope.celebImage = response.data.user_details.image;
            $scope.firstName = response.data.user_details.name.split(" ")[0].toUpperCase();
            $scope.lastName = (response.data.user_details.name.split(" ").length > 1) ? response.data.user_details.name.split(" ")[1].toUpperCase() : '';
            $scope.twitterName = '@' + response.data.user_details.screen_name;
            $scope.followersCount = response.data.user_details.followers_count + ' followers';
            $scope.numOfPeople = 'This week, ' + $scope.twitterName + ' used ';
            $scope.also = ' offensive words';
            $scope.picText =  $scope.twitterName + " doesn't like these people: ";
            var badWordCount = 0;
            $scope.pics = [];
            var maxLen = 0;
            angular.forEach(response.data.images, function(data){
                $scope.pics.push({
                    image: data.image,
                    url: '/hater?name=' + data.twitter_name
                });
            });
            angular.forEach(response.data.words_with_tweets, function (data) {
                if (maxLen < data.count) {
                    maxLen = data.count;
                }
            });
            $scope.bars = [];
            var i = 0;
            var k = 0;
            angular.forEach(response.data.words_with_tweets, function (data) {
                if (data.texts == null) {
                    $scope.isError = true;
                }
                else {
                    badWordCount += data.count;
                    $scope.bars.push({
                        word: data.word.toUpperCase(),
                        width: {'width': data.count / maxLen * WIDTH_MULTIPLIER},
                        bad_words_count: data.count
                    });
                    var texts = '<div class="TickerNews" id="text_move' + (i + 1) + '"><div class="ti_wrapper"><div class="ti_slide"><div class="ti_content" id="ti_content' + (i + 1) + '"></div></div></div></div>';
                    var compiled = $compile(texts)($scope);
                    $("#bad_words").append(compiled);
                    angular.forEach(data.texts, function (text) {
                        var innerTexts = "";
                        $scope.tweetId = text.tweet_id;
                        innerTexts += '<div class="ti_news" id="ti_news' + (k + 1) + '">';
                        text.tweet.split(" ").forEach(function (word) {
                            if (word == data.word) {
                                innerTexts += '<span id="markWord">' + word.toUpperCase() + '&nbsp</span>';
                            } else if (word.startsWith('@')) {
                                var found = $.inArray(word, array) > -1;
                                if (found) {
                                    innerTexts += '<a href="/hated?name=' + word.substring(1) + '">' + word.toUpperCase() + '&nbsp</a>'
                                }
                                else {
                                    innerTexts += '<a href="/hater?name=' + word.substring(1) + '">' + word.toUpperCase() + '&nbsp</a>'
                                }
                            } else {
                                innerTexts += word.toUpperCase() + '&nbsp';
                            }
                        });
                        innerTexts += '&nbsp&nbsp <a class="reply" href="https://twitter.com/intent/tweet?in_reply_to=' + text.tweet_id + '"></a> &nbsp&nbsp </div>';
                        var compiled = $compile(innerTexts)($scope);
                        $("#ti_content" + (i + 1)).append(compiled);
                        var elemLoaction = $("#ti_content" + (i + 1)).offset();
                        showPopup(k, text.tweet_id, elemLoaction.top - 110);
                        k++;
                    });
                    var news = $("#text_move"+(i+1)).newsTicker();
                    setMovingTextClass(news, i);
                }
                i++;
            });
            $scope.badWordCount = badWordCount;
        }
    }, function (error) {
        $scope.isError = true;
    });
});

app.controller('whomCtrl', function ($scope, $http) {
    $scope.isError = false;
    $http.get('/api/getUsers').then(function (response) {
        $scope.mostHating = 'MOST HATING';
        $scope.users = 'USERS';
        $scope.past = 'The past 7 days on Twitter';
        $scope.cubes = [];
        angular.forEach(response.data, function (data) {
            $scope.cubes.push({
                name: data.twitter_name.substring(0, 10),
                url: '/hater?name=' + data.twitter_name,
                image: data.image,
                followers: data.followers_count
            });
        });
    }, function (error) {
        $scope.isError = true;
    });
});

app.controller('navCtrl', ['$scope', function ($scope) {

    $scope.navLinks = [{
        Title: '/',
        Alias: '/',
        LinkText: 'HATED'
    }, {
        Title: '/haters',
        Alias: 'haters',
        LinkText: 'HATER'
    }];

    $scope.navClass = function (page) {
        var currentRoute = window.location.pathname.substring(1);
        currentRoute = currentRoute.split("?")[0] || '/';
        if (currentRoute.startsWith('hater')) {
            currentRoute = 'haters';
        } else if (currentRoute.startsWith('hated')) {
            currentRoute = '/';
        }
        return page === currentRoute ? 'active' : '';
    };
}]);


app.controller('footerCtrl', ['$scope', function($scope){
    $scope.studio = " OFFENSIVE";
    $scope.studioCont = " studio TLV 2017";
    $scope.sprd = 'SPRD if you hate'
}]);
