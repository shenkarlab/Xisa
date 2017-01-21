'use strict';

var app = angular.module('xisa', []);
var path = 'https://xisasimpleserver.herokuapp.com/api/';
var hatedArray = [];
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


function setMovingTextClass(news, i) {
    $("#text_move" + (i + 1)).hover(function () {
        news[0].pauseTicker();
        var content = $('#text_move' + (i + 1) + ' .ti_content').children('div');
        angular.forEach(content, function (child) {
            angular.forEach($(child).children('.whatmark'), function (grandchild) {
                $(grandchild).hover(function () {
                    $(this).removeClass('whatmark');
                    $(this).addClass('redUnder');
                }, function () {
                    $(this).first().removeClass('redUnder');
                    $(this).first().addClass('whatmark');
                });
            });
        });
    }, function () {
        news[0].startTicker();
    });
}

app.controller('whoCtrl', function ($scope, $http, $compile) {
    $http.get('/api/getCelebs').then(function (response) {
        $scope.mostHated = 'MOST HATED';
        $scope.people = 'PEOPLE';
        $scope.past = 'The past 7 days on Twitter';
        $scope.cubes = [];
        angular.forEach(response.data, function (data) {
            $scope.cubes.push({
                name: data.name,
                word: data.word,
                image: data.image,
                url: '/how?name=' + data.name
            });
        });
    }, function (error) {
        $('#cubeContainer').append('<section class="error">500<br>Twitter connection error</section>');
    });
});

app.controller('howCtrl', function ($scope, $http, $compile) {
    var lastName = getUrlParameter('name').split("%20");
    lastName = lastName[lastName.length - 1];
    if (lastName == null) {
        lastName = getUrlParameter('name');
    }
    var request = decodeURIComponent('/api/celeb/' + lastName);
    $http.get(request).then(function (response) {
        if (response.data == null) {
            $('#howContent').append('<section class="error">500<br>Twitter connection error</section>');
        }
        else {
            var url = response.data.celeb_details.image;
            var urlAppend = 'url(' + url + ')';
            $('body').css('width', '100vw');
            $('body').css('height', '100vh');
            $('body').css('background', '#464646 ' + urlAppend + ' no-repeat fixed center center');
            $('body').css('background-size', 'cover');
            $scope.celebName = response.data.celeb_details.name;
            $scope.twitterName = '@' + response.data.celeb_details.twitter_name;
            $scope.numOfPeople = 'This week, People said 100 times That he is ';
            $scope.badWord = response.data.mostUsedWord;;
            $scope.also = 'They also said about him:';
            var maxLen = 0;
            angular.forEach(response.data.wordsWithTweets, function (data) {
                if (maxLen < data.bad_words_count) {
                    maxLen = data.bad_words_count;
                }
            });
            var i = 0;
            angular.forEach(response.data.wordsWithTweets, function (data) {
                if (data.texts == null) {
                    $('#howContent').append('<section class="error">500<br>Twitter connection error</section>');
                }
                else {
                    var barDiv = '<p class="barBadWord">' + data.word.toUpperCase() + '</p>' +
                        '<div class="bar_chart" style="width:' + (data.bad_words_count / maxLen * WIDTH_MULTIPLIER) + 'px;"></div>' +
                        '<p class="barWordCount">' + data.bad_words_count + ' times</p>';
                    $("#bars").append(barDiv);
                    var texts = "";
                    texts += '<div class="TickerNews" id="text_move' + (i + 1) + '"> <div class="ti_wrapper"> <div class="ti_slide"> <div class="ti_content"> ';
                    var k = 0;
                    data.texts.forEach(function (text) {
                        texts += '<div class="ti_news" id="ti_news' + (k + 1) + '">';
                        text.split(" ").forEach(function (word) {
                            if (word == data.word) {
                                texts += '<span id="markWord">' + word.toUpperCase() + '&nbsp</span>';
                            } else if (word.startsWith('@')) {
                                var found = $.inArray(word, hatedArray) > -1;
                                if (found) {
                                    texts += '<a href="/how?name=' + word.substring(1) + '">' + word.toUpperCase() + '&nbsp</a>'
                                }
                                else {
                                    texts += '<a href="/what?name=' + word.substring(1) + '">' + word.toUpperCase() + '&nbsp</a>'
                                }
                            } else {
                                texts += word.toUpperCase() + '&nbsp';
                            }
                        })
                        texts += '&nbsp&nbsp + &nbsp&nbsp</div> ';
                        var textId = "ti_news" + (k + 1);
                        $("#howContent").mouseenter(textId, function () {
                            $("#popup").css('visibility', 'visible');
                            $("#tweetText").text(text);
                            $("#tweetTime").text(new Date().getTime());
                        }).mouseleave(textId, function () {
                            $("#popup").css('visibility', 'hidden');
                        });
                        k++;
                    });
                    texts += '</div> </div> </div> </div>';
                    var compiled = $compile(texts)($scope);
                    $("#bad_words").append(compiled);
                    var news = $("#text_move" + (i + 1)).newsTicker();
                    setMovingTextClass(news, i);
                }
                i++;
            })
        }
    }, function (error) {
        $('#howContent').append('<section class="error">500<br>Twitter connection error</section>');
    });
});

