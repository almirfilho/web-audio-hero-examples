var source

navigator.webkitGetUserMedia(
	{ audio: true },

	function( stream ){
	    source = app.audioContext.createMediaStreamSource( stream )
	    app.setIn( source )
	},

	function(){
		alert('ocorreu um erro')
	}
)