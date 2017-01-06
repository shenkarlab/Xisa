'use strict';

var app = angular.module('xisa', []);

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
    $http.get('who.json')
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
									'<p id="celebName">'+value.name+'</p>'+
									'<p id="isA">is the</p>'+
									'<p id="hashtag">#'+value.word+'</p>'+
									'<p id="reference" count="'+value.retweet_count+'">'+value.retweet_count+' reference</p>'+
								'</section>'+
							'<a>';
				$('#cubeContainer').append(cube);
				i++;
	    	})
	    	$scope
	    	$scope.showBuzz = function(){
      			$scope.visability = "visible";
      			$('#buzz').css('color', '#010101');
      			$('#title').css('color', '#7d7d7d');
      			var range = $scope.maxRetweets - $scope.minRetweets;
      			var categories = [range/5,(range/5)*2,(range/5)*3,(range/5)*4,range+$scope.minRetweets]
      			$('#cubeContainer').children('a').each(function(){
      				var child = $(this).children('section')[0];
      				var temp = $(child).children('#reference')[0];
      				var count = parseInt($(temp).attr('count'));     				
      				if(count <= categories[0]){
      					$(child).css('background-color', color[0]);
      				}
      				else if(count > categories[0] && count <= categories[1]){
      					$(child).css('background-color', color[1]);
      				}
      				else if(count > categories[1] && count <= categories[2]){
      					$(child).css('background-color', color[2]);
      				}	
      				else if(count > categories[2] && count <= categories[3]){
      					$(child).css('background-color', color[3]);
      				}
      				else if(count > categories[3] && count <= categories[4]){
      					$(child).css('background-color', color[4]);
      				}
      			});
    		};
    		$scope.removeBuzz = function(){
    			$scope.visability = "hidden";
    			$('#buzz').css('color', '#7d7d7d');
      			$('#title').css('color', '#010101');
      			$('#cubeContainer').children('a').each(function(){
      				var child = $(this).children('section')[0];
      				$(child).css('background-color', '#E1E1E1');
      			});
    		};

		},function (error){
			var myEl = angular.element(document.querySelector('#retweets'));
			myEl.append('<section>JSON load error</section>');
		});
});

app.controller('howCtrl', function($scope, $http) {
	 $http.get('how.json')
	    .then(function (success){
	    	$scope.name = getUrlParameter('word');
	    	$scope.celeb = getUrlParameter('name').replace("%20", " ");
	     	var i=1;
	     	angular.forEach(success.data, function(value){
	     		var bar = '<section class="bar" id="bar'+i+'">'+value.word.toUpperCase()+'</section>';
	     		$('#bars').append(bar);
	     		var width = (200 + value.bad_words_count * 2).toString();
	     		$('#bar'+i).css('width', width);
	     		i++;
	     	});
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
 