app.controller('whatCtrl', function ($scope, $http, $compile) {
    var lastName = getUrlParameter('name').split("%20");
    lastName = lastName[lastName.length - 1];
    if (lastName == null) {
        lastName = getUrlParameter('name');
    }
    var request = decodeURIComponent('/api/user/' + lastName);
    $http.get(request).then(function (response) {
        if (response.data == null) {
            $('#whatContent').append('<section class="error">500<br>Twitter connection error</section>');
        }
        else {
            var url = response.data.user_details.image;
            var urlAppend = 'url(' + url + ')';
            $('body').css('background', urlAppend);
            $('body').css('background-repeat', 'no-repeat');
            $('body').css('background-size', '100% 100%');
            $scope.firstName = response.data.user_details.name.split(" ")[0].toUpperCase();
            $scope.lastName = (response.data.user_details.name.split(" ").length > 1) ? response.data.user_details.name.split(" ")[1].toUpperCase() : '';
            $scope.twitterName = '@' + response.data.user_details.screen_name;
            $scope.followersCount = response.data.user_details.followers_count + ' followers';
            $scope.numOfPeople = 'This week, ' + $scope.twitterName + ' said ';
            $scope.picText = "She doesn't like these people: "
            $scope.also = ' offensive words';
            var maxLen = 0;
            angular.forEach(response.data.wordsWithTweets, function (data) {
                if (maxLen < data.bad_words_count) {
                    maxLen = data.bad_words_count;
                }
            });
            var i = 0;
            var badWordCount = 0;
            for (var j = 0; j < 5; j++) {
                var pic = '';
                pic += '<section class="pics" style="background: url(' + response.data.images[j] + '); background-size: contain;">';
                pic += '</section>';
                $('#pics').append(pic);
            }
            angular.forEach(response.data.words_with_texts, function (data) {
                if (data.texts == null) {
                    $('#whatContent').append('<section class="error">500<br>Twitter connection error</section>');
                }
                else {
                    badWordCount += data.count;
                    var barDiv = '<p class="whatbarBadWord">' + data.word.toUpperCase() + '</p>' +
                        '<div class="whatbar_chart" style="width:' + (data.bad_words_count / maxLen * WIDTH_MULTIPLIER) + 'px;"></div>' +
                        '<p class="whatbarWordCount">' + data.count + ' times</p>';
                    $("#whatbars").append(barDiv);
                    var texts = "";
                    texts += '<div class="TickerNews" id="text_move' + (i + 1) + '"> <div class="ti_wrapper"> <div class="ti_slide"> <div class="ti_content"> ';
                    var k = 0;
                    data.texts.forEach(function (text) {
                        texts += '<div class="ti_news" id="ti_news' + (k + 1) + '">';
                        text.tweet.split(" ").forEach(function (word) {
                            if (word == data.word) {
                                texts += '<span id="whatmarkWord">' + word.toUpperCase() + '&nbsp</span>'
                            } else if (word.startsWith('@')) {
                                var found = $.inArray(word, hatedArray) > -1;
                                if (found) {
                                    texts += '<a href="/how?name=' + word.substring(1) + '">' + word.toUpperCase() + '&nbsp</a>'
                                }
                                else {
                                    texts += '<a href="/what?name=' + word.substring(1) + '">' + word.toUpperCase() + '&nbsp</a>';
                                }
                            } else {
                                texts += word.toUpperCase() + '&nbsp';
                            }
                        })
                        texts += '&nbsp&nbsp + &nbsp&nbsp</div> ';
                        k++;
                    });
                    texts += '</div> </div> </div> </div>';
                    var compiled = $compile(texts)($scope);
                    $("#whatbad_words").append(compiled);
                    var news = $("#text_move" + (i + 1)).newsTicker();
                    setMovingTextClass(news, i);
                }
                i++;
            });
            $scope.badWordCount = badWordCount;
        }
    }, function (error) {
        $('#whatContent').append('<section class="error">500<br>Twitter connection error</section>');
    });
});

