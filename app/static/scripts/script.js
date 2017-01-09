'use strict';

var app = angular.module('xisa', []);

var path = 'https://xisasimpleserver.herokuapp.com/api/';

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

app.controller('whoCtrl', function($scope, $http) {
    $http.get(path+'getCelebs')
	    .then(function (response){
        $scope.mostHated = 'MOST HATED';
        $scope.people = 'PEOPLE';
        $scope.lowerBuzz = 'lower Buzz';
        $scope.higherBuzz = 'higher Buzz';
        $('retweet').append('<img id="bar" src="images/bar.png" alt="color bar">');
    		var i = 1;
	    	angular.forEach(response.data, function(value){
	    		var cube =	'<a href="/how?name='+value.name+'&word='+value.word+'&url='+value.image+'">'+
      	    						'<section class="cube" id="cube'+i+'">'+
        									'<p id="hashtag"><span class="highlight">'+value.word+'</span></p>'+
                          '<p id="celebName"><span class="highlight">'+value.name+'</span></p>'+
        								'</section>'+
        							'<a>';
  				$('#cubeContainer').append(cube);
          var url = 'url('+value.image+')';
          $('#cube'+i).css('background',url);
  				i++;
	    	})
      },function (error){
        $('#cubeContainer').append('<section class="error">500<br>Twitter connection error</section>');
		});
});

app.controller('howCtrl', function($scope, $http) {
	 var names = getUrlParameter('name').replace("%20", " ").split(" ");
   var lastName = names[names.length - 1];
   $http.get(path+'celeb/'+lastName)
	    .then(function (response){
        var url = getUrlParameter('url');
        var urlAppend = 'url('+url+')';
        $('body').css('background',urlAppend);
        $('body').css('background-repeat','no-repeat');
        $('body').css('background-size','100% 100%');
	    	var badWord = getUrlParameter('word');
	    	$scope.celebName = getUrlParameter('name').replace("%20", " ").toUpperCase();
	     	$scope.twitterName = getUrlParameter('name').replace("%20", " ");
        $scope.numOfPeople = 'This week, People said 100 times That he is ';
        $scope.badWord = badWord;
        $scope.also = 'They also said about him:';
        var i = 0;
        angular.forEach(response.data, function(data){
          var barDiv =  '<p id="barBadWord">'+data.word.toUpperCase()+'</p>'+
                        '<div class="bar_chart" style="width:'+data.bad_words_count*3+'px;"></div>'+
                        '<p id="barWordCount">'+data.bad_words_count+'</p>'
          $("#bars").append(barDiv);
          var texts = "";
          texts += '<div class="TickerNews" id="text_move'+(i+1)+'"> <div class="ti_wrapper"> <div class="ti_slide"> <div class="ti_content"> ';
          data.texts.forEach(function(text){
            texts += '<div class="ti_news">';
            text.split(" ").forEach(function(word){
              if(word == data.word){
                texts += '<span id="markWord">'+word.toUpperCase()+'&nbsp</span>'
              } else {
                texts += word.toUpperCase() + '&nbsp';
              }
            })
            texts += '&nbsp&nbsp + &nbsp&nbsp</div> ';
          });
          texts += '</div> </div> </div> </div>';
          $("#bad_words").append(texts);
          i++;
        })
        $('#howContent').append('<div class="clear"></div>');
        $("#text_move1,#text_move2,#text_move3,#text_move4,#text_move5").newsTicker();
	    },function (error){
          $('#howContent').append('<section class="error">500<br>Twitter connection error</section>');
		});
});

