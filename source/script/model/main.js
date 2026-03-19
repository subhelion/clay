"use strict";

function canvas_get_context( canvas ) {
	let context = canvas.getContext( "webgl" );

	context.mozImageSmoothingEnabled    = false;
	context.webkitImageSmoothingEnabled = false;
	context.msImageSmoothingEnabled     = false;
	context.imageSmoothingEnabled       = false;

	return context
}

function main() {
	this.context = canvas_get_context( document.getElementById( "display" ) );
	this.context.clearColor( 0, 0, 0, 1.0 );

	this.draw = function() {
		this.context.clear( this.context.COLOR_BUFFER_BIT );
	};

	this.draw();

}

window.addEventListener( "load", () => new main() );
