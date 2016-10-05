//
// Roundcube styled Popups Plugin
//

// plugin class
plugin_styled_popups = function plugin_styled_popups() {
	var self = this;

	// plugin name space
	this.key = function(name) {
		return 'plugin.styled_popups.' + name; // keep in sync with *.php
	}

	// environment variable
	this.env = function(name) {
		return rcmail.env[self.key(name)];
	}

	// plugin client logger
	this.log = function(text, force) {
		if (self.env('enable_logging') || force) {
			var name = arguments.callee.caller.name;
			var entry = self.key(name);
			rcmail.log(entry + ': ' + text);
		}
	};

	// provide localization
	this.localize = function(name) {
		return rcmail.get_label(name, 'styled_popups');
	}

	// convert object to text
	this.json_encode = function(json, tabs) {
		return JSON.stringify(json, null, tabs);
	}

	// convert text to object
	this.json_decode = function(text) {
		return JSON.parse(text);
	}

	//
	this.is_plugin_active = function is_plugin_active() {
		return self.env('activate_plugin');
	}

	//
	this.styled_alert = function styled_alert(message) {
		self.log('...');
		return self.window_alert(message);
	}

	//
	this.styled_confirm = function styled_confirm(message) {
		self.log('...');

		var content = $('<div>');

		var label = $('<label>').text(message).appendTo(content);

		var title = 'confirm';

		var sleep = true;
		var result = false;

		var buttons = [ {
			id : 'cancel',
			text : self.localize('no'),
			click : function() {
				result = false;
				sleep = false;
				$(this).dialog('close');
			},
			class : 'mainaction',
		}, {
			id : 'submit',
			text : self.localize('yes'),
			click : function() {
				result = true;
				sleep = false;
			},
		} ];

		var options = {}

		// rcmail.show_popup_dialog(content, title, buttons, options);

		var frame = $('<iframe>').attr({
			id : 'framer',
			// src : rcmail.url('settings/about'),
			src : rcmail.url('styled_popups/confirm'),
			frameborder : '0',
		// sandbox : 'allow-scripts',
		});

		frame
				.on(
						'load',
						function load() {

							// window.addEventListener('message',
							// self.frame_receive);
							// window.postMessage('hello from frame', '*');

							// function again() {
							// var time = new Date().getTime() / 1000;
							// self.log(time);
							// window.setTimeout(again, 1000);
							// }

							// again();

							// window.setTimeout(function nested_init() {
							// self.log('...');
							// $('nested_frame');
							// }, 1000);

							var target = frame[0].contentWindow.document;

							var template = [ //
									'<b>', //
									'yes', //
									'</b>', //
									"<script> ", //
									"top.postMessage('hello', '*'); ", //
									"window.addEventListener('message', function(event){ console.log(event); });", //
									"function loop(){ console.log('loop'); setTimeout(loop,1000); }; loop();", //
									"</script>", //
							].join('');
							var blob = new Blob([ template ], {
								type : "text/html"
							});
							var blob_url = URL.createObjectURL(blob);
							var blob_iframe = $(target).find('#nested_frame')[0];
							blob_iframe.src = blob_url;

						});

		frame.dialog({
			modal : true,
			resizable : false,
			closeOnEscape : true,
			title : null,
			close : function() {
				frame.dialog('destroy').remove();
			},
			// buttons : buttons,
			width : 400,
			height : 300,
		});

		self.log('done');

		return false; // result;
	}

	self.await = function await() {
		var time = new Date().getTime() / 1000;
		self.log(time);
		var action = self.key('action_delay');
		var url = "?_action=" + action;
		var ajax = new XMLHttpRequest();
		ajax.open("get", url, false); // block
		ajax.send();
	}

	//
	this.styled_prompt = function styled_prompt(prompt, input) {
		self.log('...');
		return self.window_prompt(prompt, input);
	}

	// plugin setup
	this.initialize = function initialize() {

		if (self.is_plugin_active()) {
			self.log('active');
		} else {
			self.log('inactive');
			return;
		}

		self.window_alert = window.alert;
		self.window_confirm = window.confirm;
		self.window_prompt = window.prompt;

		// window.alert = self.styled_alert; // .bind(window);
		// window.confirm = self.styled_confirm; // .bind(window);
		// window.prompt = self.styled_prompt; // .bind(window);

		// var action = self.key('action_render');
		// rcmail.http_post(action, {
		// action : action,
		// });

		// var action = self.key('action_delay');
		// rcmail.http_post(action, {
		// action : action,
		// });

		self.log('task: ' + rcmail.env.task);
		self.log('action: ' + rcmail.env.action);

		if (rcmail.env.task == 'styled_popups') {
			//
		} else {
			self.styled_confirm('hello');

			window.addEventListener('message', self.root_receive);

			window.setTimeout(function() {
				// var window = document.getElementById('framer').contentWindow;
				// window.postMessage('hello', '*');
			}, 1000);

			// while (true) {
			// self.await();
			// }
		}

		// var frame = $('#pluginbody'); // $('#dialog_frame');
		// self.log('frame: ' + frame.length);

	}

	this.root_receive = function root_receive() {
		self.log(event.origin);
		console.log(event);
		// self.log(event.origin);
		// self.log(event.source);
		// var result = 'result';
		event.source.postMessage('haha', event.origin);
	}

	this.frame_receive = function frame_receive() {
		self.log(event.origin);
		console.log(event);
		// self.log(event.origin);
		// self.log(event.source);
	}

	self.initialize();

}

// plugin scope
if (window.rcmail) {

	// plugin instance
	rcmail.addEventListener('init', function(param) {
		plugin_styled_popups.instance = new plugin_styled_popups();
	});

}
