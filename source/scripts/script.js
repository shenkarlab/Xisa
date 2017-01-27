'use strict';

var app = angular.module('xisa', []);
var path = 'https://xisasimpleserver.herokuapp.com/api/';
var WIDTH_MULTIPLIER = 400;

app.factory('hatedService', ['$rootScope', function ($rootScope) {
    $rootScope.hated = [];

    var setHated = function (hatedList) {
        $rootScope.hated = hatedList;
    };

    var getAllHated = function () {
        return $rootScope.hated;
    };

    return {
        setHated: setHated,
        getAllHated: getAllHated
    }

}]);

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


// function setMovingTextClass(news, i) {
//     $("#text_move" + (i + 1)).hover(function () {
//         news[0].pauseTicker();
//         var content = $('#text_move' + (i + 1) + ' .ti_content').children('div');
//         angular.forEach(content, function (child) {
//             angular.forEach($(child).children('.whatmark'), function (grandchild) {
//                 $(grandchild).hover(function () {
//                     $(this).removeClass('whatmark');
//                     $(this).addClass('redUnder');
//                 }, function () {
//                     $(this).first().removeClass('redUnder');
//                     $(this).first().addClass('whatmark');
//                 });
//             });
//         });
//     }, function () {
//         news[0].startTicker();
//     });
// }

app.controller('whoCtrl', ['$scope', '$http', 'hatedService', function ($scope, $http, hatedService) {
    $http.get('/api/getCelebs').then(function (response) {
        $scope.mostHated = 'MOST HATED';
        $scope.people = 'PEOPLE';
        $scope.past = 'The past 7 days on Twitter';
        $scope.cubes = [];
        $scope.isError = false;
        var hatedList = [];
        angular.forEach(response.data, function (data) {
            hatedList.push(data.twitter_name);
            $scope.cubes.push({
                name: data.name,
                word: data.word,
                image: data.image,
                url: '/how?name=' + data.name
            });
        });
        hatedService.setHated(hatedList);
    }, function (error) {
        $scope.isError = true;
    });
}]);

app.controller('howCtrl', ['$scope', '$http', 'hatedService', function ($scope, $http, hatedService) {
    $scope.isError = false;
    $scope.hated = hatedService.getAllHated();
    var lastName = getUrlParameter('name').split("%20");
    lastName = lastName[lastName.length - 1];
    if (lastName == null) {
        lastName = getUrlParameter('name');
    }
    var request = decodeURIComponent('/api/celeb/' + lastName);
    $http.get(request).then(function (response) {
        if (response.data == null) {
            $scope.isError = true;
        }
        else {
            $scope.celebImage = response.data.user_details.image;
            $scope.celebName = response.data.user_details.name;
            $scope.twitterName = '@' + response.data.user_details.twitter_name;
            $scope.numOfPeople = 'This week, People said 100 times That he is ';
            $scope.badWord = response.data.mostUsedWord;
            ;
            $scope.also = 'They also said about him:';
            var maxLen = 0;
            angular.forEach(response.data.words_with_tweets, function (data) {
                if (maxLen < data.bad_words_count) {
                    maxLen = data.bad_words_count;
                }
            });
            $scope.bars = [];
            $scope.wrappers = [];
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
                    var texts = [];
                    angular.forEach(data.texts, function (text) {
                        var words = [];
                        text.tweet.split(" ").forEach(function (word) {
                            var route = ($.inArray(word.substring(1), $scope.hated) > -1) ? "/how" : "/what";
                            words.push({
                                word: word.toUpperCase(),
                                url: word.substring(1),
                                route: route
                            });
                        });
                        texts.push({
                            tweet: text,
                            word: data.word,
                            tweetId: text.tweet_id,
                            words: words
                        });
                    });
                    $scope.wrappers.push({texts: texts});
                }
            });
            $scope.shouldLink = function (word) {
                return !!word.word.startsWith('@');
            };
            $scope.wordClass = function (text, word) {
                return word.word.toUpperCase() === text.word.toUpperCase();
            }
        }
    }, function (error) {
        $scope.isError = true;
    });
}]);

