var request = new XMLHttpRequest()
request.open("GET", "../music.mp3", true)
request.responseType = "arraybuffer"
var source;

request.onload = function(){

	source = app.audioContext.createBufferSource()
    source.buffer = app.audioContext.createBuffer( request.response, false )
	app.setIn( source )
}

request.send()