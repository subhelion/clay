"use strict";

import { app } from "../../main/app.js";
import { app_canvas_resize } from "../../app.js";

export function ui_canvas() {
	this.el = document.getElementById( "canvas" );
	this.el_canvas = this.el.children[0];

	const grid = 8;

	this.el.style[ "background-size" ] = grid + "px";

	const padding = 16;

	this.el_canvas.style.top  = padding + "px";
	this.el_canvas.style.left = padding + "px";

	this.scale = 16;

	this.resize = function() {
		this.x = this.el_canvas.getBoundingClientRect().left;
		this.y = this.el_canvas.getBoundingClientRect().top;

		var width  = app.file.width  * this.scale;
		var height = app.file.height * this.scale;

		this.el_canvas.style.width  = width  / window.devicePixelRatio + "px";
		this.el_canvas.style.height = height / window.devicePixelRatio + "px";

		this.el_canvas.width  = width;
		this.el_canvas.height = height;

		this.scale = this.scale;
	};

	let el_zoom = document.getElementById( "zoom" );

	el_zoom.oninput = function() {
		app.ui.canvas.scale = parseInt( this.value ) + 1;
		app_canvas_resize();
	};

	document.getElementById( "a-zoom-inc" ).onclick = function ( event ) {
		app.ui.canvas.scale = Math.min( app.ui.canvas.scale + 1, 32 );
		el_zoom.value = app.ui.canvas.scale - 1;
		app_canvas_resize();
	};

	document.getElementById( "a-zoom-dec" ).onclick = function ( event ) {
		app.ui.canvas.scale = Math.max( app.ui.canvas.scale - 1, 1 );
		el_zoom.value = app.ui.canvas.scale - 1;
		app_canvas_resize();
	};

	function f9() {
		if ( app.ui.canvas.scale == 1 ) {
			app.ui.canvas.scale = app.ui.canvas.stash || 1;
		} else {
			app.ui.canvas.stash = app.ui.canvas.scale;
			app.ui.canvas.scale = 1;
		}

		el_zoom.value = app.ui.canvas.scale - 1;
		app_canvas_resize();
	};

	function f10() {

	}

	let el_f9  = document.getElementById( "f9" );
	let el_f10 = document.getElementById( "f10" );
	let el_f11 = document.getElementById( "f11" );

	el_f9 .onclick = f9;
	el_f10.onclick = f10;

	document.addEventListener( "keydown", function( event ) {
		if ( event.key == "F9"  ) el_f9 .classList.add( "active" );
		if ( event.key == "F10" ) el_f10.classList.add( "active" );
		if ( event.key == "F10" ) event.preventDefault();
	});

	document.addEventListener( "keyup", function( event ) {
		if ( event.key == "F9"  ) el_f9 .classList.remove( "active" );
		if ( event.key == "F10" ) el_f10.classList.remove( "active" );
		if ( event.key == "F9"  ) f9();
		if ( event.key == "F10" ) f10();
	});




	// TODO don't need type : "mousedown" this already exists in event

	this.el.addEventListener( "mousedown", function( event ) {
		app.mouse = {
			x : ( event.clientX - app.ui.canvas.x ),
			y : ( event.clientY - app.ui.canvas.y ),
		};

		app.tool.handle({ type : "mousedown", data : { shift : event.shiftKey } });
		app.toRepaint = true;
	});

	document.addEventListener( "mouseup", function( event ) {
		app.mouse = {
			x : ( event.clientX - app.ui.canvas.x ),
			y : ( event.clientY - app.ui.canvas.y ),
		};

		app.tool.handle({ type : "mouseup", data : { shift : event.shiftKey } });
		app.toRepaint = true;
	});

	this.el.addEventListener( "mouseout", function( event ) {
		// if ( app.drawing ) {
		// 	app.mouse = {
		// 		x : ( event.clientX - app.ui.canvas.x ),
		// 		y : ( event.clientY - app.ui.canvas.y ),
		// 	};

		// 	app.stroke.push( app.mouse );
		// }

		app.mouse = null;
		app.toRepaint = true;
	});

	this.el.addEventListener( "mousemove", function( event ) {
		app.mouse = {
			x : ( event.clientX - app.ui.canvas.x ),
			y : ( event.clientY - app.ui.canvas.y ),
		};

		app.tool.handle({ type : "mousemove", data : { shift : event.shiftKey } });
		app.toRepaint = true;
	});

	document.addEventListener( "keyup", function( event ) {
		if ( app.drawing && event.key == "Shift" ) {
			app.drawing = false;
			app.toRepaint = true;
		}
	});
}

export function screen_to_canvas( p ) {
	var s = app.ui.canvas.scale;

	return {
		x : Math.floor( p.x * window.devicePixelRatio / s ),
		y : Math.floor( p.y * window.devicePixelRatio / s ),
	};
}
