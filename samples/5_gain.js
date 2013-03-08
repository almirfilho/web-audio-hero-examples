var source = app.audioContext.createMediaElementSource( $('audio')[0] )
app.setIn( source )

var gainNode = app.audioContext.createGain()
gainNode.gain.value = 0.1
source.connect( gainNode )

app.setOut( gainNode )