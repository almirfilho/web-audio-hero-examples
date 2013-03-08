var app = (function(){

	var app = {

		bars: {
			width: 5,
			space: 1,
			count: 0
		},

		playing: false,
		playingStream: 'in',

		init: function(){

			// setando os canvas
			app.canvasIn  = $( '#canvas-in' )
			app.canvasOut = $( '#canvas-out' )

			// setando dimensoes dos canvas
			$('canvas').each( function(i, e){

				$(e).attr({
					'width': $(e).width(),
					'height': $(e).height()
				})
			})

			// obtendo contextos dos canvas
			app.contextIn  = app.canvasIn[0].getContext( '2d' )
			app.contextOut = app.canvasOut[0].getContext( '2d' )

			// criando contexto de audio
			app.audioContext = new webkitAudioContext()

			// criando gain nodes para controlar a saida
			app.gainIn = app.audioContext.createGain()
			app.gainIn.connect( app.audioContext.destination )

			app.gainOut = app.audioContext.createGain()
			app.gainOut.gain.value = 0
			app.gainOut.connect( app.audioContext.destination )

			// criando analisadores
			app.analyserIn     = app.audioContext.createAnalyser()
			app.analyserInData = new Uint8Array( app.analyserIn.frequencyBinCount )
			app.analyserIn.connect( app.gainIn )

			app.analyserOut     = app.audioContext.createAnalyser()
			app.analyserOutData = new Uint8Array( app.analyserOut.frequencyBinCount )
			app.analyserOut.connect( app.gainOut )

			// setando a quantidade de barras total
			app.bars.count = parseInt( app.canvasIn.width() / (app.bars.width + app.bars.space) )

			// app.start()
			return app
		},

		draw: function(){

			// coletando dados dos analisadores
			app.analyserIn.getByteFrequencyData( app.analyserInData )
			app.analyserOut.getByteFrequencyData( app.analyserOutData )

			// apagando o canvas
			app.clear()

			var rect = 0
			app.contextIn.fillStyle = app.contextOut.fillStyle = 'rgb(189, 73, 50)'

			for( i = 0; i < app.bars.count; i++ ){

				gap  = i * (app.bars.width + app.bars.space)
			    // rect = Math.pow(app.analyserInData[i] * app.canvasIn[0].height / 4200, 2)
			    rect = app.analyserInData[i] * app.canvasIn[0].height / 300
			    app.contextIn.fillRect( gap, (app.canvasIn[0].height - rect)/2, app.bars.width, rect)

			    // rect = Math.pow(app.analyserOutData[i] * app.canvasOut[0].height / 4200, 2)
			    rect = app.analyserOutData[i] * app.canvasOut[0].height / 300
			    app.contextOut.fillRect( gap, (app.canvasOut[0].height - rect)/2, app.bars.width, rect)
			}

			app.contextIn.fillStyle = app.contextOut.fillStyle = 'rgb(255,248,217)'
			app.contextIn.fillRect( 0, app.canvasIn[0].height/2, app.canvasIn[0].width, 1 )
			app.contextOut.fillRect( 0, app.canvasOut[0].height/2, app.canvasOut[0].width, 1 )

			app.animation = window.requestAnimationFrame( app.draw )
		},

		clear: function(){
			app.contextIn.clearRect( 0, 0, app.canvasIn[0].width, app.canvasIn[0].height )
			app.contextOut.clearRect( 0, 0, app.canvasOut[0].width, app.canvasOut[0].height )
		},

		start: function(){

			app.animation = window.requestAnimationFrame( app.draw )

			if( !!app.source.mediaElement )
				app.source.mediaElement.play()

			else if( !!app.source.start )
				app.source.start(0)

			app.playing = true
		},

		stop: function(){

			if( !!app.source.mediaElement )
				app.source.mediaElement.pause()

			else if( !!app.source.stop )
				app.source.stop(0)

			app.playing = false

			setTimeout( function(){
				window.cancelAnimationFrame( app.animation )
				app.clear()
			}, 500 )
		},

		setIn: function( node ){
			app.source = node
			app.source.connect( app.analyserIn )
		},

		setOut: function( node ){
			node.connect( app.analyserOut )
		},

		in: function(){
			if( app.playingStream != 'in' ){
				app.gainIn.gain.value = 1
				app.gainOut.gain.value = 0
				$('canvas').toggleClass( 'playing' )
				app.playingStream = 'in'
			}
		},

		out: function(){
			if( app.playingStream != 'out' ){
				app.gainIn.gain.value = 0
				app.gainOut.gain.value = 1
				$('canvas').toggleClass( 'playing' )
				app.playingStream = 'out'
			}
		}
	}

	return app.init()

})()

$('#in-btn').click( function(){
	app.in()
})

$('#out-btn').click( function(){
	app.out()
})

$('#start').click( function(){

	if( app.playing ){

		app.stop()
		$(this).text( 'start()' )

	} else {

		app.start()
		$(this).text( 'stop()' )
	}
})