app.controller('whomCtrl', function ($scope, $http) {
    $http.get('/api/getUsers').then(function (response) {
        $scope.mostHating = 'MOST HATING';
        $scope.users = 'USERS';
        $scope.past = 'The past 7 days on Twitter';
        $scope.cubes = [];
        angular.forEach(response.data, function (data) {
            $scope.cubes.push({
                name: data.tweeter_name.substring(0, 10),
                url: '/what?name=' + data.name ,
                image: data.image,
                followers: data.followers_count
            });
        });
    }, function (error) {
        $('#cubeContainer').append('<section class="error">500<br>Twitter connection error</section>');
    });
});

app.controller('searchCtrl', ['$scope', '$location', function ($scope, $location) {
    $('#serchInput').focusin(function () {
        $('nav ul').css('opacity', '0.1');
        $('#leftText').css('opacity', '0.1');
        $('#cubeContainer').css('opacity', '0.1');
    });

    $('#serchInput').focusout(function () {
        $('nav ul').css('opacity', '1');
        $('#leftText').css('opacity', '1');
        $('#cubeContainer').css('opacity', '1');
    });
}]);
app.controller('navCtrl', ['$scope', '$location', function ($scope, $location) {

    $scope.navLinks = [{
        Title: '/',
        Alias: '/',
        LinkText: 'HATED'
    }, {
        Title: '/whom',
        Alias: 'whom',
        LinkText: 'HATER'
    }];

    $scope.navClass = function (page) {
        var currentRoute = window.location.pathname.substring(1);
        currentRoute = currentRoute.split("?")[0] || '/';
        if (currentRoute.startsWith('what')) {
            currentRoute = 'whom';
        } else if (currentRoute.startsWith('how')) {
            currentRoute = '/';
        }
        return page === currentRoute ? 'active' : '';
    };
}]);

app.controller('filterCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {

    $scope.selectFilter = 'CATEGORIES';
    $scope.categories = [{name: 'BODY PARTS', ref: 'body_parts'}, {
        name: 'CHARECTERISTICS',
        ref: 'charecteristics'
    }, {name: 'CRAZY/ILL', ref: 'crazy'}, {name: 'BELIEF/AGENDA', ref: 'belief'}, {
        name: 'MYSOGENIST',
        ref: 'mysogenist'
    }];

    $scope.getCelebs = function (category) {
        $('#cubeContainer').empty();
        $http.get('/api/getCelebs/' + category.ref).then(function (response) {
            buildCubes(response.data);
            $scope.selectFilter = category.name;
            $scope.hideOptions = false;
        }, function (error) {
            $('#cubeContainer').append('<section class="error">500<br>Twitter connection error</section>');
        });
    };

}]);

function buildCubes(data) {
    var i = 1;
    angular.forEach(data, function (value) {
        var cube = '<a id="cube' + i + '" href="/how?name=' + value.name + '">' +
            '<section class="cube">' +
            '<p id="hashtag"><span class="highlight">' + value.word + '</span></p>' +
            '<p id="celebName"><span class="highlight">' + value.name + '</span></p>' +
            '</section>' +
            '<a>';
        $('#cubeContainer').append(cube);
        var url = 'url(' + value.image + ')';
        $('#cube' + i).css('background', url);
        $('#cube' + i).css('background-size', 'cover');
        i++;
    })
}