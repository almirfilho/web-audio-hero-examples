var source = app.audioContext.createMediaElementSource( $('audio')[0] )
app.setIn( source )

var request = new XMLHttpRequest()
request.open("GET", "../ieie.mp3", true)
request.responseType = "arraybuffer"

var convolver

request.onload = function(){

    convolver = app.audioContext.createConvolver()
    convolver.buffer = app.audioContext.createBuffer( request.response, false )
    source.connect( convolver )
    app.setOut( convolver )
}

request.send()