/**
 * dialogFx.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
;( function( window ) {
	
	'use strict';

	var support = { animations : Modernizr.cssanimations },
		animEndEventNames = { 'WebkitAnimation' : 'webkitAnimationEnd', 'OAnimation' : 'oAnimationEnd', 'msAnimation' : 'MSAnimationEnd', 'animation' : 'animationend' },
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
		onEndAnimation = function( el, callback ) {
			var onEndCallbackFn = function( ev ) {
				if( support.animations ) {
					if( ev.target != this ) return;
					this.removeEventListener( animEndEventName, onEndCallbackFn );
				}
				if( callback && typeof callback === 'function' ) { callback.call(); }
			};
			if( support.animations ) {
				el.addEventListener( animEndEventName, onEndCallbackFn );
			}
			else {
				onEndCallbackFn();
			}
		};

	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function DialogFx( el, options ) {
		this.el = el;
		this.options = extend( {}, this.options );
		extend( this.options, options );
		this.ctrlsClose = this.el.querySelectorAll( '[data-dialog-close]' );
		this.isOpen = false;
		this.inProgress = false;
		this._initEvents();
	}

	DialogFx.prototype.options = {
		// callbacks
		onFirstOpenDialog: function() { return false; },
		onBeforeOpenDialog : function() { return false; },
		onOpenDialog : function() { return false; },
		onBeforeCloseDialog : function() { return false; },
		onCloseDialog : function() { return false; },

		//timing for callbacks
		nDefaultTimeOpenDialog: 0,
		nDefaultTimeCloseDialog: 0
	}

	DialogFx.prototype._initEvents = function() {
		var self = this;

		// close action for multiple elements
		for (var iClose = this.ctrlsClose.length - 1; iClose >= 0; iClose--){
			this.ctrlsClose[iClose].addEventListener( 'click', this.toggle.bind(this) );
		};

		// esc key closes dialog
		document.addEventListener( 'keydown', function( ev ) {
			var keyCode = ev.keyCode || ev.which;
			if( keyCode === 27 && self.isOpen ) {
				self.toggle();
			}
		} );


		var oDialogOVerlay = this.el.querySelector( '.dialog__overlay' );
		if( oDialogOVerlay !== null ){
			oDialogOVerlay.addEventListener( 'click', this.toggle.bind(this) );	
		}
	}

	DialogFx.prototype.toggle = function() {
		//the toggle can be executed when any other open / close operation is in progress
		var self = this;

		//operation in progress
		this.inProgress = true;

		if(!this.isEverOpen){
			// callback the first time before to open
			this.options.onFirstOpenDialog(this);
			this.isEverOpen = true;
		}


		/**
		 * close operation
		 */
		if(this.isOpen){
			// callback before to close
			this.options.onBeforeCloseDialog(this);

			var this_this = this;

			setTimeout(function(){
				classie.remove(this_this.el, 'dialog--open');
				classie.add(self.el, 'dialog--close');

				onEndAnimation(this_this.el.querySelector('.dialog__content'), function() {
					classie.remove(self.el, 'dialog--close');
				});

				// callback on close
				this_this.options.onCloseDialog(this_this);

				/**
				 * toggle operation in progress ended
				 */
				this_this.inProgress = false;
			}, this.options.nDefaultTimeCloseDialog);
		}
		/**
		 * open operation
		 */
		else {
			// callback before to open
			this.options.onBeforeOpenDialog(this);

			var this_this = this;

			setTimeout(function(){
				classie.add(this_this.el, 'dialog--open');

				// callback on open
				this_this.options.onOpenDialog(this_this);

				/**
				 * toggle operation in progress ended
				 */
				this_this.inProgress = false;

			}, this.options.nDefaultTimeOpenDialog);
		}

		this.isOpen = !this.isOpen;
	};

	// add to global namespace
	window.DialogFx = DialogFx;

})( window );
