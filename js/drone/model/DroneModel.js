threadMeUp.AppView = Backbone.View.extend({

	el: $('body'),

	initialize: function() {
		console.log('initializing appview');
		var url = 'http://api.dronestre.am/data';
	}
});