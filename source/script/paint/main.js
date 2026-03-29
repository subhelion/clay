"use strict";

import { tab_list } from "../app/tab-list.js"

import { app } from "./main/app.js"
import { ui_top } from "../app/top.js"


import "./main/ui/canvas.js"
import "./main/tool.js"

import "./main/ui/scrubber.js"
import "./main/ui/tool.js"
import "./main/ui/layout.js"
import "./main/ui/palette.js"
import "./main/ui/layer.js"
import "./main/ui/history.js"

import "./wip.js"

import { app_init, app_canvas_resize } from "./app.js";

import { app_draw }          from "./main/draw.js";
import { update_layer_mode } from "./main/ui/layout.js";
import { update_tool_mode }  from "./main/ui/layout.js";
import { tool_init }         from "./main/ui/tool.js";

import { ui_list_layer } from "./main/ui/layer.js";
import { ui_palette }    from "./main/ui/palette.js";
import { storage }       from "./app/session.js";

new tab_list( document.getElementById( "menu-tab" ) );
new tab_list( document.getElementById( "tray-tab" ) );

app.ui.top       = new ui_top();
app.ui.palette   = new ui_palette();
app.ui.layer     = new ui_list_layer();
app.history_item = null;
app.storage      = new storage();

app_init();
app_canvas_resize();
app_draw();

app.layer_mode_index = app.storage.get( "app.mode.layer" ) || 1;
update_layer_mode();
app.tool_mode_index = app.storage.get( "app.mode.tool" ) || 2;
update_tool_mode();

tool_init();

async function get_keyboard_layout() {
	let map = await navigator.keyboard.getLayoutMap();

	map.forEach( function( el, i ) {

	});
}

get_keyboard_layout();



document.getElementById( "a-file-export" ).onclick = function( event ) {
	let el = document.createElement( "a" );
	el.href = app.context.render.canvas.toDataURL( "image/png" ).replace( "image/png", "application/octet-stream" );
	el.download = "untitled.png";
	el.click();
};

document.getElementById( "a-file-new-format" ).onclick = function( event ) {
	if ( document.getElementById( "a-file-new-format" ).hasAttribute( "disabled" ) ) return;
	document.getElementById( "page-file-new-raster" ).classList.add( "prev" );
	document.getElementById( "page-file-new-format" ).classList.remove( "next" );
};

document.getElementById( "a-file-new-cancel" ).onclick = function( event ) {
	document.body.classList.add( "file-none" );
	document.body.classList.remove( "file-new" );
};

function menu_t() {
	let self = this;

	function menu_page( _class ) {
		this.class = _class;
	}

	menu_page.prototype.deactivate = function() {
		document.body.classList.remove( this.class );
	};

	menu_page.prototype.activate = function() {
		for ( let page of Object.values( self.file ) ) page.deactivate();
		document.body.classList.add( this.class );
	};

	this.file = {};
	this.file.none   = new menu_page( "file-none" );
	this.file.new    = new menu_page( "file-new" );
	this.file.open   = new menu_page( "file-open" );
	this.file.import = new menu_page( "file-import" );
	this.file.edit   = new menu_page( "file-edit" );
}

app.ui.menu = new menu_t();
app.ui.menu.file.none.activate();

document.getElementById( "a-file-new" ).onclick = function( event ) {
	app.ui.menu.file.new.activate();
	document.body.classList.remove( "app-overlay-show" );
	$$( "top > ul > li.active" ).forEach( el => el.classList.remove( "active" ) );
};

document.getElementById( "a-file-open" ).onclick = function( event ) {
	app.ui.menu.file.open.activate();
	document.body.classList.remove( "app-overlay-show" );
	$$( "top > ul > li.active" ).forEach( el => el.classList.remove( "active" ) );
};

document.getElementById( "a-file-import" ).onclick = function( event ) {
	app.ui.menu.file.import.activate();
	document.body.classList.remove( "app-overlay-show" );
	$$( "top > ul > li.active" ).forEach( el => el.classList.remove( "active" ) );
};

document.getElementById( "a-file-new-ok" ).onclick = function( event ) {
	app.ui.menu.file.edit.activate();
	document.body.classList.remove( "file-none" );
};