app.controller('whatCtrl', function ($scope, $http, $compile) {
    $scope.isError = false;
    var lastName = getUrlParameter('name').split("%20");
    lastName = lastName[lastName.length - 1];
    if (lastName == null) {
        lastName = getUrlParameter('name');
    }
    var request = decodeURIComponent('/api/user/' + lastName);
    $http.get(request).then(function (response) {
        if (response.data == null) {
            $scope.isError = true;
        }
        else {
            $scope.celebImage = response.data.user_details.image;
            $scope.firstName = response.data.user_details.name.split(" ")[0].toUpperCase();
            $scope.lastName = (response.data.user_details.name.split(" ").length > 1) ? response.data.user_details.name.split(" ")[1].toUpperCase() : '';
            $scope.twitterName = '@' + response.data.user_details.screen_name;
            $scope.followersCount = response.data.user_details.followers_count + ' followers';
            $scope.numOfPeople = 'This week, ' + $scope.twitterName + ' said ';
            $scope.picText = "She doesn't like these people: "
            $scope.also = ' offensive words';
            var maxLen = 0;
            angular.forEach(response.data.words_with_tweets, function (data) {
                if (maxLen < data.bad_words_count) {
                    maxLen = data.bad_words_count;
                }
            });
            var badWordCount = 0;
            $scope.pics = [];
            for (var j = 0; j < 5; j++) {
                $scope.pics.push({
                    image: response.data.images[j]
                });
            }
            $scope.bars = [];
            $scope.wrappers = [];
            angular.forEach(response.data.words_with_tweets, function (data) {
                if (data.texts == null) {
                    $scope.isError = true;
                }
                else {
                    badWordCount += data.bad_words_count;
                    $scope.bars.push({
                        word: data.word.toUpperCase(),
                        width: {'width': data.bad_words_count / maxLen * WIDTH_MULTIPLIER},
                        bad_words_count: data.bad_words_count
                    });
                    var texts = [];
                    angular.forEach(data.texts, function (text) {
                        var words = [];
                        text.tweet.split(" ").forEach(function (word) {
                            var route = ($.inArray(word.substring(1), $scope.hated) > -1) ? "/how" : "/what";
                            words.push({
                                word: word.toUpperCase(),
                                url: word.substring(1),
                                route: route
                            });
                        });
                        texts.push({
                            tweet: text,
                            word: data.word,
                            tweetId: text.tweet_id,
                            words: words
                        });
                    });
                    $scope.wrappers.push({texts: texts});
                }
            });
            $scope.shouldLink = function (word) {
                return !!word.word.startsWith('@');
            };
            $scope.wordClass = function (text, word) {
                return word.word.toUpperCase() === text.word.toUpperCase();
            }
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
                url: '/what?name=' + data.name,
                image: data.image,
                followers: data.followers_count
            });
        });
    }, function (error) {
        $scope.isError = true;
    });
});

// app.controller('searchCtrl', ['$scope', '$location', function ($scope, $location) {
//     $('#serchInput').focusin(function () {
//         $('nav ul').css('opacity', '0.1');
//         $('#leftText').css('opacity', '0.1');
//         $('#cubeContainer').css('opacity', '0.1');
//     });
//
//     $('#serchInput').focusout(function () {
//         $('nav ul').css('opacity', '1');
//         $('#leftText').css('opacity', '1');
//         $('#cubeContainer').css('opacity', '1');
//     });
// }]);


app.component('navbar', {
    bindings: {
        items: '='
    },
    templateUrl: 'navbar.html'
});

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

app.controller('filterCtrl', ['$scope', '$http', '$location', function ($scope, $http) {

    $scope.selectFilter = 'CATEGORIES';
    $scope.categories = [{name: 'BODY PARTS', ref: 'body_parts'}, {
        name: 'CHARECTERISTICS',
        ref: 'charecteristics'
    }, {name: 'CRAZY/ILL', ref: 'crazy'}, {name: 'BELIEF/AGENDA', ref: 'belief'}, {
        name: 'MYSOGENIST',
        ref: 'mysogenist'
    }];

    $scope.getCelebs = function (category) {

        // $('#cubeContainer').empty();
        // $http.get('/api/getCelebs/' + category.ref).then(function (response) {
        //     // buildCubes(response.data);
        //     $scope.selectFilter = category.name;
        //     $scope.hideOptions = false;
        // }, function (error) {
        //     $scope.isError = true;
        // });
    };

}]);

// function buildCubes(data, category) {
//     var i = 1;
//     angular.forEach(data, function (value) {
//         var cube = '<a id="cube' + i + '" href="/how?name=' + value.name + '&category=' + category + '">' +
//             '<section class="cube">' +
//             '<p id="hashtag"><span class="highlight">' + value.word + '</span></p>' +
//             '<p id="celebName"><span class="highlight">' + value.name + '</span></p>' +
//             '</section>' +
//             '<a>';
//         $('#cubeContainer').append(cube);
//         var url = 'url(' + value.image + ')';
//         $('#cube' + i).css('background', url);
//         $('#cube' + i).css('background-size', 'cover');
//         i++;
//     })
// }