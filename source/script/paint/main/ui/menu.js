"use strict";

export function app_menu( app ) {
	app.menu = {}
	app.menu.here = null;

	function menu_page( _class, a, f ) {
		let self = this;

		this.class = _class;
		if ( ! a ) return;
		this.a = document.getElementById( a );

		this.a.addEventListener( "click", function ( event ) {
			if ( self.a.hasAttribute( "disabled" ) ) return;
			self.activate();
			if ( f ) f();
		});
	}

	menu_page.prototype.deactivate = function() {
		document.body.classList.remove( this.class );
	};

	menu_page.prototype.activate = function() {
		// for ( let page of Object.values( app.menu.file ) ) page.deactivate();
		if ( app.menu.here ) app.menu.here.deactivate();
		document.body.classList.add( this.class );
		app.menu.here = this;
	};

	app.menu.file = {};

	function app_edit() {
		[
			app.menu.file.save.a,
			app.menu.file.save_as.a,
			app.menu.file.export.a,
			app.menu.file.none.a,
			document.getElementById( "a-edit" )
		].forEach( el => el.removeAttribute( "disabled" ) );

		app.edit();
	}

	function app_none() {
		[
			app.menu.file.save.a,
			app.menu.file.save_as.a,
			app.menu.file.export.a,
			app.menu.file.none.a,
			document.getElementById( "a-edit" )
		].forEach( el => el.setAttribute( "disabled", "" ) );
	}

	app.menu.file.none    = new menu_page( "file-none",    "a-file-close", app_none );
	app.menu.file.new     = new menu_page( "file-new",     "a-file-new" );
	app.menu.file.open    = new menu_page( "file-open",    "a-file-open" );
	app.menu.file.save    = new menu_page( "file-save",    "a-file-save" );
	app.menu.file.save_as = new menu_page( "file-save-as", "a-file-save-as" );
	app.menu.file.import  = new menu_page( "file-import",  "a-file-import" );
	app.menu.file.export  = new menu_page( "file-export",  "a-file-export" );

	app.menu.file.edit    = new menu_page( "file-edit", null );

	app.menu.file.none.activate();

	document.getElementById( "a-file-new-cancel" ).onclick = function( event ) {
		app.menu.file.none.activate();
	};

	document.getElementById( "a-file-new-ok" ).onclick = function( event ) {
		app.menu.file.edit.activate();
		app_edit();
	};

	document.getElementById( "a-file-new-format" ).onclick = function( event ) {
		if ( document.getElementById( "a-file-new-format" ).hasAttribute( "disabled" ) ) return;
		document.getElementById( "page-file-new-none" ).classList.add( "prev" );
		document.getElementById( "page-file-new-format" ).classList.remove( "next" );
	};

	document.getElementById( "a-file-export-ok" ).onclick = function( event ) {
		let el = document.createElement( "a" );
		el.href = app.context.render.canvas.toDataURL( "image/png" ).replace( "image/png", "application/octet-stream" );
		el.download = "untitled.png";
		el.click();
	};
}
