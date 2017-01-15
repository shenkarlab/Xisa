'use strict';

var app = angular.module('xisa', []);
var path = 'https://xisasimpleserver.herokuapp.com/api/';
var flag = false;

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

function filterBtnClick(filter){
   if(flag){
    $('nav ul').css('opacity', '1');
    $('#leftText').css('opacity', '1');
    $('#cubeContainer').css('opacity', '1');
    $('.filterOptions').removeClass('active');
    $('#close').addClass('hidden');
    $('.filterItem').slideToggle(200);
    $('#cubeContainer').empty();
    $http.get('/api/getCelebs').then(function (response){
      angular.forEach(response.data, function(value){
        var cube =  '<a href="/how?name='+value.name+'&word='+value.word+'&url='+value.image+'">'+
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
    flag = false;
  }
}

function setMovingTextClass(news, i){
  $("#text_move"+(i+1)).hover(function(){
    news[0].pauseTicker();
    var content = $('#text_move'+(i+1)+' .ti_content').children('div');
    angular.forEach(content, function(child){
      angular.forEach($(child).children('.whatmark'), function(grandchild){
        $(grandchild).hover(function(){
          $(this).removeClass('whatmark');
          $(this).addClass('redUnder');
          $(this).click(function(){
            window.location.href = '/what?name='+child.html();
          })
        }, function(){
          $(this).first().removeClass('redUnder');
          $(this).first().addClass('whatmark');
        });
      });
    });
  }, function(){
    news[0].startTicker();
  });
}

app.controller('whoCtrl', function($scope, $http) {
    $http.get('/api/getCelebs').then(function (response){
      $scope.mostHated = 'MOST HATED';
      $scope.people = 'PEOPLE';
      $scope.past = 'The past 7 days on Twitter';  
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
   var lastName = getUrlParameter('name').split("%20");
   lastName = lastName[lastName.length -1];
   if(lastName == null){
    lastName = getUrlParameter('name');
   }
   var request = decodeURIComponent('/api/celeb/'+lastName);
   $http.get(request).then(function (response){
    var url = getUrlParameter('url');
    var urlAppend = 'url('+url+')';
    $('body').css('background',urlAppend);
    $('body').css('background-repeat','no-repeat');
    $('body').css('background-size','100% 100%');
  	var badWord = getUrlParameter('word');
  	$scope.celebName = decodeURIComponent(getUrlParameter('name')).toUpperCase();
   	$scope.twitterName = '@'+decodeURIComponent(getUrlParameter('name'));
    $scope.numOfPeople = 'This week, People said 100 times That he is ';
    $scope.badWord = badWord;
    $scope.also = 'They also said about him:';
    var i = 0;
    angular.forEach(response.data, function(data){
      var barDiv =  '<p id="barBadWord">'+data.word.toUpperCase()+'</p>'+
                    '<div class="bar_chart" style="width:'+data.bad_words_count*3+'px;"></div>'+
                    '<p id="barWordCount">'+data.bad_words_count+' times</p>';
      $("#bars").append(barDiv);
      var texts = "";
      texts += '<div class="TickerNews" id="text_move'+(i+1)+'"> <div class="ti_wrapper"> <div class="ti_slide"> <div class="ti_content"> ';
      var k = 0;
      data.texts.forEach(function(text){
        texts += '<div class="ti_news" id="ti_news'+(k+1)+'">';
        text.split(" ").forEach(function(word){
          if(word == data.word){
            texts += '<span id="markWord">'+word.toUpperCase()+'&nbsp</span>'
          } else if(word.startsWith('@')) {
            texts += '<span class="whatmark">'+word.toUpperCase()+'&nbsp</span>'
          } else {
            texts += word.toUpperCase() + '&nbsp';
          }
        })
        texts += '&nbsp&nbsp + &nbsp&nbsp</div> ';
        k++;
      });
      texts += '</div> </div> </div> </div>';
      $("#bad_words").append(texts);
      var news = $("#text_move"+(i+1)).newsTicker();
      setMovingTextClass(news, i);
      i++;
    })
    $('#howContent').append('<div class="clear"></div>');
  },function (error){
      $('#howContent').append('<section class="error">500<br>Twitter connection error</section>');
  });
});

app.controller('whatCtrl', function($scope, $http) {
   var lastName = getUrlParameter('name').split("%20");
   lastName = lastName[lastName.length -1];
   if(lastName == null){
    lastName = getUrlParameter('name');
   }
   var request = decodeURIComponent('/api/user/'+lastName);
   $http.get(request).then(function (response){
    var url = response.data.user_details.image;
    var urlAppend = 'url('+url+')';
    $('body').css('background',urlAppend);
    $('body').css('background-repeat','no-repeat');
    $('body').css('background-size','100% 100%');
    $scope.firstName = response.data.user_details.name.split(" ")[0].toUpperCase();
    $scope.lastName = ($scope.firstName.length > 1) ? response.data.user_details.name.split(" ")[1].toUpperCase() : '';
    $scope.twitterName = '@'+response.data.user_details.screen_name;
    $scope.followersCount = response.data.user_details.followers_count + ' followers';
    $scope.numOfPeople = 'This week, '+$scope.twitterName+' said ';
    $scope.picText = "She doesn't like these people: "
    $scope.also = ' offensive words';
    var i = 0;
    var badWordCount = 0;
    for (var j = 0; j < 5; j++){
      var pic = '';
      pic += '<section id="redDimmer" class="pics" style="background: url('+url+'); background-size: contain;">';
      pic += '</section>';
      $('#pics').append(pic);
    }
    $('#pics').append('<div class="clear"></div>');
    angular.forEach(response.data.words_with_texts, function(data){
      badWordCount += data.count;
      var barDiv =  '<p id="whatbarBadWord">'+data.word.toUpperCase()+'</p>'+
                    '<div class="whatbar_chart" style="width:'+data.count*3+'px;"></div>'+
                    '<p id="whatbarWordCount">'+data.count+' times</p>';
      $("#whatbars").append(barDiv);
      var texts = "";
      texts += '<div class="TickerNews" id="text_move'+(i+1)+'"> <div class="ti_wrapper"> <div class="ti_slide"> <div class="ti_content"> ';
      var k = 0;
      data.texts.forEach(function(text){
        texts += '<div class="ti_news" id="ti_news'+k+'">';
        text.tweet.split(" ").forEach(function(word){
          if(word == data.word){
            texts += '<span id="whatmarkWord">'+word.toUpperCase()+'&nbsp</span>'
          } else if(word.startsWith('@')) {
            texts += '<span class="whatmark">'+word.toUpperCase()+'&nbsp</span>'
          } else {
            texts += word.toUpperCase() + '&nbsp';
          }
        })
        texts += '&nbsp&nbsp + &nbsp&nbsp</div> ';
        k++;
      });
      texts += '</div> </div> </div> </div>';
      $("#whatbad_words").append(texts);
      var news = $("#text_move"+(i+1)).newsTicker();
      setMovingTextClass(news, i);
      i++;
    });
    $scope.badWordCount = badWordCount;
    $('#whatContent').append('<div class="clear"></div>');
    },function (error){
      $('#whatContent').append('<section class="error">500<br>Twitter connection error</section>');
  });
});

app.controller('whomCtrl', function($scope, $http) {
    $http.get('/api/getUsers').then(function (response){
    $scope.mostHating = 'MOST HATING';
    $scope.users = 'USERS';
    $scope.past = 'The past 7 days on Twitter';
    var i = 1;
    angular.forEach(response.data, function(value){
      var names = value.tweeter_name.split(" ");
      var name = "";
      angular.forEach(names, function(val){
        if(names.length <= 1){
          name = names[0] + '<br>';
        }
        else{
          name += val + '<br>';
        }
      });
      var followersCount = '<span id="location"><span id="background">'+value.followers_count+' followers</span></span>';
      var cube =  '<a href="/what?name='+value.tweeter_name+'">'+
                      '<section class="cube" id="cube'+i+'">'+
                      '<p id="userName"><span class="blackHighlight">'+name.substring(0, 10)+'</span>'+followersCount+'</p>'+
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
        if(currentRoute.startsWith('what')){
          currentRoute = 'whom';
        } else if(currentRoute.startsWith('how')){
          currentRoute = '/';
        }
        return page === currentRoute ? 'active' : '';
    };   
}]);

app.controller('filterCtrl', ['$scope', function ($scope, $location) {

    $scope.filterButtons = [{
      Name: 'BODY',
      Id: 'filterBody',  
    },{
      Name: 'GENDER',
      Id: 'filterGender', 
    },{
      Name: 'VICTIM',
      Id: 'filterVictim',
    }];
  
  $('.filterOptions').click(function() {
    if(!flag){
      $('.filterOptions').addClass('active');
      $('#close').removeClass('hidden');
      $('.filterItem').slideToggle(200);
      $('nav ul').css('opacity', '0.1');
      $('#leftText').css('opacity', '0.1');
      $('#cubeContainer').css('opacity', '0.1');
      $("#filterBody").click(filterBtnClick('body'));
      $("#filterGender").click(filterBtnClick('gender'));
      $("#filterVictim").click(filterBtnClick('victim'));
      flag = true;
    }
  });

  $('#close').click(function(){
    if(flag){
      $('nav ul').css('opacity', '1');
      $('#leftText').css('opacity', '1');
      $('#cubeContainer').css('opacity', '1');
      $('.filterOptions').removeClass('active');
      $('#close').addClass('hidden');
      $('.filterItem').slideToggle(200);
      flag = false;
    }
  });
}]);