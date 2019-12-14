/*
 * 参考 https://www.html5rocks.com/ja/tutorials/webaudio/intro/
 *      https://qiita.com/zprodev/items/7fcd8335d7e8e613a01f
 */
'use strict';


var audioCtx;
var audioBufferes = [];

const audioInitEventName = typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup';
document.addEventListener(audioInitEventName, initAudioContext);


// AudioContextの初期化
function initAudioContext(){
	console.log("silent play");
	document.removeEventListener(audioInitEventName, initAudioContext);
	audioCtx.resume();
}

//
window.addEventListener("load", function(e){
	try {
		window.AudioContext = window.AudioContext||window.webkitAudioContext;
		audioCtx = new window.AudioContext();
	}
	catch(e) {
		console.log('Web Audio API is not supported in this browser');
	}
});

function loadSound(name, url) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	// Decode asynchronously
	request.onload = function() {
		audioCtx.decodeAudioData(request.response, function(buffer) {
			audioBufferes[name] = buffer;
		}, function(){
			console.log("load error");
		});
	}
	request.send();
}

function playSound(name, isLoop) {
	if(!audioBufferes[name]){
		return;
	}
	var source = audioCtx.createBufferSource();
	source.buffer = audioBufferes[name];
	source.connect(audioCtx.destination);
	source.loop = isLoop;
	source.start(0);
}