app.controller('whatCtrl', function($scope, $http) {
   var names = getUrlParameter('name').replace("%20", " ").split(" ");
   var lastName = names[names.length - 1];
   $http.get(path+'celeb/'+lastName)
      .then(function (response){
        var url = getUrlParameter('url');
        var urlAppend = 'url('+url+')';
        $('body').css('background',urlAppend);
        $('body').css('background-repeat','no-repeat');
        $('body').css('background-size','100% 100%');
        var badWord = getUrlParameter('word');
        $scope.firstName = getUrlParameter('name').replace("%20", " ").toUpperCase().split(" ")[0];
        $scope.lastName = getUrlParameter('name').replace("%20", " ").toUpperCase().split(" ")[1];
        $scope.twitterName = getUrlParameter('name').replace("%20", " ");
        $scope.followersCount = '3000 followers';
        $scope.numOfPeople = 'This week, '+$scope.firstName+' said ';
        $scope.badWordCount = 345;
        $scope.picText = "She doesn't like these people: "
        $scope.also = ' offencive words';
        var i = 0;
        for (var j = 0; j < 5; j++){
          var pic = '<img src="'+url+'" alt="hatedPic" class="pics">';
          $('#pics').append(pic);
        }
        $('#pics').append('<div class="clear"></div>');
        angular.forEach(response.data, function(data){
          var barDiv =  '<p id="whatbarBadWord">'+data.word.toUpperCase()+'</p>'+
                        '<div class="whatbar_chart" style="width:'+data.bad_words_count*3+'px;"></div>'+
                        '<p id="whatbarWordCount">'+data.bad_words_count+'</p>'
          $("#whatbars").append(barDiv);
          var texts = "";
          texts += '<div class="TickerNews" id="text_move'+(i+1)+'"> <div class="ti_wrapper"> <div class="ti_slide"> <div class="ti_content"> ';
          data.texts.forEach(function(text){
            texts += '<div class="ti_news">';
            text.split(" ").forEach(function(word){
              if(word == data.word){
                texts += '<span id="whatmarkWord">'+word.toUpperCase()+'&nbsp</span>'
              } else {
                texts += word.toUpperCase() + '&nbsp';
              }
            })
            texts += '&nbsp&nbsp + &nbsp&nbsp</div> ';
          });
          texts += '</div> </div> </div> </div>';
          $("#whatbad_words").append(texts);
          i++;
        })
        $('#whatContent').append('<div class="clear"></div>');
        $("#text_move1,#text_move2,#text_move3,#text_move4,#text_move5").newsTicker();
      },function (error){
          $('#whatContent').append('<section class="error">500<br>Twitter connection error</section>');
    });
});

app.controller('whomCtrl', function($scope, $http) {
    $http.get(path+'getCelebs')
      .then(function (response){
        // var minRetweets = 9999999999;
        // var maxRetweets = 0;
        $scope.mostOffencive = 'MOST OFFENCIVE';
        $scope.users = 'USERS';
        $scope.lowerFollowers = 'lower followers';
        $scope.higherFollowers = 'higher followers';
        $('whomretweet').append('<img id="bar" src="images/redbar.png" alt="color bar">');
        var i = 1;
        angular.forEach(response.data, function(value){
          var cube =  '<a href="/what?name='+value.name+'&word='+value.word+'&url='+value.image+'">'+
                          '<section class="whomcube" id="whomcube'+i+'">'+
                          '<p id="userName"><span class="blackHighlight">'+value.word+'</span></p>'+
                          '<p id="location"><span class="blackHighlight">'+value.name+'</span></p>'+
                        '</section>'+
                      '<a>';
          $('#whomcubeContainer').append(cube);
          var url = 'url('+value.image+')';
          $('#whomcube'+i).css('background',url);
          i++;
        })
      },function (error){
        $('#whomcubeContainer').append('<section class="error">500<br>Twitter connection error</section>');
    });
});

app.controller('navCtrl', ['$scope', '$location', function ($scope, $location) {

    $scope.navLinks = [{
        Title: '/',
        Alias: '/',
        LinkText: 'WHO'
    }, {
        Title: '#',
        Alias: 'how',
        LinkText: 'HOW'
    }, {
        Title: '#',
        Alias: 'what',
        LinkText: 'WHAT'
    }, {
        Title: '/whom',
        Alias: 'whom',
        LinkText: 'WHOM'
    }];

    $scope.navClass = function (page) {
        var currentRoute = window.location.pathname.substring(1);
        currentRoute = currentRoute.split("?")[0] || '/';
        return page === currentRoute ? 'active' : '';
    };   
}]);

