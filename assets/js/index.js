var accessToken = "f0d3f2b1f9034658bc5668791cfa8306";
var baseUrl = "https://api.api.ai/v1/";
var recognition;
/*Angular*/
var app = angular.module('MyBot',[]);
app.controller('myCtrl', function ($scope,$http) {
	$scope.KeypressEvent = function ($event) {
		if ($event.which === 13) {
			$event.preventDefault();
			sendAngular($scope,$http);
		}
	};
	$scope.Recording = function () {
		switchRecognition($scope);
	}
});
function startRecognition() {
	recognition = new webkitSpeechRecognition();
	recognition.onstart = function(event) {
		updateRec();
	};
	recognition.onresult = function(event) {
		var text = "";
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			text += event.results[i][0].transcript;
		}
		setInput(text);
		stopRecognition();
	};
	recognition.onend = function() {
		stopRecognition();
	};
	recognition.lang = "en-US";
	recognition.start();
}

function stopRecognition() {
	if (recognition) {
		recognition.stop();
		recognition = null;
	}
	updateRec();
}
function switchRecognition($scope) {
	$scope.ActiveClass = [];
	if (recognition) {
		stopRecognition();
		$scope.ActiveClass.pop('active');
	} else {
		startRecognition();
		$scope.ActiveClass.push('active');
	}
}
function setInput(text,$scope) {
	$scope.chatValue = text;
	sendAngular();
}
function updateRec() {
	var myClass = angular.element(document.getElementsByClassName('recording'));
	myClass.toggleClass('active');
}
function sendAngular($scope,$http) {
	var text = $scope.chatValue;
	var chatMe = angular.element(document.getElementById('chatContent'));
	chatMe.append('<li class="me">'+text+'</li>');
	$scope.chatValue = "";
	$http({
		url: baseUrl + "query?v=20150910",
		method: "POST",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		headers: {
			"Authorization": "Bearer " + accessToken
		},
		data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
	}).then(function successCallback(response) {
		// this callback will be called asynchronously
		// when the response is available
		// console.log('data',response.data.result.fulfillment.speech);
		var chatBot = angular.element(document.getElementById('chatContent'));
		chatBot.append('<li class="him">'+response.data.result.fulfillment.speech+'</li>');
		var objDiv = document.getElementById("chat-box-container");
		objDiv.scrollTop = objDiv.scrollHeight;
	}, function errorCallback(response) {
		// called asynchronously if an error occurs
		// or server returns response with an error status.
		$scope.error = response.statusText;
		console.log(response)
	});
}

/*Jquery*/
// $(document).ready(function() {
// 	$("#chat-value").keypress(function(event) {
// 		if (event.which == 13) {
// 			event.preventDefault();
// 			sendJquery();
// 		}
// 	});
// 	$(".micro").click(function(event) {
// 		switchRecognition();
// 	});
// });
// var recognition;
// function startRecognition() {
// 	recognition = new webkitSpeechRecognition();
// 	recognition.onstart = function(event) {
// 		updateRec();
// 	};
// 	recognition.onresult = function(event) {
// 		var text = "";
// 		for (var i = event.resultIndex; i < event.results.length; ++i) {
// 			text += event.results[i][0].transcript;
// 		}
// 		setInput(text);
// 		stopRecognition();
// 	};
// 	recognition.onend = function() {
// 		stopRecognition();
// 	};
// 	recognition.lang = "en-US";
// 	recognition.start();
// }
//
// function stopRecognition() {
// 	if (recognition) {
// 		recognition.stop();
// 		recognition = null;
// 	}
// 	updateRec();
// }
// function switchRecognition() {
// 	if (recognition) {
// 		stopRecognition();
// 		$('.recording').removeClass('active');
// 	} else {
// 		startRecognition();
// 		$('.recording').addClass('active');
// 	}
// }
// function setInput(text) {
// 	$("#chat-value").val(text);
// 	sendJquery();
// }
// function updateRec() {
// 	$('.recording').toggleClass('active');
// }
// function sendJquery() {
// 	var text = $("#chat-value").val();
// 	$('<li class="me">'+text+'</li>').appendTo('.chatting-content-style');
// 	$.ajax({
// 		type: "POST",
// 		url: baseUrl + "query?v=20150910",
// 		contentType: "application/json; charset=utf-8",
// 		dataType: "json",
// 		headers: {
// 			"Authorization": "Bearer " + accessToken
// 		},
// 		data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
// 		success: function(data) {
// 			setResponse(JSON.stringify(data, undefined, 2));
// 			$('<li class="him">'+data.result.fulfillment.speech+'</li>').appendTo('.chatting-content-style');
// 			$('#chat-value').val('');
// 			var objDiv = document.getElementById("chat-box-container");
// 			objDiv.scrollTop = objDiv.scrollHeight;
// 		},
// 		error: function() {
// 			setResponse("Internal Server Error");
// 		}
// 	});
// 	setResponse("Loading...");
// }
// function setResponse(val) {
// 	$("#response").text(val);
// }