var source = app.audioContext.createMediaElementSource( $('audio')[0] )
app.setIn( source )

var delay = app.audioContext.createDelay( 4 )
delay.delayTime.value = 4
source.connect( delay )

app.setOut( delay )