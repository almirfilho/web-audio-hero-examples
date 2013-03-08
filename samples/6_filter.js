var source = app.audioContext.createMediaElementSource( $('audio')[0] )
app.setIn( source )

var filter = app.audioContext.createBiquadFilter()
source.connect( filter )

app.setOut( filter )