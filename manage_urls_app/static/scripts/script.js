'use strict';

var app = angular.module('xisa', []);
var path = 'xisaserver.herokuapp.com';

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
    $scope.visability = "hidden";
    $http.get(path +'/getCelebs')
	    .then(function (success){
	    	$scope.minRetweets = 9999999999;
    		$scope.maxRetweets = 0;
    		var i = 1;
    		var color = ['#dadada','#c7c7c7','#b5b5b5','#a2a2a2','#464646'];
	    	angular.forEach(success.data, function(value){
	    		if(value.retweet_count > $scope.maxRetweets){
	    			$scope.maxRetweets = value.retweet_count;
	    		}
	    		if(value.retweet_count < $scope.minRetweets){
	    			$scope.minRetweets = value.retweet_count;
	    		}
	    		var cube =	'<a href="how.html?name='+value.name+'&word='+value.word+'">'+
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
        var range = $scope.maxRetweets - $scope.minRetweets;
        var categories = [range/10,(range/10)*2,(range/10)*3,(range/10)*4,(range/10)*5,(range/10)*6,(range/10)*7,(range/10)*8,(range/10)*9,range+$scope.minRetweets];
	    	

		},function (error){
			var myEl = angular.element(document.querySelector('#retweets'));
			myEl.append('<section>JSON load error</section>');
		});
});

app.controller('howCtrl', function($scope, $http) {
	 var lastName = getUrlParameter('name').split("%20")[1];
	 if(lastName == null){
		lastName = getUrlParameter('name');
	 }
	 $http.get(path + 'celeb/'+lastName)
	    .then(function (success){
        $scope.numOfPeople = 0;
	    	$scope.badWord = getUrlParameter('word');
	    	$scope.celebName = getUrlParameter('name').replace("%20", " ").toUpperCase();
	     	$scope.twitterName = getUrlParameter('name').replace("%20", " ");
        var i = 0;
        angular.forEach(success.data, function(data){
          var barDiv =  '<p id="barBadWord">'+data.word.toUpperCase()+'</p>'+
                        '<div class="bar_chart" style="width:'+data.bad_words_count*3+'px;"></div>'+
                        '<p id="barWordCount">'+data.bad_words_count+'</p>'
          $("#bars").append(barDiv);
          var texts = "";
          texts += '<div class="TickerNews" id="text_move'+(i+1)+'"> <div class="ti_wrapper"> <div class="ti_slide"> <div class="ti_content"> ';
          data.Texts.forEach(function(text){
            texts += '<div class="ti_news">'+ text.toUpperCase() + '&nbsp&nbsp + &nbsp&nbsp</div> ';
          });
          texts += '</div> </div> </div> </div>';
          $("#bad_words").append(texts);
          i++;
        })
        $('#howContent').append('<div class="clear"></div>');
        $("#text_move1,#text_move2,#text_move3,#text_move4,#text_move5").newsTicker();
	    },function (error){
			var myEl = angular.element(document.querySelector('#retweets'));
			myEl.append('<section>JSON load error</section>');
		});
});

app.controller('navCtrl', ['$scope', '$location', function ($scope, $location) {

    $scope.navLinks = [{
        Title: 'index.html',
        Alias: 'index.html',
        LinkText: 'WHO'
    }, {
        Title: '#',
        Alias: 'how.html',
        LinkText: 'HOW'
    }, {
        Title: '#',
        Alias: 'what.html',
        LinkText: 'WHAT'
    }, {
        Title: '#',
        Alias: 'whom.html',
        LinkText: 'WHOM'
    }];

    $scope.navClass = function (page) {
        var currentRoute = window.location.pathname.substring(1);
        currentRoute = currentRoute.split("?")[0] || 'index.html';
        return page === currentRoute ? 'active' : '';
    };   

}]);

var movingBars = function(){
    var timer = !1;
    _Ticker = $("#T1").newsTicker();
    _Ticker.on("mouseenter",function(){
        var __self = this;
        timer = setTimeout(function(){
          __self.pauseTicker();
        },200);
    });
    _Ticker.on("mouseleave",function(){
        clearTimeout(timer);
        if(!timer) return !1;
        this.startTicker();
    });
};
