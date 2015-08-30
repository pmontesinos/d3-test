threadMeUp.AppModel = Backbone.Model.extend({
	
	urlRoot: 'http://api.dronestre.am/data?callback=?',

	sync: function(method, collection, options) {
		options.dataType = "jsonp";
    	return Backbone.sync(method, collection, options);
	},

	defaults: {
		status: '',
		strike: []
	}
});