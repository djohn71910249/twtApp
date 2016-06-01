var twtApp = angular.module('twtApp', []);

twtApp.run(function($rootScope, $sce) {
  	$rootScope.decode = function(twt) {
		var twtText = twt.text;
		var urls = twt.entities.urls;
			
		var substrings = [];
		var start = 0;
		var substring = "";
		
		for (var i = 0; i < urls.length; i++) {
			var url = urls[i];
			var finish = start + url.indices[0];
			
			substring = twtText.substring(start, finish);
			substrings.push(substring);
			start = url.indices[1];
			
			var urlSubstring = "<a href='" + url.expanded_url + "' target='_blank'>" + url.display_url + "</a>";
			substrings.push(urlSubstring);
		}
		
		if (twt.extended_entities.media != null && twt.extended_entities.media.length > 0)
			finish = twt.extended_entities.media[0].indices[0];
		else
			finish = twtText.length - 1;
		
		substring = twtText.substring(start, finish);
		substrings.push(substring);
		
		var t = substrings.join("");
		var decoded = angular.element('<textarea />').html(t).text();
		return $sce.trustAsHtml(decoded);
	};
	
	$rootScope.parseDate = function(text) {
		return new Date(text);
	}
});

function listController($scope, $http, $sce) {
	
    $http.get('./api/twts')
        .success(function(data) {
            $scope.twts = data;
            console.log(data);
        })
        .error(function(e) {
            console.log('Error: ' + e);
        });
		
	$scope.isRetweeted = function(retweeted) {
		return retweeted ? "Retweeted" : "Not retweeted"
	};	
}

function viewController($scope, $http, $sce) {
    $scope.twt = {};
	var twtId = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);

    $http.get('../api/twt/' + twtId)
        .success(function(data) {
            $scope.twt = data;
            console.log(data);
        })
        .error(function(e) {
            console.log('Error: ' + e);
        });
		
	$scope.retweet = function(retweeted) {
		$http.get('../api/retwt/' + twtId)
			.success(function(data) {
				$scope.twt = data;
				console.log(data);
			})
			.error(function(e) {
				console.log('Error: ' + e);
			});
	};
}